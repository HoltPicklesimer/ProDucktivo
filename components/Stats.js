import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-elements';
import AppHeader from './AppHeader';
import Duck from '../assets/duck1.png';
import * as firebase from 'firebase';
import { useAuth } from '../contexts/AuthContext';

const db = firebase.firestore();

export default function Stats(props) {
   const [userInfo, setUserInfo] = useState({
      level: 1,
      points: 0,
      totalTasks: 0,
      totalTime: 0,
   });
   // const currentUser = { email: 'b@b.com' };
   const { currentUser } = useAuth();

   const pointsToNextLevel = userInfo?.level * 100 - userInfo?.points;

   useEffect(() => {
      const unsubscribe = db.collection('users').onSnapshot((querySnapshot) => {
         querySnapshot.forEach((doc) => {
            if (doc.id === currentUser?.email) {
               setUserInfo(doc.data());
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
               <Text>Level {userInfo?.level}</Text>
               <Text>
                  {userInfo?.points}/{userInfo?.level * 100}
               </Text>
               <View style={{ textAlign: 'left' }}>
                  <Text>{pointsToNextLevel} points until the next Level!</Text>
                  <Text>Total Tasks: {userInfo?.totalTasks}</Text>
                  <Text>Total Time: {userInfo?.totalTime}</Text>
                  {userInfo?.totalTime !== 0 && (
                     <Text>
                        Average Time to Complete a Task:{' '}
                        {userInfo?.totalTasks / userInfo?.totalTime}
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
