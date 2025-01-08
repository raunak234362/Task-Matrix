/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from "react";
import Service from "../../../api/configAPI";
import { Button, Input, CustomSelect } from "../../index";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const Task = ({ taskId, setDisplay }) => {
  const [tasks, setTasks] = useState();
  const userType = sessionStorage.getItem("userType");
  const username = sessionStorage.getItem("username");
  const [teamMember, setTeamMember] = useState([]);
  const [color, setColor] = useState("");
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [showFabricatorDetail, setShowFabricatorDetail] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer state
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

  const fetchTask = useCallback(async () => {
    try {
      const taskData = await Service.getTaskById(taskId);
      setTasks(taskData);
      updatePriorityColor(taskData?.priority);
    } catch (error) {
      console.log("Error in fetching task: ", error);
    }
  }, [taskId]);

  // useEffect(() => {
  //   const handleProjectChange = async () => {
  //     try {
  //       const assigned = tasks?.project?.team?.members?.map((member) => ({
  //         label: `${member?.role} - ${member?.employee?.name}`,
  //         value: member?.employee?.id,
  //       }));
  //       console.log("Assigned: ", assigned);
  //       setTeamMember(assigned);
  //     } catch (error) {
  //       console.error("Error fetching team details:", error);
  //     }
  //   };

  //   handleProjectChange();
  // }, []);

  useEffect(() => {
    if (tasks?.project?.team?.members) {
      const members = tasks.project.team.members.map((member) => ({
        label: `${member?.role} - ${staffs?.find((staff) => staff.id === member?.id)?.f_name || "Unknown"}`,
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
      3: "bg-red-200 border-red-700 text-red-700",
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
      "IN-PROGRESS": "In-Progress",
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
      "IN-PROGRESS": "bg-green-100 text-green-400 border-green-400",
      "ON-HOLD": "bg-yellow-100 text-yellow-700 border-yellow-700",
      BREAK: "bg-red-100 text-red-600 border-red-600",
      "IN-REVIEW": "bg-orange-100 text-orange-600 border-orange-600",
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
        console.log("Assigned: ", assigned);
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

  function handleAccept() {
    Service.acceptTask(tasks?.id)
      .then((res) => {
        console.log("Accepted Task: ", res);
        if (window.confirm("Task Accepted \n\nDo you wish to start now?")) {
          handleStart(res?.id);
        }
        fetchTask();
      })
      .catch((err) => {
        console.log("Error in accepting task: ", err);
      });
  }

  function handleStart() {
    const id = tasks?.record;
    console.log("Task ID: ", id);
    Service.startTask(id)
      .then((res) => {
        alert("Tasked Started");
        setIsTimerRunning(true);
        console.log("Started Task: ", res);
        fetchTask();
      })
      .catch((err) => {
        console.log("Error in starting task: ", err);
      });
  }

  async function handlePause() {
    Service.pauseTask(tasks?.record)
      .then((res) => {
        alert("Tasked Paused");
        setIsTimerRunning(false); // Pause the timer
        console.log("Paused Task: ", res);
        fetchTask();
      })
      .catch((err) => {
        console.log("Error in pausing task: ", err);
      });
  }

  function handleResume() {
    const fetchResume = Service.resumeTask(tasks?.record)
      .then((res) => {
        setRecord(fetchResume);
        alert("Tasked Resumed");
        setIsTimerRunning(true); // Stop the timer
        console.log("Resumed Task: ", res);
        fetchTask();
      })
      .catch((err) => {
        console.log("Error in resuming task: ", err);
      });
  }

  function handleEnd() {
    Service.endTask(tasks?.record)
      .then((res) => {
        alert("Tasked Ended");
        setIsTimerRunning(false); // Stop the timer
        setTimer(0); // Reset the timer
        console.log("Ended Task: ", res);
        fetchTask();
      })
      .catch((err) => {
        console.log("Error in ending task: ", err);
      });
  }

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // For Comment Form
  const onSubmitComment = async (data) => {
    console.log(data);
    try {
      const response = await Service.addComment(
        tasks.id,
        data.comment,
        data.file,
      );
      alert("Comment Added Successfully", response);
      await fetchTask();
    } catch (error) {
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
          approved_by
        };
        if (handlePause) {
          const response = await Service.addAssigne(tasks?.id, updatedData);
          console.log("Assigned Task: ", response);
          fetchTask();
        }
      }else{
        const updatedData = {
          assigned_to,
          assigned_by,
          assigned_on,
        };
        if (handlePause) {
          const response = await Service.addAssigne(tasks?.id, updatedData);
          console.log("Assigned Task: ", response);
          fetchTask();
        }
      }
      alert("Task Assigned Successfully");
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[92%] fixed top-[8%] overflow-x-auto p-5 rounded-lg shadow-lg w-screen ">
        <div className="text-3xl font-bold flex justify-between text-white bg-teal-200/50 shadow-xl px-5 py-1 mt-2 rounded-lg">
          <div className="text-2xl">
            <span className="font-bold text-gray-800">Task Name:</span>{" "}
            {tasks?.name}
          </div>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        <div className="main-container h-[80vh] overflow-y-auto ">
          <div className="m-2 p-5 ">
            {taskId ? (
              <>
                <div className="space-y-4">
                  {/* Task Detail */}
                  <div className="shadow-xl rounded-lg w-full p-5 bg-teal-100/50">
                    <div className="flex items-center my-3">
                      <span className="font-bold text-gray-800 w-40">
                        Task Description:
                      </span>{" "}
                      <span className="flex flex-wrap text-lg">
                        {tasks?.description}
                      </span>
                    </div>

                    <div className="flex items-center my-3">
                      <span className="font-bold text-gray-800 w-40">
                        Assigned Date:
                      </span>{" "}
                      <span className="text-lg">
                        {created_on?.toDateString()}
                      </span>
                    </div>

                    <div className="flex items-center my-3">
                      <span className="font-bold text-gray-800 w-40">
                        Due Date:
                      </span>{" "}
                      <span className="text-lg">
                        {due_date?.toDateString()}
                      </span>
                    </div>

                    <div className="flex items-center my-3">
                      <span className="font-bold text-gray-800 w-40">
                        Duration:
                      </span>{" "}
                      <span className="text-lg">
                        {durToHour(tasks?.duration)}
                      </span>
                    </div>
                    <div className="timer">Timer: {formatTimer(timer)}</div>
                    <div className="flex items-center my-3">
                      <span className="font-bold text-gray-800 w-40">
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
                      <span className="font-bold text-gray-800 w-40">
                        Priority:
                      </span>{" "}
                      <span
                        className={`text-sm text-center font-semibold px-3 py-1 rounded-full border ${color}`}
                      >
                        {getPriorityLabel(tasks?.priority)}
                      </span>
                    </div>
                    <div className="flex flex-row my-3 items-center">
                      <div className="font-bold text-gray-800 w-40">
                        Task Actions:
                      </div>
                      <div>
                        {tasks?.status === "ASSINGED" ||
                        tasks?.status === "ON-HOLD" ? (
                          <>
                            <Button
                              className="bg-green-500 flex justify-center font-semibold items-center rounded-full w-28 hover:bg-green-800"
                              onClick={
                                tasks?.status === "ON-HOLD"
                                  ? handleStart
                                  : handleAccept
                              }
                            >
                              {tasks?.status === "ON-HOLD" ? "Start" : "Accept"}
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-row justify-center items-center gap-x-5">
                              {/* Show Pause button if the task is running */}
                              {tasks?.status === "IN-PROGRESS" && (
                                <Button
                                  className="bg-yellow-500 flex justify-center font-semibold items-center rounded-full w-28 hover:bg-yellow-700"
                                  onClick={handlePause}
                                >
                                  Pause
                                </Button>
                              )}

                              {/* Show Resume button if the task is paused */}
                              {tasks?.status === "BREAK" && (
                                <Button
                                  className="bg-green-500 flex justify-center font-semibold items-center rounded-full w-28 hover:bg-green-700"
                                  onClick={handleResume}
                                >
                                  Resume
                                </Button>
                              )}

                              {/* Always show End button */}
                              <Button
                                className="bg-red-500 flex justify-center font-semibold items-center rounded-full w-28 hover:bg-red-800"
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

                  <div className="shadow-xl rounded-lg w-full p-5 bg-teal-200/50">
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
                              username ===
                                tasks?.project?.manager?.username) && (
                              <th className="py-3 px-6 text-left">Action</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-medium">
                          {tasks?.taskInAssignedList?.map((task, index) => (
                            <tr
                              key={task.id}
                              className="border-b border-gray-200 hover:bg-gray-100"
                            >
                              <td className="py-3 px-6 text-left whitespace-nowrap">
                                {index + 1}
                              </td>

                              <td className="py-3 px-6 text-left">
                                {task?.assigned_by?.name}
                              </td>
                              <td className="py-3 px-6 text-left">
                                {task?.assigned_to?.name}
                              </td>
                              <td className="py-3 px-6 text-left">
                                {new Date(task?.assigned_on).toDateString()}
                              </td>
                              <td className="py-3 px-6 text-left">
                                {task?.approved_by?.name || (
                                  <span className="text-red-500">
                                    Yet Not Approved
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-6 text-left">
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
                                <td className="py-3 px-6 text-left">
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
                    className="shadow-xl gap-5 rounded-lg w-full p-5 bg-teal-200/30"
                  >
                    <div className="font-bold text-gray-800 mb-4">
                      Assign Other User:
                    </div>

                    <div className="flex flex-col-2 justify-evenly gap-10 items-center w-1/2">
                      <div className="w-full">
                        <CustomSelect
                          label="Select Assignee"
                          options={teamMember}
                          className=" 80 h-10"
                          {...register("assigned_to")}
                          onChange={setValue}
                        />
                      </div>
                      <div className="w-full">
                        <Button
                          className="bg-teal-600 py-1 font-bold hover:bg-teal-900"
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
                    <div className="shadow-xl h-fit rounded-lg w-full p-5 bg-teal-200/50">
                      <div className="text-xl flex gap-2 my-5 items-center">
                        <span className="font-bold text-gray-800">
                          Project Detail:
                        </span>{" "}
                        <span
                          className="cursor-pointer text-teal-600"
                          onClick={toggleProjectDetail}
                        >
                          {tasks?.project?.name}
                        </span>
                      </div>
                      {showProjectDetail && (
                        <div className="space-y-4 ml-8">
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">
                              Project Manager:
                            </span>{" "}
                            <span>{tasks?.project?.manager?.f_name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">
                              Project Team:
                            </span>{" "}
                            <span>{tasks?.project?.team?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">
                              Project Description:
                            </span>{" "}
                            <span>{tasks?.project?.description}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">
                              Project Stage:
                            </span>{" "}
                            <span>{tasks?.project?.stage}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">
                              Project Status:
                            </span>{" "}
                            <span>{tasks?.project?.status}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">
                              Project Approval Date:
                            </span>{" "}
                            <span>{endDate?.toDateString()}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fabricator */}
                    {userType === "admin" || userType === "manager" ? (
                      <div className="shadow-xl h-fit rounded-lg w-full p-5 bg-teal-200/50">
                        <div className="text-xl flex  my-5 items-center gap-2">
                          <span className="font-bold text-gray-800">
                            Fabricator Detail:
                          </span>{" "}
                          <span
                            className="cursor-pointer text-teal-600"
                            onClick={toggleFabricatorDetail}
                          >
                            {tasks?.project?.fabricator?.fabName}
                          </span>
                        </div>
                        {showFabricatorDetail && (
                          <div className="space-y-4 ml-8">
                            <div className="flex gap-4 items-center">
                              <span className="font-bold text-gray-800 w-40">
                                Website:
                              </span>{" "}
                              <a
                                href={tasks?.project?.fabricator?.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 overflow-hidden overflow-ellipsis whitespace-nowrap"
                              >
                                {tasks?.project?.fabricator?.website}
                              </a>
                            </div>
                            <div className="flex gap-4 items-center">
                              <span className="font-bold text-gray-800 w-32">
                                Drive:
                              </span>{" "}
                              <a
                                href={tasks?.project?.fabricator?.drive}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 overflow-hidden overflow-ellipsis whitespace-nowrap"
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

                <div className="flex flex-col  shadow-xl gap-5 rounded-lg w-full p-5 mt-5 bg-teal-100">
                  <div className="font-bold text-gray-800 text-2xl">
                    Comments:
                  </div>
                  <form onSubmit={handleSubmit(onSubmitComment)}>
                    {" "}
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
                          name="file"
                          className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                          type="file"
                          id="file"
                          accept=".pdf, image/*"
                          {...register("file")}
                        />
                        <Button type="submit">Add Comment</Button>
                      </div>
                    </div>
                  </form>
                  {tasks?.comments?.length > 0 && (
                    <div className=" shadow-xl bg-gray-100/70 rounded-lg p-5">
                      <div className="space-y-4">
                        {tasks?.comments?.map((comment, index) => (
                          <div
                            className="bg-white p-4 rounded-lg shadow-md"
                            key={index}
                          >
                            <div className="flex items-center mb-2">
                              <span className="font-bold text-gray-800">
                                {comment?.user?.name}
                              </span>
                              <span className="text-gray-500 text-sm ml-2">
                                {new Date(
                                  comment?.created_on,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
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
              </>
            ) : (
              <div>
                <h1 className="text-2xl flex font-bold uppercase bg-slate-500 text-white py-10 justify-center items-center">
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
