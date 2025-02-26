/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from "react";
import Service from "../../../api/configAPI";
import { Button, Input, CustomSelect } from "../../index";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config/constant";

const Task = ({ taskId, setDisplay }) => {
  const work_id = sessionStorage.getItem("work_id");
  const [tasks, setTasks] = useState();

  const [workHours, setWorkHours] = useState(null);
  const userType = sessionStorage.getItem("userType");
  const username = sessionStorage.getItem("username");
  const [workdata, setWorkData] = useState({});
  const [teamMember, setTeamMember] = useState([]);
  const [color, setColor] = useState("");
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [showFabricatorDetail, setShowFabricatorDetail] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const teamData = useSelector((state) => state?.projectData?.teamData);
  const staffData = useSelector((state) => state?.userData?.staffData);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [record, setRecord] = useState({});

  const userData = useSelector((state) => state?.userData?.userData);
  const staffs = useSelector((state) => state?.userData?.staffData);
  const projectData = useSelector((state) =>
    state?.projectData?.projectData?.find(
      (project) => project.id === tasks?.project_id,
    ),
  );
  const fetchTask = useCallback(async () => {
    try {
      const taskData = await Service.getTaskById(taskId);
      setTasks(taskData);
      updatePriorityColor(taskData?.priority);
    } catch (error) {
      error("Error fetching task details.");
      console.log("Error in fetching task: ", error);
    }
  }, [taskId]);

  useEffect(() => {
    const fetchWorkId = async () => {
      const workHour = await Service.getWorkHours(taskId);
      console.log("Work Hour: ", workHour);
      setWorkData(workHour);
      setWorkHours(workHour);
    };
    fetchWorkId();
  }, [taskId]);

  console.log(tasks);

  console.log("Work Hours: ", workHours);

  useEffect(() => {
    const teamID = tasks?.project?.teamID;
    if (teamID) {
      let memberData = teamData?.find((team) => team.id === teamID);
      console.log("Member Data: ", memberData);
      const members = memberData?.members?.map((member) => ({
        label: `${member?.role} - ${staffData?.find((staff) => staff.id === member?.id)?.f_name || "Unknown"}`,
        value: member?.id,
      }));
      setTeamMember(members);
    }
  }, [tasks]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000); // Increment every second
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval); // Cleanup on unmount
  }, [isTimerRunning]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const updatePriorityColor = (priority) => {
    const colors = {
      0: "bg-green-200 border-green-800 text-green-800",
      1: "bg-yellow-200 border-yellow-800 text-yellow-800",
      2: "bg-purple-200 border-purple-800 text-purple-800",
      3: "bg-red-200 border-red-700m text-red-700",
    };
    setColor(colors[priority] || "");
  };

  const getPriorityLabel = (value) => {
    const priorities = {
      0: "LOW",
      1: "MEDIUM",
      2: "HIGH",
      3: "CRITICAL",
    };
    return priorities[value] || "UNKNOWN";
  };

  const getStatusLabel = (status) => {
    const labels = {
      "IN-PROGRESS": "IN PROGRESS",
      "ON-HOLD": "On-Hold",
      BREAK: "Break",
      "IN-REVIEW": "In-Review",
      Completed: "Completed",
      APPROVED: "Approved",
      ASSINGED: "Assigned",
    };
    return labels[status] || status;
  };

  // Status styles mapping
  const getStatusBadge = (status) => {
    const statusStyles = {
      "IN PROGRESS": "bg-green-100 text-green-400 border-green-400",
      "ON HOLD": "bg-yellow-100 text-yellow-700 border-yellow-700",
      BREAK: "bg-red-100 text-red-600 border-red-600",
      "IN REVIEW": "bg-orange-100 text-orange-600 border-orange-600",
      Completed: "bg-green-100 text-green-800 border-green-800",
      APPROVED: "bg-purple-100 text-purple-600 border-purple-600",
      ASSINGED: "bg-pink-100 text-pink-500 border-pink-500",
    };
    return statusStyles[status] || "bg-gray-100 text-gray-500 border-gray-500";
  };

  function handleClose() {
    setDisplay(false);
  }

  useEffect(() => {
    const handleProjectChange = async () => {
      try {
        const assigned = tasks?.project?.team?.members?.map((member) => ({
          label: `${member?.role} - ${member?.employee?.name}`,
          value: member?.employee?.id,
        }));
        // console.log("Assigned: ", assigned);
        setTeamMember(assigned);
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };

    handleProjectChange();
  }, []);

  const due_date = new Date(tasks?.due_date);
  const created_on = new Date(tasks?.created_on);
  const endDate = new Date(tasks?.project?.endDate);

  const toggleProjectDetail = () => {
    setShowProjectDetail(!showProjectDetail);
  };

  const toggleFabricatorDetail = () => {
    setShowFabricatorDetail(!showFabricatorDetail);
  };

  console.log(tasks);

  async function handleStart() {
    const taskID = tasks?.id;
    try {
      const accept = await Service.startTask(taskID);

      setTasks((prev) => {
        return {
          ...prev,
          status: "IN PROGRESS",
        };
      })

      toast.success("Task Started");
      sessionStorage.setItem("work_id", accept.data.id);
    } catch (error) {
      toast.error("Error in accepting task");
      console.error("Error in accepting task:", error);
    }
  }

  async function handlePause(ev) {
    const taskId = tasks?.id;
    try {
      const pause = await Service.pauseTask(taskId, ev?.target?.value);
      // console.log("Paused Task: ", pause);
      setTasks((prev) => {
        return {
          ...prev,
          status: "BREAK",
        };
      });
      toast.success("Task Paused");
      fetchTask();
    } catch (error) {
      toast.error("Error in pausing task");
      console.log("Error in pausing task: ", error);
    }
  }

  async function handleResume(ev) {
    const taskID = tasks?.id;
    try {
      const resume = await Service.resumeTask(taskID, ev?.target?.value);
      // console.log("Resumed Task: ", resume);
      setTasks((prev) => {
        return {
          ...prev,
          status: "IN PROGRESS",
        };
      });
      toast.success("Task Resumed");
      fetchTask();
    } catch (error) {
      toast.error("Error in resuming task");
      console.log("Error in resuming task: ", error);
    }
  }

  async function handleEnd(ev) {
    const taskID = tasks?.id;
    try {
      const end = await Service.endTask(taskID, ev?.target?.value);
      console.log("End Task: ", end);
      toast.success("Task Ended");
      fetchTask();
    } catch (error) {
      toast.error("Error in ending task");
      console.log("Error in ending task: ", error);
    }
  }

  const formatMinutesToHoursAndMinutes = (totalMinutes) => {
    if (!totalMinutes) return "0h 0m";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  // For Comment Form
  const onSubmitComment = async (data) => {
    // console.log(data);
    try {
      const response = await Service.addComment(tasks.id, data);
      toast.success("Comment Added Successfully");
      await fetchTask();
    } catch (error) {
      toast.error(error)
      console.error("Error in adding comment:", error);
    }
  };
  // For Assign Form
  const handleAddAssign = async (assigneedata) => {
    const assigned_to = assigneedata?.assigned_to;
    const assigned_by = userData.id;
    const approved_by = userData.id;
    const assigned_on = new Date().toISOString();

    try {
      if (userType === "admin" || userType === "manager") {
        const updatedData = {
          assigned_to,
          assigned_by,
          assigned_on,
          approved_by,
        };
        if (handlePause) {
          const response = await Service.addAssigne(tasks?.id, updatedData);
          // console.log("Assigned Task: ", response);
          fetchTask();
        }
      } else {
        const updatedData = {
          assigned_to,
          assigned_by,
          assigned_on,
        };
        if (handlePause) {
          const response = await Service.addAssigne(tasks?.id, updatedData);
          // console.log("Assigned Task: ", response);
          fetchTask();
        }
      }
      alert("Task assigned successfully.");
    } catch (error) {
      console.error("Error in assigning task: ", error);
    }
  };

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

  // console.log(tasks);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[92%] fixed top-[8%] overflow-x-auto p-5 rounded-lg shadow-lg w-screen ">
        <div className="flex justify-between px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-teal-200/50">
          <div className="text-2xl">
            <span className="font-bold text-gray-800">Task Name:</span>{" "}
            {tasks?.name}
          </div>
          <button
            className="px-5 text-xl font-bold text-white rounded-lg bg-teal-500/50 hover:bg-teal-700"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        <div className="main-container h-[80vh] overflow-y-auto ">
          <div className="p-5 m-2 ">
            {taskId ? (
              <>
                <div className="space-y-4">
                  {/* Task Detail */}
                  <div className="w-full p-5 rounded-lg shadow-xl bg-teal-100/50">
                    <div className="flex items-center my-3">
                      <span className="w-40 font-bold text-gray-800">
                        Task Description:
                      </span>{" "}
                      <span className="flex flex-wrap text-lg">
                        {tasks?.description}
                      </span>
                    </div>

                    <div className="flex items-center my-3">
                      <span className="w-40 font-bold text-gray-800">
                        Assigned Date:
                      </span>{" "}
                      <span className="text-lg">
                        {created_on?.toDateString()}
                      </span>
                    </div>

                    <div className="flex items-center my-3">
                      <span className="w-40 font-bold text-gray-800">
                        Due Date:
                      </span>{" "}
                      <span className="text-lg">
                        {due_date?.toDateString()}
                      </span>
                    </div>

                    <div className="flex items-center my-3">
                      <span className="w-40 font-bold text-gray-800">
                        Duration:
                      </span>{" "}
                      <span className="text-lg">
                        {durToHour(tasks?.duration)}
                      </span>
                    </div>
                    <div className="flex items-center my-3">
                      <span className="w-40 font-bold text-gray-800">
                        Work Hours:
                      </span>
                      <span className="text-lg">
                        {formatMinutesToHoursAndMinutes(workHours?.duration)}
                      </span>
                    </div>
                    <div className="flex items-center my-3">
                      <span className="w-40 font-bold text-gray-800">
                        Status:
                      </span>{" "}
                      <span className="text-lg">
                        {tasks?.status && (
                          <span
                            className={`text-sm text-center font-medium px-3 py-1 rounded-full border ${getStatusBadge(tasks.status)}`}
                          >
                            {getStatusLabel(tasks.status)}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center my-3">
                      <span className="w-40 font-bold text-gray-800">
                        Priority:
                      </span>{" "}
                      <span
                        className={`text-sm text-center font-semibold px-3 py-1 rounded-full border ${color}`}
                      >
                        {getPriorityLabel(tasks?.priority)}
                      </span>
                    </div>
                    <div className="flex flex-row items-center my-3">
                      <div className="w-40 font-bold text-gray-800">
                        Task Actions:
                      </div>
                      <div>
                        {tasks?.status === "ASSINGED" ||
                        tasks?.status === "ON HOLD" ||
                        workdata.id === undefined ? (
                          <>
                            <Button
                              className="flex items-center justify-center font-semibold bg-green-500 rounded-full w-28 hover:bg-green-800"
                              onClick={handleStart}
                            >
                              Start
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-row items-center justify-center gap-x-5">
                              {/* Show Pause button if the task is running */}
                              {tasks?.status === "IN PROGRESS" && (
                                <Button
                                  className="flex items-center justify-center font-semibold bg-yellow-500 rounded-full w-28 hover:bg-yellow-700"
                                  value={workdata?.id}
                                  onClick={handlePause}
                                >
                                  Pause
                                </Button>
                              )}

                              {/* Show Resume button if the task is paused */}
                              {tasks?.status === "BREAK" && (
                                <Button
                                  className="flex items-center justify-center font-semibold bg-green-500 rounded-full w-28 hover:bg-green-700"
                                  value={workdata?.id}
                                  onClick={handleResume}
                                >
                                  Resume
                                </Button>
                              )}

                              {/* Always show End button */}
                              <Button
                                className="flex items-center justify-center font-semibold bg-red-500 rounded-full w-28 hover:bg-red-800"
                                value={workdata?.id}
                                onClick={handleEnd}
                              >
                                End
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full p-5 rounded-lg shadow-xl bg-teal-200/50">
                    <div className="mb-4 font-bold text-gray-800">
                      People Assigned:
                    </div>
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
                              username ===
                                tasks?.project?.manager?.username) && (
                              <th className="px-6 py-3 text-left">Action</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-gray-600">
                          {tasks?.taskInAssignedList?.map((task, index) => (
                            <tr
                              key={task.id}
                              className="border-b border-gray-200 hover:bg-gray-100"
                            >
                              <td className="px-6 py-3 text-left whitespace-nowrap">
                                {index + 1}
                              </td>

                              <td className="px-6 py-3 text-left">
                                {task?.assigned_by?.name}
                              </td>
                              <td className="px-6 py-3 text-left">
                                {task?.assigned_to?.name}
                              </td>
                              <td className="px-6 py-3 text-left">
                                {new Date(task?.assigned_on).toDateString()}
                              </td>
                              <td className="px-6 py-3 text-left">
                                {task?.approved_by?.name || (
                                  <span className="text-red-500">
                                    Yet Not Approved
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-3 text-left">
                                {task?.approved_on ? (
                                  new Date(task?.approved_on).toDateString()
                                ) : (
                                  <span className="text-red-500">
                                    Yet Not Approved
                                  </span>
                                )}
                              </td>
                              {(userType === "admin" ||
                                username ===
                                  tasks?.project?.manager?.username) && (
                                <td className="px-6 py-3 text-left">
                                  <Button
                                    className={`${
                                      task?.approved_on
                                        ? "bg-gray-300 text-gray-700"
                                        : "bg-green-300 text-green-900"
                                    } px-2 py-0.5 rounded-full cursor-default`}
                                    disabled={task?.approved_on}
                                  >
                                    {task?.approved_on ? "Approved" : "Approve"}
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* select Assignee */}

                  <form
                    onSubmit={handleSubmit(handleAddAssign)} // separate handler
                    className="w-full gap-5 p-5 rounded-lg shadow-xl bg-teal-200/30"
                  >
                    <div className="mb-4 font-bold text-gray-800">
                      Assign Other User:
                    </div>

                    <div className="flex items-center w-1/2 gap-10 flex-col-2 justify-evenly">
                      <div className="w-full">
                        <CustomSelect
                          label="Select Assignee"
                          options={teamMember}
                          className="h-10 80"
                          {...register("assigned_to")}
                          onChange={setValue}
                        />
                      </div>
                      <div className="w-full">
                        <Button
                          className="py-1 font-bold bg-teal-600 hover:bg-teal-900"
                          type="submit"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </form>

                  {/* comment */}

                  <br />

                  <div className="grid grid-cols-2 gap-5">
                    {/* Project */}
                    <div className="w-full p-5 rounded-lg shadow-xl h-fit bg-teal-200/50">
                      <div className="flex items-center gap-2 my-5 text-xl">
                        <span className="font-bold text-gray-800">
                          Project Detail:
                        </span>{" "}
                        <span
                          className="text-teal-600 cursor-pointer"
                          onClick={toggleProjectDetail}
                        >
                          {tasks?.project?.name}
                        </span>
                      </div>
                      {showProjectDetail && (
                        <div className="grid grid-cols-1 gap-6 overflow-x-hidden overflow-y-hidden md:grid-cols-2">
                          {[
                            {
                              label: "Description",
                              value: projectData?.description,
                            },
                            {
                              label: "Fabricator",
                              value: projectData?.fabricator?.fabName,
                            },
                            { label: "Status", value: projectData?.status },
                            {
                              label: "Estimated Hours",
                              value: projectData?.estimatedHours,
                            },
                            { label: "Stage", value: projectData?.stage },
                            { label: "Tool", value: projectData?.tools },
                            {
                              label: "Start Date",
                              value: projectData?.startDate,
                            },
                            {
                              label: "Department",
                              value: projectData?.department?.name,
                            },
                            {
                              label: "End Date",
                              value: projectData?.approvalDate,
                            },
                            {
                              label: "Department Manager",
                              value: projectData?.manager?.f_name,
                            },
                            {
                              label: "Project Manager",
                              value: projectData?.manager?.f_name,
                            },

                            {
                              label: "Files",
                              value: Array.isArray(projectData?.files)
                                ? projectData?.files?.map((file, index) => (
                                    <a
                                      key={index}
                                      href={`${BASE_URL}/project/projects/viewfile/${projectData?.id}/${file.id}`} // Use the file path with baseURL
                                      target="_blank" // Open in a new tab
                                      rel="noopener noreferrer"
                                      className="px-5 py-2 text-teal-500 hover:underline"
                                    >
                                      {file.originalName || `File ${index + 1}`}
                                    </a>
                                  ))
                                : "Not available",
                            },
                          ]?.map(({ label, value }) => (
                            <div key={label} className="flex flex-col">
                              <span className="font-medium text-gray-700">
                                {label}:
                              </span>
                              <span className="text-gray-600">
                                {value || "Not available"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Fabricator */}
                    {userType === "admin" || userType === "manager" ? (
                      <div className="w-full p-5 rounded-lg shadow-xl h-fit bg-teal-200/50">
                        <div className="flex items-center gap-2 my-5 text-xl">
                          <span className="font-bold text-gray-800">
                            Fabricator Detail:
                          </span>{" "}
                          <span
                            className="text-teal-600 cursor-pointer"
                            onClick={toggleFabricatorDetail}
                          >
                            {tasks?.project?.fabricator?.fabName}
                          </span>
                        </div>
                        {showFabricatorDetail && (
                          <div className="ml-8 space-y-4">
                            <div className="flex items-center gap-4">
                              <span className="w-40 font-bold text-gray-800">
                                Website:
                              </span>{" "}
                              <a
                                href={tasks?.project?.fabricator?.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="overflow-hidden text-blue-500 hover:text-blue-700 overflow-ellipsis whitespace-nowrap"
                              >
                                {tasks?.project?.fabricator?.website}
                              </a>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="w-32 font-bold text-gray-800">
                                Drive:
                              </span>{" "}
                              <a
                                href={tasks?.project?.fabricator?.drive}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="overflow-hidden text-blue-500 hover:text-blue-700 overflow-ellipsis whitespace-nowrap"
                              >
                                {tasks?.project?.fabricator?.drive}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col w-full gap-5 p-5 mt-5 bg-teal-100 rounded-lg shadow-xl">
                  <div className="text-2xl font-bold text-gray-800">
                    Comments:
                  </div>
                  <form onSubmit={handleSubmit(onSubmitComment)}>
                    {" "}
                    <div className="flex flex-row w-full p-4 rounded-lg bg-gray-200/60">
                      <div className="w-full">
                        <Input
                          type="textarea"
                          label="Add Comment"
                          className="w-3/4 h-20"
                          placeholder="Add Comment"
                          {...register("comment")}
                        />

                        <Button type="submit">Add Comment</Button>
                      </div>
                    </div>
                  </form>
                  {tasks?.taskcomment?.length > 0 && (
                    <div className="p-5 rounded-lg shadow-xl bg-gray-100/70">
                      <div className="space-y-4">
                        {tasks?.taskcomment?.map((comment, index) => (
                          <div
                            className="p-4 bg-white rounded-lg shadow-md"
                            key={index}
                          >
                            <div className="flex items-center mb-2">
                              <span className="font-bold text-gray-800">
                                {comment?.data}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(
                                  comment?.created_on,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div>
                <h1 className="flex items-center justify-center py-10 text-2xl font-bold text-white uppercase bg-slate-500">
                  No Task
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
