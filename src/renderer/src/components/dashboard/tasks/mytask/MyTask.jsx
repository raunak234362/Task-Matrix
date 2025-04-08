/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Task from "../Task";
import { Button, Header } from "../../../index";
import Service from "../../../../api/configAPI";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import socket from "../../../../socket";
const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [specificTask, setSpecificTask] = useState("");
  const [displayTask, setDisplayTask] = useState(false);


  useEffect(() => {
    const fetchTask = async () => {
      try {
        const task = await Service.getMyTask();
        socket.on("customNotification", (task) => {
          console.log("Notification received:", task);
        
          new Notification(task?.title || "Notification", {
            body: task?.message,
          }).show();
        });
        setTasks(task);
      } catch (error) {
        console.log("Error in fetching task: ", error);
      }
    };
    fetchTask();
  }, []);
  // if(tasks.length + 1){
  //   window.electron.ipcRenderer.send('show-notification', {
  //     title: 'New Data Added',
  //     body: 'A new record has been added successfully!',
  //   })
  // }
  
  const projects = useSelector((state) => state?.projectData?.projectData);

  function durToHour(params) {
    if (!params) return "N/A";

    const parts = params.split(" ");
    let days = 0;
    let timePart = params;

    if (parts.length === 2) {
      days = parseInt(parts[0], 10);
      timePart = parts[1];
    }

    const [hours, minutes] = timePart.split(":").map(Number);
    return `${days * 24 + hours}h ${minutes}m`;
  }

  function statusColor(status) {
    return status === "IN_PROGRESS" ? "text-green-700" : "text-red-700";
  }

  function color(priority) {
    switch (priority) {
      case 0:
        return "bg-green-200 border-green-800 text-green-800";
      case 1:
        return "bg-yellow-200 border-yellow-800 text-yellow-800";
      case 2:
        return "bg-purple-200 border-purple-800 text-purple-800";
      case 3:
        return "bg-red-200 border-red-700 text-red-700";
      default:
        return "";
    }
  }

  function setPriorityValue(value) {
    switch (value) {
      case 0:
        return "LOW";
      case 1:
        return "MEDIUM";
      case 2:
        return "HIGH";
      case 3:
        return "CRITICAL";
      default:
        return "";
    }
  }

  function handleTaskView(taskId) {
    setSpecificTask(taskId);
    setDisplayTask(true);
  }

  // Find the highest-priority task that is still pending
  const highestPriorityTask = tasks
    .filter((task) => task.status === "BREAK" || task.status === "ASSIGNED")
    .sort((a, b) => {
      const dateDiff = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      if (dateDiff !== 0) {
        return dateDiff;
      }
      return b.priority - a.priority;
    })[0];

  const reloadWnidow = () => {
    window.location.reload();
  };

  return (
    <div className="mx-5 my-3 main-container">
      <div>
                        <Button onClick={reloadWnidow}>Refresh</Button>
                      </div>
      <div className="mt-5 bg-white h-[60vh] overflow-auto rounded-lg">
        <table className="h-fit md:w-full w-[90vw] border-collapse text-center md:text-lg text-xs rounded-xl">
          <thead>
            <tr className="bg-teal-200/70">
              <th className="px-2 py-1 uppercase">S.no</th>
              <th className="px-2 py-1 uppercase">Project Name</th>
              <th className="px-2 py-1 uppercase">Task Name</th>
              <th className="px-2 py-1 uppercase">Start Date</th>
              <th className="px-2 py-1 uppercase">Due Date</th>
              <th className="px-2 py-1 uppercase">Duration</th>
              <th className="px-2 py-1 uppercase">Status</th>
              <th className="px-2 py-1 uppercase">Priority</th>
              <th className="px-2 py-1 uppercase">View</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {tasks.map((task, index) => {
              const isHighestPriority = highestPriorityTask?.id === task.id;
              const isInProgress = task.status === "IN_PROGRESS";

              return (
                <tr key={task.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-200/50"}>
                  <td className="px-1 py-2 border">{index + 1}</td>
                  <td className="px-1 py-2 border">
                    {projects?.find((project) => project.id === task?.project_id)?.name || "N/A"}
                  </td>
                  <td className="px-1 py-2 border">{task.name}</td>
                  <td className="px-1 py-2 border">{new Date(task.start_date).toDateString()}</td>
                  <td className="px-1 py-2 border">{new Date(task.due_date).toDateString()}</td>
                  <td className="px-1 py-2 border">{durToHour(task.duration)}</td>
                  <td className="px-1 py-2 border">
                    <span className={`px-3 py-0.5 rounded-full border ${statusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-1 py-2 border">
                    <span className={`px-3 py-0.5 rounded-full border ${color(task.priority)}`}>
                      {setPriorityValue(task.priority)}
                    </span>
                  </td>
                  <td className="px-1 py-2 border">
                    {isInProgress || isHighestPriority ? (
                      <Button onClick={() => handleTaskView(task.id)}>View</Button>
                    ) : (
                      <Button className="bg-red-500 text-white font-semibold" disabled>View</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {displayTask && <Task taskId={specificTask} setDisplay={setDisplayTask} />}
    </div>
  );
};

export default MyTask;
