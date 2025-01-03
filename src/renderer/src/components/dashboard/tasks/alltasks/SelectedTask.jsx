/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Input, CustomSelect, EditTask } from "../../../index";
import Service from "../../../../api/configAPI";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../../../../store/taskSlice";

const SelectedTask = ({ taskDetail, taskID, isOpen, onClose, setTasks }) => {
  const taskData = useSelector((state) =>
    state?.taskData?.taskData.find((task) => task.id === taskID),
  );

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const username = sessionStorage.getItem("username");
  const userType = sessionStorage.getItem("userType");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  if (!isOpen) return null;

  const handleEditClick = () => {
    setIsModalOpen(true);
    setSelectedTask(taskDetail);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const durToHour = (params) => {
    if (!params) return "N/A";

    const parts = params.split(" ");
    let days = 0;
    let timePart = params;

    if (parts.length === 2) {
      days = parseInt(parts[0], 10);
      timePart = parts[1];
    }

    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    const totalHours = days * 24 + hours;
    return `${totalHours}h ${minutes}m`;
  };

  const addComment = async (commentData) => {
    try {
      const response = await Service.addComment(
        taskDetail?.id,
        commentData?.comment,
        commentData?.file,
      );
      console.log("Comment Response: ", response);
      alert("Comment Added Successfully");
    } catch (error) {
      console.error("Error in adding comment: ", error);
    }
  };

  const color = (priority) => {
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
  };

  const setPriorityValue = (value) => {
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
  };

  const start_date = new Date(taskDetail?.start_date);
  const due_date = new Date(taskDetail?.due_date);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[92%] fixed top-[8%] overflow-x-auto p-5 rounded-lg shadow-lg w-screen ">
        <div className="text-3xl font-bold flex justify-between text-white bg-teal-200/50 shadow-xl px-5 py-1 mt-2 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800">Task Details</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="h-[80vh] overflow-y-auto p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-teal-100/70 rounded-lg p-5">
              <div className="my-2">
                <strong className="text-gray-700">Task Name:</strong>
                <div>{taskData?.name}</div>
              </div>

              <div className="my-2">
                <strong className="text-gray-700">Description:</strong>
                {taskData?.description}
              </div>

              <div className="my-2">
                <strong className="text-gray-700">Current User:</strong>{" "}
                {taskData?.user?.name}
              </div>

              <div className="my-2">
                <strong className="text-gray-700">Start Date:</strong>
                {start_date?.toDateString()}
              </div>
              <div className="my-2">
                <strong className="text-gray-700">Due Date:</strong>
                {due_date?.toDateString()}
              </div>

              <div className="my-2">
                <strong className="text-gray-700">Duration:</strong>
                {durToHour(taskData?.duration)}
              </div>

              <div className="my-2">
                <strong className="text-gray-700">Status:</strong>
                {taskData?.status}
              </div>

              <div>
                <div>
                  <strong className="text-gray-700">Priority:</strong>
                  <span
                    className={`text-sm font-semibold px-3 py-0.5 mx-2 rounded-full border ${color(
                      taskData?.priority,
                    )}`}
                  >
                    {setPriorityValue(taskData?.priority)}
                  </span>
                </div>
              </div>
              {userType == !"user" ? null : (
                <Button onClick={handleEditClick}>Update</Button>
              )}
            </div>

            <div className="flex flex-col justify-between bg-gray-200 pl-4 gap-y-5">
              <div>
                <div className="text-xl font-bold my-5 text-gray-900">
                  Project Detail:
                </div>
                <hr className="m-2" />
                <p className="mb-2">
                  <strong className="text-gray-700">Project Name:</strong>{" "}
                  {taskData?.project?.name}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">
                    Project Description:
                  </strong>{" "}
                  {taskData?.project?.description}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Project Manager:</strong>{" "}
                  {taskData?.project?.manager?.name}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Project Stage:</strong>{" "}
                  {taskData?.project?.stage}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Project Status:</strong>{" "}
                  {taskData?.project?.status}
                </p>
              </div>
            </div>
          </div>
          <div className="shadow-xl rounded-lg w-full my-5 p-5 bg-teal-200/60">
            <div className="font-bold text-gray-800 mb-4">People Assigned:</div>
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
                      username === taskDetail?.project?.manager?.username) && (
                      <th className="py-3 px-6 text-left">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-medium">
                  {taskDetail?.assigned?.map((tasks, index) => (
                    <tr
                      key={tasks.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {index + 1}
                      </td>

                      <td className="py-3 px-6 text-left">
                        {tasks?.assigned_by?.name}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {tasks?.assigned_to?.name}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {new Date(tasks?.assigned_on).toDateString()}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {tasks?.approved_by?.name || (
                          <span className="text-red-500">Yet Not Approved</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {tasks?.approved_on ? (
                          new Date(tasks?.approved_on).toDateString()
                        ) : (
                          <span className="text-red-500">Yet Not Approved</span>
                        )}
                      </td>
                      {(userType === "admin" ||
                        username === tasks.project?.manager?.username) && (
                        <td className="py-3 px-6 text-left">
                          <Button
                            className={`${
                              tasks?.approved_on
                                ? "bg-gray-300 text-gray-700"
                                : "bg-green-300 text-green-900"
                            } px-2 py-0.5 rounded-full`}
                            disabled={tasks?.approved_on}
                          >
                            {tasks?.approved_on ? "Approved" : "Approve"}
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col  shadow-xl gap-5 rounded-lg w-full p-5 mt-5 bg-teal-100">
            <div className="font-bold text-gray-800 text-2xl">Comments:</div>
            <div className="flex flex-row w-full">
              <div className="w-full">
                <form onSubmit={handleSubmit(addComment)}>
                  <div className="flex flex-row w-full bg-gray-200/60 rounded-lg p-4">
                    <div className="w-full">
                      <Input
                        type="textarea"
                        label="Add Comment"
                        className="w-3/4 h-20"
                        placeholder="Add Comment"
                        {...register("comment")}
                      />
                      <Input
                        label="Upload file/document"
                        placeholder="Upload file"
                        name="file"
                        type="file"
                        id="file"
                        accept=".pdf, .zip, .doc, image/*"
                        {...register("file")}
                      />
                      <Button
                        className="bg-teal-500 py-0.5 hover:bg-teal-800 font-semibold"
                        type="submit"
                      >
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {taskDetail?.comments?.length > 0 && (
              <div className=" shadow-xl bg-gray-100/70 rounded-lg p-5">
                <div className="space-y-4">
                  {taskDetail?.comments?.map((comment, index) => (
                    <div
                      className="bg-white p-4 rounded-lg shadow-md"
                      key={index}
                    >
                      <div className="flex items-center mb-2">
                        <span className="font-bold text-gray-800">
                          {comment?.user?.name}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          {new Date(comment?.created_on).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        <div>{comment?.data} </div>
                        {comment?.file && (
                          <div>
                            <a
                              href={comment?.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              View File
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedTask && (
        <EditTask
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default SelectedTask;
