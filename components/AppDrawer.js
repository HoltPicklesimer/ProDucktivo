import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UpdateProfile from './UpdateProfile';
import Dashboard from './Dashboard';
import Stats from './Stats';

const Drawer = createDrawerNavigator();

export default function AppDrawer({ authNavigate }) {
   return (
      <Drawer.Navigator initialRouteName='Home'>
         <Drawer.Screen
            name='Tasks'
            component={Dashboard}
            initialParams={{ authNavigate: authNavigate }}
         />
         <Drawer.Screen
            name='Stats'
            component={Stats}
            initialParams={{ authNavigate: authNavigate }}
         />
         <Drawer.Screen
            name='Settings'
            component={UpdateProfile}
            initialParams={{ authNavigate: authNavigate }}
         />
      </Drawer.Navigator>
   );
}
