/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import Service from "../api/configAPI";

async function getTask(employee, dates){
  console.log(dates, employee)
  const tasks = await Service.fetchCalendar2(dates, employee);
  return tasks;
}

/* eslint-disable no-unused-vars */
async function SegregateTeam(team) {
    const result = [];
  
    await team?.forEach(async (member) => {
      // console.log(member)
      // console.log(member?.date)
      const employee = member?.employee;
      const role = member?.role;
      const tasks = await getTask(employee?.username, member?.date);
      // const tasks = member?.tasks?.map(task => ({
      //   id: task.id,
      //   name: task.name,
      //   project: task.project, 
      //   startDate: task.startDate,
      //   endDate: task.endDate,
      // }));

      // yahan api call karo aur phir tasks ka ek array banao
      
  
      if (role && tasks) {
        result.push({
          ...employee,
          role,
          tasks,
        });
      }
    });
    
    return result;
  }
  
  export default SegregateTeam;
  