import React, { useState } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import Task from '../Tasks/Task';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';

Date.prototype.addDays = function (days) {
   var date = new Date(this.valueOf());
   date.setDate(date.getDate() + days);
   return date;
};

export default function TaskList({ tasks, editTask, updateStatus }) {
   const filteredTasks = filterTasks(tasks);

   function filterTasks(tasks) {
      const today = new Date();
      return tasks.filter(
         (t) =>
            (t.dueDate >=
               new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate()
               ) ||
               t.occurrence !== 'Once') &&
            t.dueDate <= today.addDays(30)
      );
   }

   function datesMatch(date1, date2) {
      return (
         date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
      );
   }

   function checkTaskDate(task, date) {
      switch (task.occurrence) {
         case 'Once':
            return datesMatch(task.dueDate, date);
            break;
         case 'Daily': // daily tasks occur everyday
            return true;
            break;
         case 'Weekly':
            return task.dueDate.getDay() === date.getDay();
            break;
         case 'Monthly':
            const diffTime = Math.abs(task.dueDate.setHours(0, 0, 0, 0) - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays % 30 === 0;
            break;
      }
   }

   // Get each date the user has a task
   function getUniqueDates() {
      let savedDates = [];

      for (let i = 0; i <= 30; i++) {
         const currentDate = new Date().addDays(i);

         if (filteredTasks.find((t) => checkTaskDate(t, currentDate))) {
            savedDates.push(currentDate);
         }
      }

      return savedDates;
   }

   return (
      <View>
         {/* Sort and organize tasks by date */}
         {getUniqueDates()
            // .sort((a, b) => a - b)
            .map((date, index) => (
               <View key={index}>
                  <Text style={styles.date}>
                     {moment(date).format('MMMM D, YYYY')}
                     {datesMatch(new Date(), date) && ' (Today)'}
                  </Text>
                  <Card.Divider style={{ marginBottom: 0 }} />
                  <View style={{ marginBottom: 30 }}>
                     {filteredTasks
                        .filter((task) => checkTaskDate(task, date))
                        .sort((a, b) => a.dueDate - b.dueDate)
                        .map((task, index) => (
                           <Task
                              key={index}
                              task={task}
                              editTask={editTask}
                              date={date}
                              updateStatus={updateStatus}
                           />
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
