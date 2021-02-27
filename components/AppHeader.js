import React from 'react';
import { View, Text } from 'react-native';
import { Header } from 'react-native-elements';

export default function AppHeader({ navigation, title }) {
   function onMenuOpen() {
      navigation.toggleDrawer();
   }

   return (
      <Header
         leftComponent={{
            icon: 'menu',
            color: '#fff',
            onPress: onMenuOpen,
         }}
         centerComponent={{ text: title, style: { color: '#fff' } }}
      />
   );
}
