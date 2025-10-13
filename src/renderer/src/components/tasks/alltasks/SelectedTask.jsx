/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { EditTask } from "../../index";
import Service from "../../../api/configAPI";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, updateTask } from "../../../store/taskSlice";
import { BASE_URL } from "../../../config/constant";
import { toast } from "react-toastify";
import {
  Clock,
  Calendar,
  User,
  FileText,
  Tag,
  Flag,
  CheckCircle,
  MessagesSquare,
  Pencil,
  Trash2,
  X,
  Paperclip,
  ExternalLink,
} from "lucide-react";

const SelectedTask = ({ taskDetail, taskId, isOpen, onClose, setTasks }) => {
  console.log("Task Detail: ", taskId);
  const dispatch = useDispatch();
  const taskData = useSelector((state) =>
    state?.taskData?.taskData.filter((task) => task.id === taskId),
  );
  const task = taskData[0];
  console.log("Task Data: ", taskDetail);
  const staffData = useSelector((state) => state?.userData?.staffData);
  const projectData = useSelector((state) =>
    state?.projectData?.projectData.find(
      (project) => project?.id === task?.project_id,
    ),
  );
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

  const taskIds = useSelector((state) =>
    state?.taskData?.taskData?.map((task) => task.id),
  );

  if (!isOpen) return null;

  const handleEditClick = () => {
    setIsModalOpen(true);
    setSelectedTask(taskData);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    // window.location.reload();
    setSelectedTask(null);
  };

  const deleteTaskID = async () => {
    try {
      const response = await Service.deleteTask(taskId);
      dispatch(deleteTask(taskId));
      onClose();
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Error in deleting task");
    }
  };

  const durToHour = (params) => {
    if (!params) return "N/A";

    const parts = params.split(" ");
    let days = 0;
    let timePart = params;

    if (parts.length === 2) {
      days = Number.parseInt(parts[0], 10);
      timePart = parts[1];
    }

    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    const totalHours = days * 24 + hours;
    return `${totalHours}h ${minutes}m`;
  };
  function formatMinutesToHours(totalMinutes) {
    console.log("totalMinutes: ", totalMinutes);
    if (!totalMinutes && totalMinutes !== 0) return "N/A";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  }
  const addComment = async (commentData) => {
    try {
      const comment = await Service.addComment(task?.id, commentData);
      console.log("Comment: ", comment.data);
      dispatch(
        updateTask({
          ...task,
          taskcomment: [...task.taskcomment, comment.data],
        }),
      );
      toast.success("Comment Added successfully");
    } catch (error) {
      toast.error(error);
      console.error("Error in adding comment: ", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 0:
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          border: "border-emerald-300",
          label: "LOW",
        };
      case 1:
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          border: "border-amber-300",
          label: "MEDIUM",
        };
      case 2:
        return {
          bg: "bg-violet-100",
          text: "text-violet-800",
          border: "border-violet-300",
          label: "HIGH",
        };
      case 3:
        return {
          bg: "bg-rose-100",
          text: "text-rose-800",
          border: "border-rose-300",
          label: "CRITICAL",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-300",
          label: "UNKNOWN",
        };
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "blocked":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const start_date = new Date(task?.start_date);
  const due_date = new Date(task?.due_date);
  const priorityInfo = getPriorityColor(task?.priority);

  const getAssignedUserName = (userId) => {
    const staff = staffData?.find((staff) => staff?.id === userId);
    return staff
      ? `${staff?.f_name || ""} ${staff?.m_name || ""} ${staff?.l_name || ""}`.trim()
      : "Unassigned";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-11/12 max-w-6xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-100">
              <FileText className="w-6 h-6 text-cyan-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{task?.name}</h2>
            <div
              className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(task?.status)}`}
            >
              {task?.status}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-2 border-b">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "details"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Task Details
          </button>
          <button
            onClick={() => setActiveTab("project")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "project"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Project Info
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "comments"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Comments
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {/* Task Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Description
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {task?.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Task Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Assigned To
                        </p>
                        <p className="text-gray-800">
                          {getAssignedUserName(task?.user_id)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Timeline
                        </p>
                        <p className="text-gray-800">
                          {start_date?.toLocaleDateString()} -{" "}
                          {due_date?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          MileStone:
                        </p>
                        <p className="text-gray-800">
                          {taskDetail?.mileStone?.subject}
                          
                        </p>
                      </div>
                    </div>
                    {/* <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          MileStone
                        </p>
                        <p className="text-gray-800">
                          {task?.mileStone?.subject}
                        </p>
                      </div>
                    </div> */}

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Duration
                        </p>
                        <p className="text-gray-800">
                          {durToHour(task?.duration)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Work Hours
                        </p>
                        <p className="text-gray-800">
                          {formatMinutesToHours(
                            task?.workingHourTask?.find((rec) =>
                              taskIds.includes(rec.task_id),
                            )?.duration,
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Stage
                        </p>
                        <p className="text-gray-800">{task?.Stage}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Flag className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Priority
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.bg} ${priorityInfo.text} border ${priorityInfo.border}`}
                        >
                          {priorityInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Summary */}
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Project Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Project Name
                        </p>
                        <p className="text-gray-800">{projectData?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Project Manager
                        </p>
                        <p className="text-gray-800">
                          {projectData?.manager?.f_name}
                        </p>
                      </div>
                    </div>

                    {/* <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Stage</p>
                        <p className="text-gray-800">{projectData?.stage}</p>
                      </div>
                    </div> */}

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Status
                        </p>
                        <p className="text-gray-800">{projectData?.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {userType !== "user" && userType !== "system-admin" && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleEditClick}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-cyan-600 rounded-lg hover:bg-cyan-700"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Task
                  </button>
                  {userType !== "user" &&
                    userType !== "system-admin" &&
                    userType !== "project-manager" &&
                    (!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Task
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          Are you sure?
                        </span>
                        <button
                          onClick={deleteTaskID}
                          className="flex items-center px-3 py-2 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Project Info Tab */}
          {activeTab === "project" && (
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Project Details
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {projectData?.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Project Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Project Name
                        </p>
                        <p className="text-gray-800">{projectData?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Project Manager
                        </p>
                        <p className="text-gray-800">
                          {projectData?.manager?.f_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Stage
                        </p>
                        <p className="text-gray-800">{projectData?.stage}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Status
                        </p>
                        <p className="text-gray-800">{projectData?.status}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Files */}
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Project Files
                  </h3>

                  {projectData?.files?.length > 0 ? (
                    <ul className="space-y-2">
                      {projectData?.files?.map((file, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Paperclip className="w-5 h-5 text-gray-500" />
                          <a
                            href={`${BASE_URL}/project/projects/viewfile/${projectData?.id}/${file.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-cyan-600 hover:text-cyan-800 hover:underline"
                          >
                            {file.originalName || `File ${index + 1}`}
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No files attached to this project.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="space-y-6">
              {/* Add Comment Form */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Add Comment
                </h3>
                <form onSubmit={handleSubmit(addComment)}>
                  <div className="mb-3">
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      rows="3"
                      placeholder="Write your comment here..."
                      {...register("comment", { required: true })}
                    ></textarea>
                    {errors.comment && (
                      <p className="mt-1 text-sm text-red-600">
                        Comment is required
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-cyan-600 rounded-lg hover:bg-cyan-700"
                  >
                    <MessagesSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </button>
                </form>
              </div>

              {/* Comments List */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Comments
                </h3>

                {task?.taskcomment?.length > 0 ? (
                  <div className="space-y-4">
                    {task?.taskcomment?.map((comment, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-cyan-600">
                              {staffData
                                ?.find(
                                  (staff) => staff?.id === comment?.user_id,
                                )
                                ?.f_name?.charAt(0) || "U"}
                            </div>
                            <span className="font-medium text-gray-800">
                              {staffData?.find(
                                (staff) => staff?.id === comment?.user_id,
                              )?.f_name || "Unknown User"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(comment?.created_on).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <div className="pl-10 text-gray-700 whitespace-pre-line">
                          {comment?.data}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl">
                    <MessagesSquare className="w-12 h-12 mb-3 text-gray-400" />
                    <h4 className="text-lg font-medium text-gray-800">
                      No comments yet
                    </h4>
                    <p className="text-gray-500">
                      Be the first to add a comment to this task.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
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
