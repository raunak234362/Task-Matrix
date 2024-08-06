import React, { useEffect, useState } from "react";
import Task from "../Task";
import {Button, Header} from "../../../index"
import Service from "../../../../api/configAPI";
const MyTask = () => {
  const [tasks, setTasks] = useState();
  const [specificTask, setSpecificTask] = useState("")
  const [displayTask, setdisplayTask] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const task = await Service.getMyTask();
        setTasks(task);
        console.log("My Task list: ", task);
      } catch (error) {
        console.log("Error in fetching task: ", error);
      }
    };
    fetchTask();
  }, []);

  function durToHour(params) {
    const [hours, minutes] = params.split(":");
    return `${hours}h ${minutes}m`;
  }

  function statusColor(status){
    if(status === "IN-PROGRESS"){
      return "text-green-700"
    }else{
      return "text-red-700"
    }
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
        break;
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
        break;
    }
  }

  function handleTaskView(taskId) {
    setSpecificTask(taskId)
    setdisplayTask(true);
  }

  return (
    <div className="main-container">
      <div>
        <Header title={"My Task"} />
      </div>

      <div>
        <table className="mt-10 min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.no
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                View
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks && tasks?.map((task, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{task?.project?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{task?.name}</td>
             
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(task?.created_on).toDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(task?.due_date).toDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {durToHour(task?.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm text-center font-semibold px-3 py-0.5 rounded-full border ${statusColor(task?.status)}`}>
                  {task?.status}
                    </span>
                  </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm text-center font-semibold px-3 py-0.5 rounded-full border ${color(
                      task?.priority
                    )}`}
                  >
                    {setPriorityValue(task?.priority)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                    <Button
                    onClick={() => {
                      handleTaskView(task?.id)
                    }}
                    >
                      View
                      </Button>
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>
      {
        displayTask && (
          <Task taskId={specificTask} setDisplay={setdisplayTask}/>
        )
      }
    </div>
  );
};

export default MyTask;
