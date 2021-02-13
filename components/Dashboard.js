import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard(props) {
   const [error, setError] = useState('');
   const { currentUser, logout } = useAuth();

   async function handleLogout() {
      setError('');

      try {
         await logout().then(props.navigate('login'));
      } catch {
         setError('Failed to log out.');
      }
   }

   return (
      <View style={{ width: '100%' }}>
         <Card>
            <Card.Title h2>Profile</Card.Title>
            {error !== '' && <Text style={styles.alert}>{error}</Text>}
            <Text style={{ marginBottom: 10 }}>
               <Text style={{ fontWeight: 'bold' }}>Email: </Text>{' '}
               {currentUser.email}
            </Text>
            <Button
               onPress={props.navigate.bind(this, 'update-profile')}
               title='Update Profile'
            />
         </Card>
         <Text onPress={handleLogout} style={styles.link}>
            Log Out
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   alert: {
      backgroundColor: 'lightpink',
      borderColor: 'red',
      borderWidth: 1,
      borderRadius: 10,
      margin: 20,
      padding: 10,
      color: 'red',
   },
   link: {
      textAlign: 'center',
      marginTop: 20,
      color: '#007bff',
   },
});
