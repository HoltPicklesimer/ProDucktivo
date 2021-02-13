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

export default function UpdateProfile(props) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [passwordConfirm, setPasswordConfirm] = useState('');
   const { currentUser, updateEmail, updatePassword } = useAuth();
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   function handleSubmit() {
      let errors = '';
      if (password && password.length < 6) {
         errors = addError(errors, 'Password must be at least 6 characters.');
      }
      if (password != passwordConfirm) {
         errors = addError(errors, 'Passwords do not match.');
      }
      if (errors) {
         return setError(errors);
      }

      const promises = [];
      setLoading(true);
      setError('');
      if (email != currentUser.email) {
         promises.push(updateEmail(email));
      }
      if (password) {
         promises.push(updateEmail(password));
      }

      Promise.all(promises)
         .then(() => {
            props.navigate('dashboard');
         })
         .catch(() => {
            setError('Failed to update account.');
         })
         .finally(() => {
            setLoading(false);
         });
   }

   return (
      <View style={{ width: '100%' }}>
         <Card>
            <Card.Title h2>Update Profile</Card.Title>
            {error !== '' && <Text style={styles.alert}>{error}</Text>}
            <Card.Divider />
            <Input
               size={300}
               label={'Email'}
               onChangeText={(text) => setEmail(text)}
               value={currentUser.email}
            />
            <Input
               size={300}
               label={'Password'}
               placeholder={'Leave blank to keep the same'}
               onChangeText={(text) => setPassword(text)}
               secureTextEntry={true}
            />
            <Input
               size={300}
               label={'Password Confirmation'}
               placeholder={'Leave blank to keep the same'}
               onChangeText={(text) => setPasswordConfirm(text)}
               secureTextEntry={true}
            />
            <Button title='Update' onPress={handleSubmit} disabled={loading} />
         </Card>
         <Text
            onPress={props.navigate.bind(this, 'dashboard')}
            style={[styles.bottomText, styles.link]}
         >
            Cancel
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
