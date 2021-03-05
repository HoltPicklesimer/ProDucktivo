import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Card, CheckBox, Text } from 'react-native-elements';
import moment from 'moment';

function shortDateString(date) {
   return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
}

export default function Task(props) {
   const [task, setTask] = useState(props.task);

   const now = new Date();

   // Get the instance of the due date
   let dueDate = new Date(props.date);
   dueDate.setHours(props.task.dueDate.getHours(), 0, 0);
   dueDate.setMinutes(props.task.dueDate.getMinutes(), 0, 0);

   // Get the instance of the status
   const status = task.status.find(
      (s) => s.date === shortDateString(props.date)
   ) || { status: 'Not Started', date: props.date };
   const isLate = status.status !== 'Completed' && dueDate < now;

   useEffect(() => {
      setTask(props.task);
   }, [props.task]);

   return (
      <Card style={styles.task}>
         <View style={{ flexDirection: 'row', marginRight: 10 }}>
            <CheckBox
               checked={status.status === 'Completed'}
               Component={TouchableWithoutFeedback}
            />
            <Text h4>{task.title}</Text>
         </View>

         <View style={styles.taskDetails}>
            <Text>Due: {moment(dueDate).format('MMMM D, YYYY h:mm A')}</Text>
            <Card.Divider style={{ marginBottom: 0 }} />
            <Text
               style={
                  (isLate && styles.late) ||
                  (status.status === 'Completed' && styles.completed) ||
                  (status.status === 'Started' && styles.started) ||
                  (status.status === 'Not Started' && styles.notStarted)
               }
            >
               ({(isLate && 'Late') || status.status})
            </Text>

            <View style={{ maxHeight: 36, overflow: 'hidden' }}>
               <Text>{task.comments}</Text>
            </View>
         </View>

         <View style={styles.buttonContainer}>
            {status.status !== 'Completed' && (
               <Button
                  color='#00cf41'
                  title={
                     status.status === 'Not Started'
                        ? 'Start Task'
                        : 'Complete Task'
                  }
                  onPress={props.updateStatus.bind(
                     this,
                     task,
                     shortDateString(dueDate)
                  )}
               />
            )}
            <Button
               title='View Task'
               onPress={props.editTask.bind(this, task)}
            />
         </View>
      </Card>
   );
}

const styles = StyleSheet.create({
   task: {
      flexDirection: 'row',
   },
   buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
   },
   taskDetails: {
      marginLeft: 25,
      marginBottom: 15,
   },
   completed: {
      color: 'green',
   },
   started: {
      color: 'blue',
   },
   notStarted: {
      color: 'gray',
   },
   late: {
      color: 'red',
   },
});
