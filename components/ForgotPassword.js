import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Text, Card, Input } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';

function addError(errors, newError) {
   if (errors != '') {
      errors += '\n';
   }

   errors += newError;
   return errors;
}

export default function ForgotPassword(props) {
   const [email, setEmail] = useState('');
   const { resetPassword } = useAuth();
   const [error, setError] = useState('');
   const [message, setMessage] = useState('');
   const [loading, setLoading] = useState(false);

   async function handleSubmit() {
      try {
         setMessage('');
         setError('');
         setLoading(true);
         await resetPassword(email);
         setMessage('Check your email for further instructions.');
      } catch {
         setError('Failed to reset password.');
      }

      setLoading(false);
   }

   return (
      <View style={{ width: '100%' }}>
         <Card>
            <Card.Title h2>Password Reset</Card.Title>
            {error !== '' && <Text style={styles.alert}>{error}</Text>}
            {message !== '' && <Text style={styles.success}>{message}</Text>}
            <Card.Divider />
            <Input
               size={300}
               placeholder={'Email'}
               onChangeText={(text) => setEmail(text)}
            />
            <Button
               title='Reset Password'
               onPress={handleSubmit}
               disabled={loading}
            />
            <Text
               onPress={props.navigate.bind(this, 'login')}
               style={[styles.link, { textAlign: 'center', marginTop: 10 }]}
            >
               Login
            </Text>
         </Card>
         <Text style={styles.bottomText}>
            Need an account?{' '}
            <Text
               onPress={props.navigate.bind(this, 'signup')}
               style={styles.link}
            >
               Sign Up
            </Text>
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   bottomText: {
      textAlign: 'center',
      marginTop: 20,
   },
   alert: {
      backgroundColor: 'lightpink',
      borderColor: 'red',
      borderWidth: 1,
      borderRadius: 10,
      margin: 20,
      padding: 10,
      color: 'red',
   },
   success: {
      backgroundColor: 'lightgreen',
      borderColor: 'green',
      borderWidth: 1,
      borderRadius: 10,
      margin: 20,
      padding: 10,
      color: 'green',
   },
   link: {
      color: '#007bff',
   },
});
