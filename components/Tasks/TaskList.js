import React, { useState } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import Task from '../Tasks/Task';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';

export default function TaskList({ tasks, editTask }) {
   const filteredTasks = filterTasks(tasks);

   function filterTasks(tasks) {
      const today = new Date();
      return tasks.filter(
         (t) =>
            t.dueDate >=
               new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate()
               ) && t.dueDate <= today.addDays(30)
      );
   }

   // Get each date the user has a task
   function getUniqueDates() {
      let savedDates = [];
      filteredTasks.map((task) => {
         const currentDate = task.dueDate.toLocaleDateString();
         if (!savedDates.includes(currentDate)) {
            savedDates.push(currentDate);
         }
      });
      return savedDates.map((item) => new Date(item));
   }

   return (
      <View>
         {/* Sort and organize tasks by date */}
         {getUniqueDates()
            .sort((a, b) => a - b)
            .map((date, index) => (
               <View key={index}>
                  <Text style={styles.date}>
                     {moment(date).format('MMMM D, YYYY')}
                  </Text>
                  <Card.Divider style={{ marginBottom: 0 }} />
                  <View style={{ marginBottom: 30 }}>
                     {filteredTasks
                        .filter(
                           (t) =>
                              t.dueDate.toLocaleDateString() ===
                              date.toLocaleDateString()
                        )
                        .sort((a, b) => a.dueDate - b.dueDate)
                        .map((task, index) => (
                           <Task key={index} task={task} editTask={editTask} />
                        ))}
                  </View>
               </View>
            ))}
      </View>
   );
}

const styles = StyleSheet.create({
   date: {
      color: 'gray',
   },
});
