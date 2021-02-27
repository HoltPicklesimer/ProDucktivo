import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-elements';
import AppHeader from './AppHeader';

export default function Stats(props) {
   return (
      <View style={{ width: '100%' }}>
         <AppHeader navigation={props.navigation} title='Stats' />
         <Card>
            <Card.Title h2>My Duck</Card.Title>
         </Card>
      </View>
   );
}
