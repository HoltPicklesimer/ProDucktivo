import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
   }),
});

export default function NotificationManager() {
   const [expoPushToken, setExpoPushToken] = useState('');
   const [notification, setNotification] = useState(false);
   const notificationListener = useRef();
   const responseListener = useRef();

   useEffect(() => {
      registerForPushNotificationsAsync().then((token) =>
         setExpoPushToken(token)
      );

      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(
         (notification) => {
            setNotification(notification);
         }
      );

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
         (response) => {
            console.log(response);
         }
      );

      return () => {
         Notifications.removeNotificationSubscription(
            notificationListener.current
         );
         Notifications.removeNotificationSubscription(responseListener.current);
      };
   }, []);

   return (
      <View
         style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
         }}
      >
         <Text>Your expo push token: {expoPushToken}</Text>
         <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>
               Title: {notification && notification.request.content.title}{' '}
            </Text>
            <Text>
               Body: {notification && notification.request.content.body}
            </Text>
            <Text>
               Data:{' '}
               {notification &&
                  JSON.stringify(notification.request.content.data)}
            </Text>
         </View>
         <Button
            title='Press to Send Notification'
            onPress={async () => {
               await schedulePushNotification();
            }}
         />
      </View>
   );
}

export async function schedulePushNotification(task) {
   let identifier;
   let schedulingOptions = {
      time: task.dueDate,
   };
   schedulingOptions.repeat =
      task.occurrence === 'Monthly'
         ? 30
         : task.occurrence === 'Weekly'
         ? 'week'
         : 'day';

   if (task.occurrence === 'Once') {
      identifier = await Notifications.scheduleNotificationAsync({
         content: {
            title: task.title,
            body: task.comments,
         },
         trigger: task.dueDate,
      });
   } else {
      identifier = await Notifications.scheduleNotificationAsync({
         content: {
            title: task.title,
            body: task.comments,
         },
         schedulingOptions: schedulingOptions,
      });
   }

   return identifier;
}

export async function cancelPushNotification(identifier) {
   await Notifications.cancelScheduledNotificationAsync(identifier);
}

async function registerForPushNotificationsAsync() {
   let token;
   if (Constants.isDevice) {
      const {
         status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
         const { status } = await Notifications.requestPermissionsAsync();
         finalStatus = status;
      }
      if (finalStatus !== 'granted') {
         alert('Failed to get push token for push notification!');
         return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
   } else {
      alert('Must use physical device for Push Notifications');
   }

   if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
         name: 'default',
         importance: Notifications.AndroidImportance.MAX,
         vibrationPattern: [0, 250, 250, 250],
         lightColor: '#FF231F7C',
      });
   }

   return token;
}
