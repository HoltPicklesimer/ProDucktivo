import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ForgotPassword from './components/ForgotPassword';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AppDrawer from './components/AppDrawer';

export default function App() {
   const [screen, setScreen] = useState('dashboard');

   function navigate(toScreen) {
      setScreen(toScreen);
   }

   return (
      <AuthProvider>
         {screen !== 'dashboard' && (
            <View style={styles.container}>
               {screen === 'signup' && <Signup navigate={navigate} />}
               {screen === 'login' && <Login navigate={navigate} />}
               {screen === 'forgot-password' && (
                  <ForgotPassword navigate={navigate} />
               )}
            </View>
         )}
         {screen === 'dashboard' && (
            <NavigationContainer>
               <AppDrawer authNavigate={navigate} />
            </NavigationContainer>
         )}
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
