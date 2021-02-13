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

export default function Login(props) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const { login } = useAuth();
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   async function handleSubmit() {
      try {
         setError('');
         setLoading(true);
         await login(email, password);
         props.navigate('dashboard');
      } catch {
         setError('Failed to log in.');
      }

      setLoading(false);
   }

   return (
      <View style={{ width: '100%' }}>
         <Card>
            <Card.Title h2>Log In</Card.Title>
            {error !== '' && <Text style={styles.alert}>{error}</Text>}
            <Card.Divider />
            <Input
               size={300}
               placeholder={'Email'}
               onChangeText={(text) => setEmail(text)}
            />
            <Input
               size={300}
               placeholder={'Password'}
               onChangeText={(text) => setPassword(text)}
               secureTextEntry={true}
            />
            <Button title='Log In' onPress={handleSubmit} disabled={loading} />
            <Text
               onPress={props.navigate.bind(this, 'forgot-password')}
               style={[styles.link, { textAlign: 'center', marginTop: 10 }]}
            >
               Forgot Password?
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
   link: {
      color: '#007bff',
   },
});
