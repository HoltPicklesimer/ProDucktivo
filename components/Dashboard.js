import React, { useState, useEffect, useCallback } from 'react';
import {
   View,
   StyleSheet,
   Button,
   Image,
   ScrollView,
   Modal,
   LogBox,
} from 'react-native';
import { Text, Card } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import AppHeader from './AppHeader';
import Duck from '../assets/duck1.png';
import EditTask from './Tasks/EditTask';
import { Picker } from '@react-native-community/picker';
import TaskList from './Tasks/TaskList';
import AsyncStorage from '@react-native-community/async-storage';
import * as firebase from 'firebase';
import 'firebase/firestore';
import app from '../firebase';

Date.prototype.addDays = function (days) {
   var date = new Date(this.valueOf());
   date.setDate(date.getDate() + days);
   return date;
};

function indexOf(array, attr, value) {
   for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
         return i;
      }
   }
   return -1;
}

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

const db = firebase.firestore();

export default function Dashboard({ navigation, route }) {
   const [tasks, setTasks] = useState([]);
   const [error, setError] = useState('');
   const { currentUser } = useAuth();
   const [edit, setEdit] = useState(false);
   const [editedTask, setEditedTask] = useState(null);
   const [filter, setFilter] = useState('To Do');

   useEffect(() => {
      const unsubscribe = db
         .collection('users')
         .doc(currentUser?.email)
         .collection('tasks')
         .onSnapshot((querySnapshot) => {
            let taskFirestore = [];
            querySnapshot.forEach((doc) => {
               taskFirestore.push(doc.data());
            });

            appendTasks(taskFirestore);
         });
      return () => unsubscribe();
   }, []);

   const appendTasks = useCallback(
      (dbTasks) => {
         setTasks(
            dbTasks.map((task) => {
               task.dueDate = task.dueDate.toDate();
               return task;
            })
         );
      },
      [tasks]
   );

   function handleEdit() {
      setEdit(!edit);
      setEditedTask(null);
   }

   function getNewID() {
      let max = 1;
      tasks.map((task) => {
         console.log(task.id);
         if (Number(task.id) >= max) {
            max = Number(task.id) + 1;
            console.log(max);
         }
      });

      return String(max);
   }

   function handleSave(task) {
      const taskIndex = indexOf(tasks, 'id', task.id);
      if (taskIndex === -1) {
         task.id = getNewID();
      }

      if (task) {
         db.collection('users')
            .doc(currentUser?.email)
            .collection('tasks')
            .doc(task.id)
            .set(task)
            .then(() => {
               console.log('Document successfully written!');
            })
            .catch((error) => {
               console.error('Error writing document: ', error);
            });
      }

      setEdit(false);
   }

   function editTask(task) {
      setEdit(true);
      setEditedTask(task);
   }

   function deleteTask(task) {
      const taskIndex = indexOf(tasks, 'id', task.id);

      if (taskIndex !== -1) {
         db.collection('users')
            .doc(currentUser?.email)
            .collection('tasks')
            .doc(task.id)
            .delete()
            .then(() => {
               console.log('Document successfully deleted!');
            })
            .catch((error) => {
               console.error('Error deleting document: ', error);
            });
      }

      setEdit(false);
   }

   return (
      <View style={{ width: '100%', flex: 1 }}>
         <AppHeader navigation={navigation} title='Tasks' />
         <Modal visible={edit} animationType='slide' transparent>
            <EditTask
               handleClose={handleEdit}
               handleSave={handleSave}
               deleteTask={deleteTask}
               task={editedTask}
            />
         </Modal>
         <ScrollView>
            <Card>
               <Card.Title h2>Hello {currentUser?.email}!</Card.Title>
               {error !== '' && <Text style={styles.alert}>{error}</Text>}
               <Image source={Duck} style={styles.avatar} />
               <View style={{ alignItems: 'center', marginBottom: 15 }}>
                  <Text>Level 1</Text>
                  <Text>99/1024</Text>
               </View>
               <View style={{ marginBottom: 10 }}>
                  <Button title='Add Task' onPress={handleEdit} />
               </View>
               <View style={{ flexDirection: 'row' }}>
                  <Card.Title style={styles.cardTitle}>My Tasks</Card.Title>
                  <View style={{ textAlign: 'right', flexDirection: 'row' }}>
                     <Text>Filter by:</Text>
                     <Picker
                        style={{ height: 20, width: 150 }}
                        selectedValue={filter}
                        onValueChange={(value) => setFilter(value)}
                     >
                        <Picker.Item label='To Do' value='To Do' />
                        <Picker.Item label='Started' value='Started' />
                        <Picker.Item label='Not Started' value='Not Started' />
                        <Picker.Item label='Completed' value='Completed' />
                        <Picker.Item label='All' value='All' />
                     </Picker>
                  </View>
               </View>
               <Card.Divider />
               <TaskList tasks={tasks} editTask={editTask} />
            </Card>
         </ScrollView>
      </View>
   );
}

const styles = StyleSheet.create({
   alert: {
      backgroundColor: 'lightpink',
      borderColor: 'red',
      borderWidth: 1,
      borderRadius: 10,
      margin: 20,
      padding: 10,
      color: 'red',
   },
   avatar: {
      width: null,
      resizeMode: 'contain',
      height: 200,
   },
   cardTitle: {
      flex: 1,
      textAlign: 'left',
   },
});
