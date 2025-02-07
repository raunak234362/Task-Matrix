/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import Header from "../../Header";
import { Input, CustomSelect } from "../../../index";

const TaskRecord = () => {
  const [record, setRecord] = useState([]);
  const [user, setUser] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [sortedUser, setSortedUser] = useState([]);
  const [listTask, setListTask] = useState([]);
  const [workHours, setWorkHours] = useState({});
  const token = sessionStorage.getItem("token");
  const userType = sessionStorage.getItem("userType");

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const taskRecordUser = await Service.getAllUser(token);
  //       setSearchUser(taskRecordUser);
  //       setSortedUser(taskRecordUser);
  //       console.log(taskRecordUser);
  //     } catch (error) {
  //       console.log("Error fetching Task Record of the User:", error);
  //     }
  //   };

  //   fetchUser();
  // }, [token]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const UserTask = await Service.userTaskRecord();
        console.log("user Task:--------", UserTask);
        setListTask(UserTask);
        setRecord(UserTask);
      } catch (error) {
        console.log("Error fetching user task", error);
      }
    };
    fetchTask();
  }, [user]);

  useEffect(() => {
    const filterTasks = () => {
      let filteredTasks = listTask;

      if (userType !== "user") {
        if (user) {
          filteredTasks = filteredTasks.filter(
            (task) => task.user.username === user,
          );
        }
      }

      setRecord(filteredTasks);
    };
    filterTasks();
  }, [user, listTask, userType]);

  useEffect(() => {
    const fetchWorkHours = async () => {
      try {
        // Fetch work hours for each task
        const workHoursPromises = record.map(task => 
          Service.getWorkHours(task.id)
        );
        const workHoursResults = await Promise.all(workHoursPromises);
        
        // Create an object with task IDs as keys and work hours as values
        const workHoursMap = {};
        workHoursResults.forEach((hours, index) => {
          workHoursMap[record[index].id] = hours?.duration || 0;
        });
        
        setWorkHours(workHoursMap);
      } catch (error) {
        console.log("Error fetching work hours:", error);
      }
    };

    if (record?.length > 0) {
      fetchWorkHours();
    }
  }, [record]);

  function durToHour(params) {
    if (!params) return "N/A";

    const parts = params.split(" ");
    let days = 0;
    let timePart = params;

    // If duration contains days part, it will have two parts
    if (parts.length === 2) {
      days = parseInt(parts[0], 10); // extract days
      timePart = parts[1]; // extract the time part
    }

    // Time part is in format HH:MM:SS
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    const totalHours = days * 24 + hours; // Convert days to hours and add them
    return `${totalHours}h ${minutes}m`;
  }


  function compare(duration, time) {
    if (!duration || !time) return false;
    // Convert both values to minutes for comparison
    const durationInMinutes = convertToMinutes(duration);
    return durationInMinutes >= time;
  }

  function convertToMinutes(duration) {
    if (!duration) return 0;
    const [hours, minutes] = duration.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  function formatMinutesToHours(totalMinutes) {
    
    if (!totalMinutes && totalMinutes !== 0) return "N/A";
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  }

  return (
    <div>
      {/* {userType !== 'user' && (
        <div className="flex w-1/2 flex-row gap-5 mt-5">
          <Input
            type="text"
            placeholder="Search user..."
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="px-2 border border-gray-300 rounded-lg"
          />
          <Select
            options={[
              { value: '', label: 'Select user' },
              ...sortedUser.map((u) => ({ value: u.username, label: u.name }))
            ]}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Select user"
          />
        </div>
      )} */}
      <div className="mt-5 bg-white h-[60vh] overflow-auto rounded-lg">
        <table className="md:w-full w-[90vw] border-collapse text-left md:text-lg text-xs rounded-xl">
          <thead>
            <tr className="bg-teal-200/70">
              <th className="px-2 py-1 uppercase">S.no</th>
              <th className="px-2 py-1 uppercase">Project</th>
              <th className="px-2 py-1 uppercase">Task Title</th>
              <th className="px-2 py-1 uppercase">Start Date</th>
              <th className="px-2 py-1 uppercase">Due Date</th>

              <th className="px-2 py-1 uppercase">Time Alloted</th>
              <th className="px-2 py-1 uppercase">Time Taken</th>
              <th className="px-2 py-1 uppercase">Task Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-left font-medium">
            {record?.length === 0 ? (
              <tr className="bg-white">
                <td colSpan="6" className="text-center">
                  No Task Available
                </td>
              </tr>
            ) : (
              record?.map((rec, index) => (
                <tr
                  key={rec?.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-200/50"}
                >
                  
                  <td className="border px-1 py-2">{index + 1}</td>
                  <td className="border px-1 py-2">{rec?.project?.name}</td>
                  <td className="border px-1 py-2">{rec?.name}</td>
                  <td className="border px-1 py-2">
                    {new Date(rec?.start_date).toDateString()}
                  </td>
                  <td className="border px-1 py-2">
                    {new Date(rec?.due_date).toDateString()}
                  </td>
                  <td className="border px-1 py-2">
                    {durToHour(rec?.duration)}
                  </td>
                  <td
                    className={`border px-1 py-2 `}
                  >
                    {formatMinutesToHours(workHours[rec?.id])}
                  </td>
                  <td className="border px-1 py-2">{rec?.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskRecord;
