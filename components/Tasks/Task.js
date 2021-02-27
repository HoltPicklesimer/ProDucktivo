import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Card, CheckBox, Text } from 'react-native-elements';
import moment from 'moment';

export default function Task(props) {
   const [task, setTask] = useState(props.task);

   const today = new Date();
   const isLate = task.status !== 'Completed' && task.dueDate < today;

   useEffect(() => {
      setTask(props.task);
   }, [props.task]);

   return (
      <Card style={styles.task}>
         <View style={{ flexDirection: 'row', marginRight: 10 }}>
            <CheckBox
               checked={task.status === 'Completed'}
               Component={TouchableWithoutFeedback}
            />
            <Text h4>{task.title}</Text>
         </View>

         <View style={styles.taskDetails}>
            <Text>
               Due: {moment(task.dueDate).format('MMMM D, YYYY h:mm A')}
            </Text>
            <Card.Divider style={{ marginBottom: 0 }} />
            <Text
               style={
                  (isLate && styles.late) ||
                  (task.status === 'Completed' && styles.completed) ||
                  (task.status === 'Started' && styles.started) ||
                  (task.status === 'Not Started' && styles.notStarted)
               }
            >
               ({(isLate && 'Late') || task.status})
            </Text>

            <View style={{ maxHeight: 36, overflow: 'hidden' }}>
               <Text>{task.comments}</Text>
            </View>
         </View>

         <View style={styles.buttonContainer}>
            <Button color='#00cf41' title='Start Task' />
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
