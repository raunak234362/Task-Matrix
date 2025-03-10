/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const TaskSelected = ({ assignee, task, isOpen, onClose }) => {
  const [error, setError] = useState(null); // State to handle errors
  const userType = sessionStorage.getItem("userType");
  const username = sessionStorage.getItem("username");

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

  // Check if task is null or undefined
  if (!task) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800">Task Detail:</h2>
          <p className="text-red-500 text-lg">No task found.</p>
          <button
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-3xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  // Convert due_date and created_on to Date objects
  const due_date = new Date(task?.task?.due_date);
  const created_on = new Date(task?.task?.created_on);
  console.log("Print task", task);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Task Detail:</h2>
          <button
            className="text-red-500 hover:text-red-700 text-3xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="main-container">
          <div className="m-2 p-5 shadow-lg rounded-lg bg-white">
            <div className="text-2xl mb-5">
              <span className="font-bold text-gray-800">Task Name:</span>{" "}
              {task?.task?.name}
            </div>
            <hr className="mb-5 border-2 rounded-lg" />

            <div className="space-y-4">
              {/* Task Detail  */}
              <div className="">
                <span className="font-bold text-gray-800 w-40">
                  Task Description:
                </span>{" "}
                <span className="flex flex-wrap w-full text-lg">
                  {task?.task?.description}
                </span>
              </div>

              <div className="flex items-center">
                <span className="font-bold text-gray-800 w-40">
                  Created Date:
                </span>{" "}
                <span className="text-lg">{created_on?.toDateString()}</span>
              </div>

              <div className="flex items-center">
                <span className="font-bold text-gray-800 w-40">Due Date:</span>{" "}
                <span className="text-lg">{due_date?.toDateString()}</span>
              </div>

              <div className="flex items-center">
                <span className="font-bold text-gray-800 w-40">Duration:</span>{" "}
                <span className="text-lg">{task?.task?.duration}</span>
              </div>

              <div className="flex items-center py-2">
                <span className="font-bold text-gray-800 w-40">Status:</span>{" "}
                <span className="text-lg">
                  {task?.task?.status === "IN-PROGRESS" && (
                    <span className="bg-green-100 text-green-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-green-400">
                      In-Progress
                    </span>
                  )}
                  {task?.task?.status === "ON-HOLD" && (
                    <span className="bg-yellow-100 text-yellow-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-yellow-400">
                      On-Hold
                    </span>
                  )}
                  {task?.task?.status === "BREAK" && (
                    <span className="bg-red-100 text-red-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-red-400">
                      Break
                    </span>
                  )}
                  {task?.task?.status === "IN-REVIEW" && (
                    <span className="bg-orange-100 text-orange-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-orange-400">
                      In-Review
                    </span>
                  )}
                  {task?.task?.status === "Completed" && (
                    <span className="bg-green-100 text-green-700 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-green-700">
                      Completed
                    </span>
                  )}
                  {task?.task?.status === "APPROVED" && (
                    <span className="bg-purple-100 text-purple-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-purple-400">
                      Approved
                    </span>
                  )}
                  {task?.task?.status === "ASSIGNED" && (
                    <span className="bg-pink-100 text-pink-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-pink-400">
                      Assigned
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center">
              <span className="font-bold text-gray-800 w-40">Priority:</span>{" "}
                <span
                  className={`text-sm text-center font-semibold px-3 py-0.5 mx-2 rounded-full border ${color(
                    task?.task?.priority
                  )}`}
                >
                  {setPriorityValue(task?.task?.priority)}
                </span>
              </div>

              {/* <div className="shadow-xl rounded-lg w-full p-5 bg-gray-50">
                <div className="font-bold text-gray-800 mb-4">
                  People Assigned:
                </div>
                <div className="flex items-center">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <tr>
                        <th className="py-3 px-6 text-left">S.No</th>
                        <th className="py-3 px-6 text-left">Assigned By</th>
                        <th className="py-3 px-6 text-left">Assigned To</th>
                        <th className="py-3 px-6 text-left">Assigned On</th>
                        <th className="py-3 px-6 text-left">Approved By</th>
                        <th className="py-3 px-6 text-left">Approved On</th>
                        {(userType === "admin" ||
                          username === task?.project?.manager?.username) && (
                          <th className="py-3 px-6 text-left">Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-medium">
                      {task?.assignee?.map((assignedTask, index) => (
                        
                        <tr
                        key={assignedTask.id}
                        className="border-b border-gray-200 hover:bg-gray-100"
                        >
                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {assignedTask?.assigned_by?.name}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {assignedTask?.assigned_to?.name}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {new Date(assignedTask?.assigned_on).toDateString()}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {assignedTask?.approved_by?.name || (
                              <span className="text-red-500">Yet Not Approved</span>
                            )}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {assignedTask?.approved_on ? (
                              new Date(assignedTask?.approved_on).toDateString()
                            ) : (
                              <span className="text-red-500">Yet Not Approved</span>
                            )}
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSelected;
