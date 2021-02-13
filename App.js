import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import Login from './components/Login';
import Signup from './components/Signup';
import UpdateProfile from './components/UpdateProfile';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
   const [screen, setScreen] = useState('login');

   function navigate(toScreen) {
      setScreen(toScreen);
   }

   return (
      <AuthProvider>
         <View style={styles.container}>
            {screen === 'signup' && <Signup navigate={navigate} />}
            {screen === 'login' && <Login navigate={navigate} />}
            {screen === 'dashboard' && <Dashboard navigate={navigate} />}
            {screen === 'update-profile' && (
               <UpdateProfile navigate={navigate} />
            )}
            {screen === 'forgot-password' && (
               <ForgotPassword navigate={navigate} />
            )}
         </View>
      </AuthProvider>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 100,
   },
});
