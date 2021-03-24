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

export default function Signup(props) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [passwordConfirm, setPasswordConfirm] = useState('');
   const { signup } = useAuth();
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   async function handleSubmit() {
      let errors = '';
      if (!email) {
         errors = addError(errors, 'Please enter your email.');
      }

      if (!password) {
         errors = addError(errors, 'Please enter a password.');
      }

      if (password.length < 6) {
         errors = addError(errors, 'Password must be at least 6 characters.');
      }

      if (!passwordConfirm) {
         errors = addError(errors, 'Please confirm your password.');
      }

      if (password != passwordConfirm) {
         errors = addError(errors, 'Passwords do not match.');
      }

      if (errors) {
         return setError(errors);
      }

      try {
         setError('');
         setLoading(true);
         await signup(email, password);
         props.navigate('dashboard');
      } catch {
         setError('Failed to create an account.');
         setLoading(false);
      }

      setLoading(false);
   }

   return (
      <View style={{ width: '100%' }}>
         <Card>
            <Card.Title h2>Sign Up</Card.Title>
            {error !== '' && <Text style={styles.alert}>{error}</Text>}
            <Card.Divider />
            <Input
               size={300}
               placeholder={'Email'}
               onChangeText={(text) => setEmail(text.trim())}
            />
            <Input
               size={300}
               placeholder={'Password'}
               onChangeText={(text) => setPassword(text)}
               secureTextEntry={true}
            />
            <Input
               size={300}
               placeholder={'Password Confirmation'}
               onChangeText={(text) => setPasswordConfirm(text)}
               secureTextEntry={true}
            />
            <Button title='Sign Up' onPress={handleSubmit} disabled={loading} />
         </Card>
         <Text style={styles.bottomText}>
            Already have an account?{' '}
            <Text
               onPress={props.navigate.bind(this, 'login')}
               style={styles.link}
            >
               Log In
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
