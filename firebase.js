import firebase from 'firebase/app';
import 'firebase/auth';
import database from 'firebase/database';

import {
   REACT_APP_FIREBASE_API_KEY,
   REACT_APP_FIREBASE_AUTH_DOMAIN,
   REACT_APP_FIREBASE_DATABASE_URL,
   REACT_APP_FIREBASE_PROJECT_ID,
   REACT_APP_FIREBASE_STORAGE_BUCKET,
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
   REACT_APP_FIREBASE_APP_ID,
} from '@env';

let app;

if (!firebase.apps.length) {
   app = firebase.initializeApp({
      apiKey: REACT_APP_FIREBASE_API_KEY,
      authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
      projectId: REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: REACT_APP_FIREBASE_APP_ID,
   });
} else {
   app = firebase.app;
}

export const auth = app.auth();
export default app;
