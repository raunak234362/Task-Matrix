import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import { Button, Header, SelectedTask } from "../../../index";

const AllTask = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const task = await Service.getAllTask();
        setTasks(task);
        console.log("My Task: ", task);
      } catch (error) {
        console.log("Error in fetching task: ", error);
      }
    };
    fetchTask();
  }, [selectedTask]);

  const handleViewClick = async (taskId) => {
    console.log(taskId)
    try {
      const task = await Service.getTaskById(taskId);
      setSelectedTask(task);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };
    
    function color(priority) {
      switch (priority) {
        case 0:
          return "bg-green-200 border-green-800 text-green-800";
          
        case 1:
          return "bg-yellow-200 border-yellow-800 text-yellow-800"
          
  
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
            return "LOW"
            
          case 1:
            return "MEDIUM"
    
          case 2:
            return "HIGH"
    
          case 3:
            return "CRITICAL"
    
          default:
            break;
        
    }
  }

  return (
    <div>
      <Header title={"All Task"}/>
      <div className="table-container w-full my-5 rounded-lg">
        <div className="h-[50vh] overflow-y-hidden shadow-xl table-container w-full rounded-lg">
          {/* <h3 className="text-xl flex font-bold uppercase rounded-lg bg-slate-400 text-white px-5 py-1 justify-center items-center">
        All Projects
        </h3> */}
          <div className="mx-5 my-5 h-[100vh] overflow-y-auto">
            <table className="w-full table-auto border-collapse text-center rounded-xl">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-1 py-2">S.no</th>
                  {/* <th className="px-1 py-2">Fabricator Name</th> */}
                  <th className="px-1 py-2">Project Name</th>
                  <th className="px-1 py-2">Task Name</th>
                  <th className="px-1 py-2">Project Manager</th>
                  <th className="px-1 py-2">Status</th>
                  <th className="px-1 py-2">Priority</th>
                  <th className="px-1 py-2">Due Date</th>
                  <th className="px-1 py-2">Option</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr className="bg-white">
                    <td colSpan="7" className="text-center">
                      No Task Found
                    </td>
                  </tr>
                ) : (
                  tasks?.map((task, index) => (
                    <tr key={task.id}>
                      <td className="border px-1 py-2">{index + 1}</td>
                      {/* <td className="border px-1 py-2">
                        {task?.fabricator?.name}
                      </td> */}
                      <td className="border px-1 py-2">
                        {task?.project?.name}
                      </td>
                      <td className="border px-1 py-2">{task?.name}</td>
                      <td className="border px-1 py-2">
                        {task?.project?.manager?.name}
                      </td>
                      <td className="border px-1 py-2">
                        {task?.status}
                      </td>
                      <td className={`border px-1 py-2`}>
                      <span className={`text-sm text-center font-semibold px-3 py-0.5 mx-2 rounded-full border ${color(task?.priority)}`}>{setPriorityValue(task?.priority)}</span>
                      </td>
                      <td className="border px-1 py-2">
                        {new Date(task?.due_date).toDateString()}
                      </td>
                      <td className="border px-3 flex justify-center py-2">
                        <Button onClick={() => handleViewClick(task?.id)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedTask && (
        <SelectedTask
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        setTasks={setSelectedTask}
        />
      )}
    </div>
  );
};

export default AllTask;
