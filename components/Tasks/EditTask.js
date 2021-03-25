import React, { useState } from 'react';
import { View, StyleSheet, Button, Modal } from 'react-native';
import {
   Card,
   Input,
   Text,
   Button as ElementButton,
} from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Picker } from '@react-native-community/picker';

Date.prototype.addDays = function (days) {
   var date = new Date(this.valueOf());
   date.setDate(date.getDate() + days);
   return date;
};

export default function EditTask(props) {
   const [task, setTask] = useState({
      id: props?.task?.id || -1,
      title: props?.task?.title || '',
      comments: props?.task?.comments || '',
      occurrence: props?.task?.occurrence || 'Once',
      dueDate: props?.task?.dueDate || new Date().addDays(1),
      difficulty: props?.task?.difficulty || 'Easy',
      status: props?.task?.status || [],
   });
   const [datePickerVisible, setdatePickerVisible] = useState(false);
   const [deleteVisible, setDeleteVisible] = useState(false);

   function setDate(date) {
      setTask({ ...task, dueDate: date });
      setdatePickerVisible(false);
   }

   function handleDeleteTask() {
      props.deleteTask(task);
   }

   return (
      <Card>
         <Modal visible={deleteVisible} animationType='slide' transparent>
            <Card>
               <View style={{ height: 200, justifyContent: 'space-between' }}>
                  <Card.Title style={{ margin: 45 }}>
                     Are you sure you want to delete this task?
                  </Card.Title>
                  <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                     }}
                  >
                     <Button
                        title='Delete'
                        onPress={() => {
                           handleDeleteTask();
                           setDeleteVisible(false);
                        }}
                        color='#f54542'
                        style={styles.button}
                     />
                     <Button
                        title='Cancel'
                        onPress={() => {
                           setDeleteVisible(false);
                        }}
                        style={styles.button}
                     />
                  </View>
               </View>
            </Card>
         </Modal>
         <Card.Title h3>Edit Task</Card.Title>
         <Card.Divider />
         <Input
            placeholder='Title'
            value={task.title}
            onChangeText={(value) => setTask({ ...task, title: value })}
         ></Input>
         <Input
            placeholder='Commments'
            value={task.comments}
            onChangeText={(value) => setTask({ ...task, comments: value })}
         ></Input>
         <Text style={styles.subHeader}>Occurrence:</Text>
         <Picker
            style={{ marginBottom: 10 }}
            selectedValue={task.occurrence}
            onValueChange={(itemValue, itemIndex) =>
               setTask({ ...task, occurrence: itemValue })
            }
         >
            <Picker.Item label='Once' value='Once' />
            <Picker.Item label='Daily' value='Daily' />
            <Picker.Item label='Weekly' value='Weekly' />
            <Picker.Item label='Monthly' value='Monthly' />
         </Picker>
         <Text style={styles.subHeader}>Due Date:</Text>
         <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
         >
            <Text>{moment(task.dueDate).format('MMMM D, YYYY h:mm A')}</Text>
            <ElementButton
               icon={{
                  name: 'calendar',
                  type: 'font-awesome',
                  size: 15,
                  color: 'white',
               }}
               title=''
               onPress={() => setdatePickerVisible(true)}
            />
         </View>
         <Text style={styles.subHeader}>Difficulty:</Text>
         <Picker
            style={{ marginBottom: 10 }}
            selectedValue={task.difficulty}
            onValueChange={(itemValue, itemIndex) =>
               setTask({ ...task, difficulty: itemValue })
            }
         >
            <Picker.Item label='Easy' value='Easy' />
            <Picker.Item label='Medium' value='Medium' />
            <Picker.Item label='Hard' value='Hard' />
         </Picker>
         <View
            style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
            }}
         >
            <View style={styles.button}>
               <Button
                  title='Save'
                  onPress={props.handleSave.bind(this, task)}
                  color='#00cf41'
               />
            </View>
            {task.id !== -1 && (
               <View style={styles.button}>
                  <Button
                     title='Delete'
                     color='#f54542'
                     onPress={() => setDeleteVisible(true)}
                  />
               </View>
            )}
            <View style={styles.button}>
               <Button title='Cancel' onPress={props.handleClose} />
            </View>
         </View>

         <DateTimePicker
            isVisible={datePickerVisible}
            mode='datetime'
            onConfirm={(value) => setDate(value)}
            onCancel={() => setdatePickerVisible(false)}
         />
      </Card>
   );
}

const styles = StyleSheet.create({
   subHeader: {
      fontSize: 16,
      fontWeight: 'bold',
   },
   button: {
      width: 100,
      padding: 10,
   },
});
