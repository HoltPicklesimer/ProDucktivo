import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import * as firebase from 'firebase';
import 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
// import NotificationManager, {
//    schedulePushNotification,
//    cancelPushNotification,
// } from './NotificationManager';

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
   // const currentUser = { email: 'duck@duck.com' };
   const [edit, setEdit] = useState(false);
   const [editedTask, setEditedTask] = useState(null);
   const [filter, setFilter] = useState('All');
   const [loading, setLoading] = useState(false);
   const [userInfo, setUserInfo] = useState({
      level: 1,
      points: 0,
      totalTasks: 0,
      totalTime: 0,
   });
   const [showLevelUp, setShowLevelUp] = useState(false);

   useEffect(() => {
      setLoading(true);
      console.log('Start');
      const unsubscribe = () => {
         db.collection('users')
            .doc(currentUser?.email)
            .get()
            .then((data) => {
               console.log('Retreived user info!');
               const userData = data?.data();
               if (userData?.level) setUserInfo(userData);

               db.collection('users')
                  .doc(currentUser?.email)
                  .collection('tasks')
                  .get()
                  .then((taskData) => {
                     console.log('Retreived user tasks!');
                     const firestoreTasks = [];
                     taskData.forEach((currentTask) => {
                        let task = currentTask.data();
                        task.dueDate = task.dueDate.toDate();
                        firestoreTasks.push(task);
                     });
                     setTasks(firestoreTasks);
                  })
                  .catch((error) => {
                     console.error('Error getting user info: ', error);
                  })
                  .finally(() => setLoading(false));
            })
            .catch((error) => {
               console.error('Error getting user info: ', error);
            })
            .finally(() => setLoading(false));
      };
      return unsubscribe();
   }, []);

   function handleEdit() {
      setEdit(!edit);
      setEditedTask(null);
   }

   function editTask(task) {
      setEdit(true);
      setEditedTask(task);
   }

   // function scheduleNotification(task) {
   //    const identifier = schedulePushNotification(task);
   //    return identifier;
   // }

   // function cancelNotification(identifer) {
   //    cancelPushNotification(identifer);
   // }

   function getNewID() {
      let max = 1;
      tasks.map((task) => {
         if (Number(task.id) >= max) {
            max = Number(task.id) + 1;
         }
      });

      return String(max);
   }

   function updateTask(task) {
      const taskIndex = indexOf(tasks, 'id', task.id);
      setLoading(true);

      if (taskIndex === -1) {
         task.id = getNewID();
      }

      if (task) {
         // Cancel the notification if it exists and reschedule
         // if (task.identifer) cancelNotification(task.identifer);
         // task.identifer = scheduleNotification(task);

         db.collection('users')
            .doc(currentUser?.email)
            .collection('tasks')
            .doc(task.id)
            .set(task)
            .then(() => {
               console.log('Document successfully written!');
               if (taskIndex === -1) setTasks([...tasks, task]);
               else {
                  const updatedTasks = tasks;
                  updatedTasks[taskIndex] = task;
                  setTasks(updatedTasks);
               }
            })
            .catch((error) => {
               console.error('Error writing document: ', error);
            })
            .finally(() => {
               setLoading(false);
            });
      }

      setEdit(false);
   }

   function deleteTask(task) {
      const taskIndex = indexOf(tasks, 'id', task.id);
      setLoading(true);

      if (taskIndex !== -1) {
         db.collection('users')
            .doc(currentUser?.email)
            .collection('tasks')
            .doc(task.id)
            .delete()
            .then(() => {
               console.log('Document successfully deleted!');
               const updatedTasks = tasks;
               updatedTasks.splice(taskIndex, 1);
               setTasks(updatedTasks);
            })
            .catch((error) => {
               console.error('Error deleting document: ', error);
            })
            .finally(() => {
               setLoading(false);
            });
      }

      setEdit(false);
   }

   function updateStatus(task, date) {
      setLoading(true);
      const statusIndex = indexOf(task.status, 'date', date);
      const taskIndex = indexOf(tasks, 'id', task.id);

      if (statusIndex !== -1) {
         // The task status exists for the date (has been started)
         task.status[statusIndex] = {
            date: date,
            statusUpdates: {
               ...task.status[statusIndex]?.statusUpdates,
               completed: new Date(),
            },
         };
      } else {
         // The task status does not exist (so it has not been started)
         task.status.push({
            date: date,
            statusUpdates: { started: new Date() },
         });
      }

      if (task) {
         db.collection('users')
            .doc(currentUser?.email)
            .collection('tasks')
            .doc(task.id)
            .set(task)
            .then(() => {
               console.log('Document successfully written!');
               const updatedTasks = tasks;
               updatedTasks[taskIndex] = task;
               setTasks(updatedTasks);
            })
            .catch((error) => {
               console.error('Error writing document: ', error);
            })
            .finally(() => {
               // If completing the task, add points to the user
               if (task.status[statusIndex]?.statusUpdates?.completed) {
                  addPoints(task, task.status[statusIndex]);
               } else {
                  setLoading(false);
               }
            });
      }
   }

   function addPoints(task, status) {
      if (task && userInfo) {
         let newUserInfo = userInfo;
         newUserInfo.points +=
            task.difficulty === 'Easy'
               ? 10
               : task.difficulty === 'Medium'
               ? 20
               : 30;
         // Gain a level and start points at 0, but
         // carry over points
         if (newUserInfo.points >= newUserInfo.level * 100) {
            newUserInfo.points -= newUserInfo.level * 100;
            newUserInfo.level++;
            setShowLevelUp(true);
         }
         newUserInfo.totalTasks += 1;
         const timeToComplete =
            status.statusUpdates.completed - status.statusUpdates.started;
         newUserInfo.totalTime += timeToComplete;

         db.collection('users')
            .doc(currentUser?.email)
            .set(newUserInfo)
            .then(() => {
               console.log('User info successfully written!');
               setUserInfo(newUserInfo);
            })
            .catch((error) => {
               console.error('Error writing user info: ', error);
            })
            .finally(() => {
               setLoading(false);
            });
      }
   }

   return (
      <View style={{ width: '100%', flex: 1 }}>
         <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
         />
         <AppHeader navigation={navigation} title='Tasks' />

         <Modal visible={edit} animationType='slide' transparent>
            <EditTask
               handleClose={handleEdit}
               handleSave={updateTask}
               deleteTask={deleteTask}
               task={editedTask}
            />
         </Modal>

         <Modal visible={showLevelUp} animationType='slide' transparent>
            <Card style={styles.card} containerStyle={styles.card}>
               <Card.Title>Congratulations! You leveled up!</Card.Title>
               <Card.Title>You reached</Card.Title>
               <Text h3 style={{ textAlign: 'center', marginBottom: 20 }}>
                  Level {userInfo?.level}!
               </Text>
               <Button title='Dismiss' onPress={() => setShowLevelUp(false)} />
            </Card>
         </Modal>

         <ScrollView>
            {/* <NotificationManager /> */}
            <Card>
               <Card.Title h2>Hello {currentUser?.email}!</Card.Title>
               {error !== '' && <Text style={styles.alert}>{error}</Text>}
               <Image source={Duck} style={styles.avatar} />
               <View style={{ alignItems: 'center', marginBottom: 15 }}>
                  <Text>Level {userInfo?.level}</Text>
                  <Text>
                     {userInfo?.points}/{userInfo?.level * 100}
                  </Text>
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
                        <Picker.Item label='All' value='All' />
                        <Picker.Item label='To Do' value='To Do' />
                        <Picker.Item label='Started' value='Started' />
                        <Picker.Item label='Not Started' value='Not Started' />
                        <Picker.Item label='Completed' value='Completed' />
                     </Picker>
                  </View>
               </View>
               <Card.Divider />
               <TaskList
                  tasks={tasks}
                  editTask={editTask}
                  updateStatus={updateStatus}
                  filter={filter}
               />
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
   spinnerTextStyle: {
      color: '#fff',
   },
   card: {
      width: '80%',
      alignSelf: 'center',
   },
});
