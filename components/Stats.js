import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-elements';
import AppHeader from './AppHeader';
import Duck from '../assets/duck1.png';
import * as firebase from 'firebase';
import { useAuth } from '../contexts/AuthContext';

const db = firebase.firestore();

function getTimeUnits(time) {
   const n = time / 1000;
   const days = Math.round(n / (24 * 3600));
   const hours = Math.round((n % (24 * 3600)) / 3600);
   const minutes = Math.round((n % (24 * 3600 * 3600)) / 60);
   return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes';
}

export default function Stats(props) {
   const [userInfo, setUserInfo] = useState({
      level: 1,
      points: 0,
      totalTasks: 0,
      totalTime: 0,
   });
   const currentUser = { email: 'b@b.com' };
   // const { currentUser } = useAuth();

   const pointsToNextLevel = userInfo?.level * 100 - userInfo?.points;

   useEffect(() => {
      const unsubscribe = db.collection('users').onSnapshot((querySnapshot) => {
         querySnapshot.forEach((doc) => {
            if (doc.id === currentUser?.email) {
               if (doc.data().level) {
                  setUserInfo(doc.data());
               }
            }
         });
      });
      return () => unsubscribe();
   }, []);

   return (
      <View style={{ width: '100%' }}>
         <AppHeader navigation={props.navigation} title='Stats' />
         <Card>
            <Card.Title h2>My Duck</Card.Title>
            <Card.Title h3>{currentUser?.email}</Card.Title>
            <Image source={Duck} style={styles.avatar} />
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
               <Text h3>Level {userInfo?.level}</Text>
               <Text h4>
                  {userInfo?.points}/{userInfo?.level * 100}
               </Text>
               <Text>{pointsToNextLevel} points until the next Level!</Text>
               <View
                  style={{
                     borderTopColor: 'lightgray',
                     borderTopWidth: 1,
                     marginTop: 10,
                     paddingTop: 10,
                  }}
               >
                  <Text style={{ flexDirection: 'row', textAlign: 'center' }}>
                     <Text style={{ fontWeight: 'bold' }}>Total Tasks: </Text>
                     <Text>{userInfo?.totalTasks}</Text>
                  </Text>

                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                     Total Task Time:
                  </Text>
                  <Text style={{ textAlign: 'center' }}>
                     {getTimeUnits(userInfo?.totalTime)}
                  </Text>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                     Average Time to Complete a Task:
                  </Text>
                  {userInfo?.totalTasks !== 0 && (
                     <Text style={{ textAlign: 'center' }}>
                        {getTimeUnits(
                           userInfo?.totalTime / userInfo?.totalTasks
                        )}
                     </Text>
                  )}
               </View>
            </View>
         </Card>
      </View>
   );
}

const styles = StyleSheet.create({
   avatar: {
      width: null,
      resizeMode: 'contain',
      height: 200,
   },
});
