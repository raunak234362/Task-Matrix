/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import { Approve, Header } from "../../../index";
import { TaskSelected } from "../../../index";
import { toast } from "react-toastify";

const ApproveAssignee = () => {
  const [assigneeTask, setAssigneeTask] = useState([]);
  const userType = sessionStorage.getItem("userType");
  const username = sessionStorage.getItem("username");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const token = sessionStorage.getItem("token");
  const [isApproved, setIsApproved] = useState(false);
  const handleViewClick = async (taskId) => {
    try {
      const task = await Service.getAssigneeById(taskId);
      setSelectedTask(task.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const handleApproveClick = async (taskId) => {
    try {
      const task = await Service.getAssigneeById(taskId);
      setSelectedTask(task.data);
      setIsApproveOpen(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const handleApproveModalClose = () => {
    setIsApproveOpen(false);
    setSelectedTask(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleApprove = async () => {
    try {
      const updatedTask = await Service.approveAssignee({
        tid: selectedTask.id,
      });
      setIsApproved(true);
      toast.success("Task successfully approved!");
      setAssigneeTask((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === updatedTask.data.id) {
            return updatedTask.data;
          } else {
            return task;
          }
        }),
      );
      setSelectedTask(updatedTask.data);
    } catch (error) {
      console.error("Error approving Assignee:", error);
      toast.error("Error approving Assignee. Please try again.");
    }
  };

  const handleComment = async () => {
    try {
      const comment = await Service.getComment(selectedTask.id, { token });
      console.log("Comment: ", comment);
    } catch (error) {
      console.log("Error in comment", error);
      alert("Comment Not Added");
    }
  };

  const handleReject = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const updatedTask = await Service.deleteAssignee(selectedTask.id, {
        token,
      });
      console.log("Task rejected:", updatedTask);
      alert("Task successfully rejected!");
    } catch (error) {
      console.error("Error rejecting task:", error);
      alert("Error rejecting task. Please try again.");
    }
    handleApproveModalClose();
  };

  useEffect(() => {
    const fetchAssigneeTasks = async () => {
      try {
        const assignee = await Service.getAssignee();
        console.log("Assignee Tasks:", assignee);
        setAssigneeTask(assignee.data);
        console.log("Assignee Tasks:", assignee);
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    };
    fetchAssigneeTasks();
  }, []);

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

  return (
    <div className="">
      <div className="w-full p-5 rounded-lg shadow-xl bg-gray-50">
        <div className="h-[70vh] overflow-y-auto">
          <table className="w-full text-center border-collapse table-auto rounded-xl">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">S.No</th>
                <th className="px-6 py-3 text-left">Task</th>
                <th className="px-6 py-3 text-left">Task Priority</th>
                <th className="px-6 py-3 text-left">Assigned By</th>
                <th className="px-6 py-3 text-left">Assigned To</th>
                <th className="px-6 py-3 text-left">Assigned On</th>
                <th className="px-6 py-3 text-left">Approved By</th>
                <th className="px-6 py-3 text-left">Approved On</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-600">
              {assigneeTask.map((task, index) => (
                <tr
                  key={task.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-200/50"}
                >
                  <td className="px-6 py-3 text-left whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 text-left">
                    <button onClick={() => handleViewClick(task.id)}>
                      {task?.task?.name}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-left">
                    <span
                      className={`text-sm text-center font-semibold px-3 py-0.5 mx-2 rounded-full border ${color(
                        task?.task?.priority,
                      )}`}
                    >
                      {setPriorityValue(task?.task?.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-left">
                    {task?.users?.username}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {task?.userss?.username}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {new Date(task?.assigned_on).toDateString()}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {task?.user?.username ? (
                      <span>{task?.user?.username}</span>
                    ) : (
                      <span className="text-red-500">Yet Not Approved</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {task?.approved_on ? (
                      new Date(task?.approved_on).toDateString()
                    ) : (
                      <span className="text-red-500">Yet Not Approved</span>
                    )}
                  </td>
                  {(userType === "admin" ||
                    username === task?.task?.project?.manager?.username) && (
                    <td className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleApproveClick(task.id)}
                        className={`${
                          task?.approved
                            ? "bg-gray-300 text-gray-700"
                            : "bg-green-300 text-green-900"
                        } px-2 py-0.5 rounded-full`}
                        disabled={task?.approved}
                      >
                        {task?.approved ? "Approved" : "Approve"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isApproveOpen && selectedTask && (
        <Approve
          isOpen={isApproveOpen}
          task={selectedTask}
          onClose={handleApproveModalClose}
          onApprove={handleApprove}
          onReject={handleReject}
          comment={handleComment}
          isApproved={isApproved}
          setIsApproved={setIsApproved}
        />
      )}

      {isModalOpen && selectedTask && (
        <TaskSelected
          assignee={assigneeTask}
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ApproveAssignee;
