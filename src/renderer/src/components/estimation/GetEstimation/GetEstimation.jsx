/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Service from "../../../api/configAPI";
import {
  Building2,
  ChartPie,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock4,
  Files,
  FolderKanban,
  FolderOpen,
  Globe,
  Pause,
  Play,
  Square,
} from "lucide-react";
import { MdOutlineDescription } from "react-icons/md";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

/* eslint-disable react/prop-types */
const GetEstimation = ({ task, setDisplay, fetchEstimation }) => {
  const [tasks, setTasks] = useState({});
  const [workHours, setWorkHours] = useState(null);
  const [workId, setWorkId] = useState(null);
  const [workdata, setWorkData] = useState({});
  const [color, setColor] = useState("");
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const staffData = useSelector((state) => state?.userData?.staffData);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const fetchEstimationDetails = async () => {
    try {
      const response = await Service.getEstimationTaskById(task);
      setTasks(response);
      fetchEstimation();
      console.log("Estimation details:", response);
    } catch (error) {
      console.error("Error fetching estimation details:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    const fetchWorkId = async () => {
      const workHour = await Service.getEstWorkHours(task);
      console.log("Work Hours: ", workHour);
      setWorkId(workHour?.id);
      localStorage.setItem("work_id", workHour?.id || workId);
      setWorkData(workHour);
      setWorkHours(workHour);
    };
    fetchWorkId();
  }, [task]);

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
      IN_PROGRESS: "IN PROGRESS",
      ONHOLD: "ONHOLD",
      BREAK: "Break",
      IN_REVIEW: "IN_REVIEW",
      Completed: "Completed",
      APPROVED: "Approved",
      ASSIGNED: "ASSIGNED",
    };
    return labels[status] || status;
  };

  // Status styles mapping
  const getStatusBadge = (status) => {
    const statusStyles = {
      IN_PROGRESS: "bg-green-100 text-green-400 border-green-400",
      ONHOLD: "bg-yellow-100 text-yellow-700 border-yellow-700",
      BREAK: "bg-red-100 text-red-600 border-red-600",
      IN_REVIEW: "bg-orange-100 text-orange-600 border-orange-600",
      COMPLETE: "bg-green-100 text-green-800 border-green-800",
      APPROVED: "bg-purple-100 text-purple-600 border-purple-600",
      ASSIGNED: "bg-pink-100 text-pink-500 border-pink-500",
      RE_ASSIGNED: " bg-cyan-100 text-cyan-500 border-cyan-500",
    };
    return statusStyles[status] || "bg-gray-100 text-gray-500 border-gray-500";
  };

  const createdAt = new Date(tasks?.createdAt);
  const due_date = new Date(tasks?.due_date);
  const start_date = new Date(tasks?.start_date);
  const endDate = new Date(tasks?.endDate);

  useEffect(() => {
    fetchEstimationDetails();
  }, []);

  function handleClose() {
    setDisplay(false);
  }

  const formatMinutesToHoursAndMinutes = (totalMinutes) => {
    if (!totalMinutes) return "0h 0m";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
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

  async function handleStart() {
    const taskID = tasks?.id;
    try {
      const accept = await Service.startEstTask(taskID);
      setTasks((prev) => {
        return {
          ...prev,
          status: "IN_PROGRESS",
        };
      });
      localStorage.setItem("work_id", accept?.data?.id || workId);
      console.log("Accept Response: --------", accept);
      toast.success("Task Started");
      fetchEstimationDetails();
      fetchEstimation();
    } catch (error) {
      toast.error("Error in accepting task");
    }
  }

  const work_id = localStorage.getItem("work_id");
  console.log("Work ID: ", workdata);
  async function handlePause() {
    console.log("Pause Event: ", workId);
    const taskId = tasks?.id;
    const pauseTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const pauseTimes = JSON.parse(localStorage.getItem("pauseTimes")) || [];
    pauseTimes.push(pauseTime);
    localStorage.setItem("pauseTimes", JSON.stringify(pauseTimes));
    try {
      const pause = await Service.pauseEstTask(taskId, work_id);
      setTasks((prev) => {
        return {
          ...prev,
          status: "BREAK",
        };
      });
      toast.success("Task Paused");
      fetchEstimationDetails();
      fetchEstimation();
    } catch (error) {
      toast.error("Error in pausing task");
      console.log("Error in pausing task: ", error);
    }
  }

  async function handleResume() {
    const taskID = tasks?.id;
    const resumeTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const resumeTimes = JSON.parse(localStorage.getItem("resumeTimes")) || [];
    resumeTimes.push(resumeTime);
    localStorage.setItem("resumeTimes", JSON.stringify(resumeTimes));
    try {
      const resume = await Service.resumeEstTask(taskID, work_id);
      setTasks((prev) => {
        return {
          ...prev,
          status: "IN_PROGRESS",
        };
      });
      fetchEstimationDetails();
      fetchEstimation();
      toast.success("Task Resumed");
    } catch (error) {
      toast.error("Error in resuming task");
      console.log("Error in resuming task: ", error);
    }
  }

  async function handleEnd() {
    const taskID = tasks?.id;
    const end = new Date().toISOString();
    try {
      const endresponse = await Service.endEstTask(taskID, workId, end);
      if (endresponse?.status === "END") {
        localStorage.removeItem("work_id");
        fetchEstimationDetails();
        fetchEstimation();
        setDisplay(false);
        toast.success("Task Ended");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error in ending task");
    }
  }

  // For Comment Form
  const onSubmitComment = async (data) => {
    // console.log(data);
    try {
      const response = await Service.addEstComment(task, data);
      toast.success("Comment Added Successfully");
      await fetchEstimationDetails();
    } catch (error) {
      toast.error(error);
      console.error("Error in adding comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-screen overflow-x-auto mx-5 p-5 rounded-lg shadow-lg w-11/12">
        <div className="sticky top-0 z-10 flex items-center justify-between p-3 mb-4 bg-white border-b shadow-md">
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl text-teal-500 font-bold">
              <span className="font-bold">Task:</span> {task?.name}
            </div>
            <div className="mr-4 text-lg gap-5 flex items-center">
              <button
                className="px-5 py-2 text-white transition-colors duration-300 rounded-lg bg-teal-600 hover:bg-teal-700"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <div className="main-container overflow-y-auto">
          <div className="space-y-6">
            {/* Task Detail */}
            <div className="w-full p-6 rounded-lg shadow-xl bg-gradient-to-br from-teal-50 to-teal-100">
              <h2 className="mb-4 text-xl font-bold text-teal-800 border-b border-teal-200 pb-2">
                Task Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Project Name
                  </span>
                  <span className="mt-1 text-lg">
                    {tasks?.estimation?.projectName}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Duration
                  </span>
                  <span className="mt-1 text-lg">
                    {durToHour(tasks?.duration)}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Assigned Date
                  </span>
                  <span className="mt-1 text-lg">
                    {createdAt?.toDateString()}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Due Date
                  </span>
                  <span className="mt-1 text-lg">
                    {endDate?.toDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Total Work Hours:
                  </span>
                  <span className="ml-2 px-3 py-1 bg-teal-100 text-teal-800 border-2 border-teal-800 rounded-full">
                    {formatMinutesToHoursAndMinutes(workHours?.duration)}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex gap-3 items-center">
                    <span className="text-sm font-medium text-gray-500">
                      Status
                    </span>
                    {tasks?.status && (
                      <span
                        className={`text-sm text-center font-medium px-3 py-1 rounded-full border mr-4 ${getStatusBadge(tasks.status)}`}
                      >
                        {getStatusLabel(tasks.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col mt-6">
                <span className="text-sm font-medium text-gray-500">
                  Task Actions
                </span>
                <div className="flex flex-wrap gap-3 mt-2">
                  {tasks?.status === "ASSIGNED" ||
                  tasks?.status === "ONHOLD" ? (
                    <button
                      className="flex items-center justify-center cursor-pointer px-4 py-2 font-semibold text-white transition-colors duration-300 bg-green-500 rounded-md hover:bg-green-600"
                      onClick={handleStart}
                    >
                      Start Task
                    </button>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {/* Show Pause button if the task is running */}
                      {tasks?.status === "IN_PROGRESS" && (
                        <button
                          className="flex text-sm items-center justify-center cursor-pointer gap-1 px-4 py-2 font-medium text-white transition-colors duration-300 bg-yellow-800 rounded-md hover:bg-yellow-600"
                          value={workdata?.id}
                          onClick={handlePause}
                        >
                          <div>
                            <Pause />
                          </div>
                          <div>Pause</div>
                        </button>
                      )}

                      {/* Show Resume button if the task is paused */}
                      {tasks?.status === "BREAK" ||
                      tasks?.status === "RE_ASSIGNED" ? (
                        <button
                          className="flex items-center justify-center cursor-pointer gap-1 px-4 py-2 font-medium text-sm text-white transition-colors duration-300 bg-green-500 rounded-md hover:bg-green-600"
                          value={workdata?.id}
                          onClick={handleResume}
                        >
                          <div>
                            <Play />
                          </div>
                          <div>Resume</div>
                        </button>
                      ) : null}

                      {/* Always show End button */}
                      {tasks?.status === "IN_PROGRESS" && (
                        <div
                          className="flex items-center cursor-pointer justify-center gap-1 px-4 py-2 font-medium text-sm text-white transition-colors duration-300 bg-red-500 rounded-md hover:bg-red-600"
                          value={workdata?.id}
                          onClick={handleEnd}
                        >
                          <div>
                            <Square />
                          </div>
                          <div>End Task</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Comments Section */}
        <div className="w-full p-6 mt-6 rounded-lg shadow-xl bg-gradient-to-br from-gray-50 to-gray-100">
          <h2 className="mb-4 text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
            Comments
          </h2>

          <form onSubmit={handleSubmit(onSubmitComment)} className="mb-6">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="mb-3">
                <label
                  htmlFor="comment"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Add Comment
                </label>
                <textarea
                  id="comment"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows="3"
                  placeholder="Type a message (Shift + Enter for newline)"
                  {...register("comment")}
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-white transition-colors duration-300 bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Post Comment
              </button>
            </div>
          </form>

          {tasks?.comment?.length > 0 ? (
            <div className="space-y-4">
              {tasks?.comment?.map((comment, index) => (
                <div
                  className="p-4 transition-shadow duration-300 bg-white rounded-lg shadow-sm hover:shadow-md"
                  key={index}
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 mr-3 text-white bg-teal-600 rounded-full">
                      {staffData
                        ?.find((staff) => staff?.id === comment?.user_id)
                        ?.f_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {staffData?.find(
                          (staff) => staff?.id === comment?.user_id,
                        )?.f_name || "Unknown User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(comment?.created_on).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="pl-12 text-gray-700 whitespace-pre-wrap break-words">
                    {comment?.data}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center bg-white rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 mb-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3 className="mb-1 text-lg font-medium text-gray-900">
                No comments yet
              </h3>
              <p className="text-gray-500">
                Be the first to add a comment to this task.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetEstimation;
