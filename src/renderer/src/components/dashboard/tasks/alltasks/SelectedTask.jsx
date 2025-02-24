/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Input, CustomSelect, EditTask } from "../../../index";
import Service from "../../../../api/configAPI";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../../../../store/taskSlice";
import { BASE_URL } from "../../../../config/constant";

const SelectedTask = ({ taskDetail, taskID, isOpen, onClose, setTasks }) => {
  let taskData = useSelector((state) =>
    state?.taskData?.taskData.filter((task) => task.id === taskID),
  );
  const [workHours, setWorkHours] = useState(null);
  const [workdata, setWorkData] = useState({});

  const staffData = useSelector((state) => state?.userData?.staffData);
  const projectData = useSelector((state) =>
    state?.projectData?.projectData.find(
      (project) => project?.id === taskDetail?.project?.id,
    ),
  );
  console.log("Project Data------------", projectData);
  taskData = taskData[0];

  console.log("taskData------------", taskData);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const username = sessionStorage.getItem("username");
  const userType = sessionStorage.getItem("userType");
  useEffect(() => {
    const fetchWorkId = async () => {
      const workHour = await Service.getWorkHours(taskID);
      console.log("Work Hour: ", workHour);
      setWorkData(workHour);
      setWorkHours(workHour);
    };
    fetchWorkId();
  }, [taskID]);
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
  const formatMinutesToHoursAndMinutes = (totalMinutes) => {
    if (!totalMinutes) return "0h 0m";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };
  const addComment = async (commentData) => {
    try {
      const response = await Service.addComment(taskDetail?.id, commentData);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[92%] fixed top-[8%] overflow-x-auto p-5 rounded-lg shadow-lg w-screen ">
        <div className="flex justify-between px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-teal-200/50">
          <h2 className="text-3xl font-bold text-gray-800">Task Details</h2>
          <button
            className="px-5 text-xl font-bold text-white rounded-lg bg-teal-500/50 hover:bg-teal-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="h-[80vh] overflow-y-auto p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-5">
            <div className="p-5 rounded-lg bg-teal-100/70">
              <div className="flex items-center my-2">
                <strong className="w-40 font-bold text-gray-800">
                  Task Name:
                </strong>
                <div>{taskData?.name}</div>
              </div>
              <div className="flex items-center my-2">
                <strong className="w-40 font-bold text-gray-800">
                  Description:
                </strong>
                {taskData?.description}
              </div>
              <div className="flex items-center my-2">
                <strong className="w-40 font-bold text-gray-800">
                  Current User:
                </strong>{" "}
                {
                  staffData?.find((staff) => staff?.id === taskData?.user_id)
                    ?.f_name
                }
              </div>
              <div className="flex items-center my-2">
                <strong className="w-40 font-bold text-gray-800">
                  Start Date:
                </strong>
                {start_date?.toDateString()}
              </div>
              <div className="flex items-center my-2">
                <strong className="w-40 font-bold text-gray-800">
                  Due Date:
                </strong>
                {due_date?.toDateString()}
              </div>
              <div className="flex items-center my-2">
                <strong className="w-40 font-bold text-gray-800">
                  Duration:
                </strong>
                {durToHour(taskData?.duration)}
              </div>
              <div className="flex items-center my-2">
                <span className="w-40 font-bold text-gray-800">
                  Work Hours:
                </span>
                <span className="text-lg">
                  {formatMinutesToHoursAndMinutes(workHours?.duration)}
                </span>
              </div>
              <div className="flex items-center my-2">
                <strong className="w-40 font-bold text-gray-800">
                  Status:
                </strong>
                <span className="text-lg">{taskData?.status}</span>
              </div>
              <div className="flex items-center my-2">
                <strong className="w-40 font-bold text-gray-800">
                  Priority:
                </strong>
                <span
                  className={`text-sm font-semibold px-3 py-0.5 mx-2 rounded-full border ${color(
                    taskData?.priority,
                  )}`}
                >
                  {setPriorityValue(taskData?.priority)}
                </span>
              </div>
              {userType !== "user" ? (
                <Button onClick={handleEditClick}>Update</Button>
              ) : null}
            </div>

            <div className="flex flex-col justify-between pl-4 bg-gray-200 gap-y-5">
              <div>
                <div className="my-5 text-xl font-bold text-gray-900">
                  Project Detail:
                </div>
                <hr className="m-2" />
                <div className="flex items-center mb-2">
                  <strong className="w-40 font-bold text-gray-800">
                    Project Name:
                  </strong>{" "}
                  {projectData?.name}
                </div>
                <div className="flex items-center mb-2">
                  <strong className="w-40 font-bold text-gray-800">
                    Project Description:
                  </strong>{" "}
                  {projectData?.description}
                </div>
                <div className="flex items-center mb-2">
                  <strong className="w-40 font-bold text-gray-800">
                    Project Manager:
                  </strong>{" "}
                  {projectData?.manager?.f_name}
                </div>
                <div className="flex items-center mb-2">
                  <strong className="w-40 font-bold text-gray-800">
                    Project Stage:
                  </strong>{" "}
                  {projectData?.stage}
                </div>
                <div className="flex items-center mb-2">
                  <strong className="w-40 font-bold text-gray-800">
                    Project Status:
                  </strong>{" "}
                  {projectData?.status}
                </div>
                <div className="flex items-center mb-2">
                  <strong className="w-40 font-bold text-gray-800">
                    Project Status:
                  </strong>{" "}
                  {projectData?.files?.map((file, index) => (
                    <a
                      key={index}
                      href={`${BASE_URL}/project/projects/viewfile/${projectData?.id}/${file.id}`} // Use the file path with baseURL
                      target="_blank" // Open in a new tab
                      rel="noopener noreferrer"
                      className="px-5 py-2 text-teal-500 hover:underline"
                    >
                      {file.originalName || `File ${index + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full p-5 my-5 rounded-lg shadow-xl bg-teal-200/60">
            <div className="mb-4 font-bold text-gray-800">People Assigned:</div>
            <div className="flex items-center">
              <table className="min-w-full bg-white">
                <thead className="text-sm leading-normal text-gray-600 uppercase bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">S.No</th>
                    <th className="px-6 py-3 text-left">Assigned By</th>
                    <th className="px-6 py-3 text-left">Assigned To</th>
                    <th className="px-6 py-3 text-left">Assigned On</th>
                    <th className="px-6 py-3 text-left">Approved By</th>
                    <th className="px-6 py-3 text-left">Approved On</th>
                    {(userType === "admin" ||
                      username === taskDetail?.project?.manager?.username) && (
                      <th className="px-6 py-3 text-left">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-gray-600">
                  {taskDetail?.assigned?.map((tasks, index) => (
                    <tr
                      key={tasks.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="px-6 py-3 text-left whitespace-nowrap">
                        {index + 1}
                      </td>

                      <td className="px-6 py-3 text-left">
                        {tasks?.assigned_by?.name}
                      </td>
                      <td className="px-6 py-3 text-left">
                        {tasks?.assigned_to?.name}
                      </td>
                      <td className="px-6 py-3 text-left">
                        {new Date(tasks?.assigned_on).toDateString()}
                      </td>
                      <td className="px-6 py-3 text-left">
                        {tasks?.approved_by?.name || (
                          <span className="text-red-500">Yet Not Approved</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-left">
                        {tasks?.approved_on ? (
                          new Date(tasks?.approved_on).toDateString()
                        ) : (
                          <span className="text-red-500">Yet Not Approved</span>
                        )}
                      </td>
                      {(userType === "admin" ||
                        username === tasks.project?.manager?.username) && (
                        <td className="px-6 py-3 text-left">
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
          <div className="flex flex-col w-full gap-5 p-5 mt-5 bg-teal-100 rounded-lg shadow-xl">
            <div className="text-2xl font-bold text-gray-800">Comments:</div>
            <div className="flex flex-row w-full">
              <div className="w-full">
                <form onSubmit={handleSubmit(addComment)}>
                  <div className="flex flex-row w-full p-4 rounded-lg bg-gray-200/60">
                    <div className="w-full">
                      <Input
                        type="textarea"
                        label="Add Comment"
                        className="w-3/4 h-20"
                        placeholder="Add Comment"
                        {...register("comment")}
                      />
                      {/* <Input
                        label="Upload file/document"
                        placeholder="Upload file"
                        name="files"
                        type="file"
                        id="file"
                        accept=".pdf, .zip, .doc, image/*"
                        {...register("files")}
                      /> */}
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

            {taskData?.taskcomment?.length > 0 && (
              <div className="p-5 rounded-lg shadow-xl bg-gray-100/70">
                <div className="space-y-4">
                  {taskData?.taskcomment?.map((comment, index) => (
                    <div
                      className="p-4 bg-white rounded-lg shadow-md"
                      key={index}
                    >
                      <div className="flex items-center mb-2">
                        <span className="font-bold text-gray-800">
                          {
                            staffData?.find(
                              (staff) => staff?.id === comment?.user_id,
                            )?.f_name
                          }
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
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
                        {/* {comment?.file && (
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
                        )} */}
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
