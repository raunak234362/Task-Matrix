/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import { Button, Header, SelectedTask } from "../../../index";
import { useDispatch, useSelector } from "react-redux";
import { showTask, showTaskByID } from "../../../../store/taskSlice";

const AllTask = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state?.taskData?.taskData);
  const currentUserId = useSelector((state) => state?.userData?.userData?.id);
  const isSuperUser = useSelector(
    (state) => state?.userData?.userData?.is_superuser,
  );
  const projectData = useSelector((state) => state?.projectData?.projectData);
  const userData = useSelector((state) => state?.userData?.staffData);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectCompletion, setProjectCompletion] = useState({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [inReviewPercentage, setInReviewPercentage] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const [projectFilter, setProjectFilter] = useState("");
  const [toolFilter, setToolsFilter] = useState();
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });

  const calculateCompletionPercentage = () => {
    const completionMap = {};

    tasks.forEach((task) => {
      if (!completionMap[task.project.name]) {
        completionMap[task.project.name] = {
          completed: 0,
          inReview: 0,
          total: 0,
        };
      }
      completionMap[task.project.name].total += 1;

      if (task.status === "COMPLETE") {
        completionMap[task.project.name].completed += 1;
      } else if (task.status === "IN-REVIEW") {
        completionMap[task.project.name].inReview += 1;
      }
    });

    // Calculate percentages
    Object.keys(completionMap).forEach((projectName) => {
      const { completed, inReview, total } = completionMap[projectName];
      completionMap[projectName].completionPercentage =
        ((completed + inReview) / total) * 100;
    });

    setProjectCompletion(completionMap);
  };

  const calculateTotalDuration = () => {
    if (!tasks || tasks.length === 0) {
      setTotalDuration({ hours: 0, minutes: 0 });
      return;
    }

    const totalMinutes = tasks.reduce((sum, task) => {
      const taskDuration = task?.project?.duration || 0;
      return sum + taskDuration;
    }, 0);

    const hours = Math.floor(totalMinutes / 60); // Calculate total hours
    const minutes = totalMinutes % 60; // Calculate remaining minutes

    setTotalDuration({ hours, minutes }); // Store as an object
  };

  function formatMinutesToHours(totalMinutes) {
    console.log("totalMinutes: ", totalMinutes);
    if (!totalMinutes && totalMinutes !== 0) return "N/A";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  }

  useEffect(() => {
    if (projectFilter) {
      const projectTasks = tasks.filter(
        (task) => task.project.name === projectFilter,
      );
      const completedTasks = projectTasks.filter(
        (task) => task.status === "COMPLETE",
      ).length;
      const totalTasks = projectTasks.length;

      const inReviewTasks = projectTasks.filter(
        (task) => task.status === "IN-REVIEW",
      ).length;

      const inReviewPercentage =
        totalTasks > 0 ? (inReviewTasks / totalTasks) * 100 : 0;
      // console.log("In Review Percentage:", inReviewPercentage);
      setInReviewPercentage(inReviewPercentage);
      const percentage =
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      setCompletionPercentage(percentage);

      const totalMinutes = projectTasks.reduce((sum, task) => {
        const taskDuration = task?.project?.duration || 0;
        return sum + taskDuration;
      }, 0);

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setTotalDuration({ hours, minutes });
    }

    calculateTotalDuration();
  }, [projectFilter, tasks]);

  const getCompletionBarColor = (status) => {
    switch (status) {
      case "COMPLETE":
        return "bg-green-500"; // Green for completed
      case "IN-REVIEW":
        return "bg-yellow-500"; // Yellow for in-review
      default:
        return "bg-green-500"; // Default or no status
    }
  };
  const getInReviewBarColor = (status) => {
    switch (status) {
      case "COMPLETE":
        return "bg-green-500"; // Green for completed
      case "IN-REVIEW":
        return "bg-yellow-500"; // Yellow for in-review
      default:
        return "bg-yellow-500"; // Default or no status
    }
  };

  // console.log(tasks);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleProjectFilter = (e) => {
    setProjectFilter(e.target.value);
  };

  const handleToolsFilter = (e) => {
    setToolsFilter(e.target.value);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig?.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredTasks = sortedTasks.filter((task) => {
    if (task.user_id === currentUserId) {
      return (
        (task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.user?.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "" || task.status === statusFilter) &&
        (projectFilter === "" || task.project?.name === projectFilter) &&
        (toolFilter === "" || task.project?.tool === toolFilter)
      );
    } else if (isSuperUser) {
      return (
        (task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.user?.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "" || task.status === statusFilter) &&
        (projectFilter === "" || task.project?.name === projectFilter) &&
        (toolFilter === "" || task.project?.tool === toolFilter)
      );
    }
  });
  const uniqueProject = [
    ...new Set(tasks?.map((project) => project?.project?.name)),
  ];

  const handleViewClick = async (taskId) => {
    try {
      const task = await Service.getTaskById(taskId);
      // console.log("Task Details:", task);
      // dispatch(showTaskByID(task));
      setSelectedTask(task);
      setTaskID(taskId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskID(null);
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

  const taskIds = useSelector((state) =>
    state?.taskData?.taskData.map((task) => task.id),
  );
  console.log("TASKS:", tasks);

  return (
    <div>
      <div className="table-container h-[80vh] w-full rounded-lg">
        <div className="w-full rounded-lg shadow-xl table-container">
          <div className="mx-5 my-3">
            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <input
                type="text"
                placeholder="Search by Task name & User name..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border rounded-md md:w-1/4"
              />
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full px-4 py-2 border rounded-md md:w-1/4"
              >
                <option value="">All Status</option>
                <option value="ASSINGED">ASSIGNED</option>
                <option value="IN-PROGRESS">IN PROGRESS</option>
                <option value="ON-HOLD">ON-HOLD</option>
                <option value="sBREAK">BREAK</option>
                <option value="IN-REVIEW">IN REVIEW</option>
                <option value="COMPLETE">COMPLETED</option>
              </select>
              <select
                value={projectFilter}
                onChange={handleProjectFilter}
                className="w-full px-4 py-2 border rounded-md md:w-1/4"
              >
                <option value="">All Projects</option>
                {uniqueProject?.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              <select
                value={toolFilter}
                onChange={handleToolsFilter}
                className="w-full px-4 py-2 border rounded-md md:w-1/4"
              >
                <option value="">All Tools</option>
                <option value="TEKLA">Tekla</option>
                <option value="SDS-2">SDS-2</option>
              </select>
            </div>

            {projectFilter && (
              <div className="mt-4">
                <div className="mb-2">
                  Project Completion %: {completionPercentage.toFixed(2)}%
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div
                    className={`h-4 rounded-full ${getCompletionBarColor(tasks?.project?.status)}`} // Use the getCompletionBarColor function
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="mb-2">
                  Project InReview %: {inReviewPercentage.toFixed(2)}%
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div
                    className={`h-4 rounded-full ${getInReviewBarColor(tasks?.project?.status)}`} // Use the getCompletionBarColor function
                    style={{ width: `${inReviewPercentage}%` }}
                  />
                </div>
                {/* <div className="mt-2 text-lg font-semibold">
                  Total Project Duration: {totalDuration.hours} hours{" "}
                  {totalDuration.minutes} minutes
                </div> */}
              </div>
            )}
            <div className=" py-5 bg-white h-[58vh] overflow-auto rounded-lg">
              <table className="md:w-full w-[90vw] border-collapse text-center md:text-lg text-xs rounded-xl">
                <thead>
                  <tr className="bg-teal-200/70">
                    <th
                      className="px-2 py-1 text-left cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      S.no{" "}
                      {sortConfig.key === "id" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th
                      className="px-2 py-1 text-left cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Project Name{" "}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th
                      className="px-2 py-1 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Task Name{" "}
                      {sortConfig.key === "name " &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>

                    <th className="px-2 py-1 cursor-default">Assigned User </th>
                    <th
                      className="px-2 py-1 cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status{" "}
                      {sortConfig.key === "status" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th
                      className="px-2 py-1 cursor-pointer"
                      onClick={() => handleSort("priority")}
                    >
                      Priority{" "}
                      {sortConfig.key === "priority" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>

                    <th
                      className="px-2 py-1 cursor-pointer"
                      onClick={() => handleSort("due_date")}
                    >
                      Task Due Date{" "}
                      {sortConfig.key === "due_date" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th
                      className="px-2 py-1 cursor-pointer"
                      onClick={() => handleSort("duration")}
                    >
                      Allocated Hours{" "}
                      {sortConfig.key === "duration" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th
                      className="px-2 py-1 cursor-pointer"
                      onClick={() => handleSort("duration")}
                    >
                      Hours Taken{" "}
                      {sortConfig.key === "duration" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th className="px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr className="bg-white">
                      <td colSpan="8" className="text-center">
                        No Task Found
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task, index) => (
                      <tr
                        key={task.id}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-gray-200/50"
                        }
                      >
                        <td className="px-1 py-2 border">{index + 1}</td>
                        <td className="px-1 py-2 border">
                          {
                            projectData?.find(
                              (project) => project?.id === task?.project_id,
                            )?.name
                          }
                        </td>
                        <td className="px-1 py-2 border">{task?.name}</td>

                        <td className="px-1 py-2 border">
                          {
                            userData?.find((user) => user?.id === task?.user_id)
                              ?.f_name
                          }
                        </td>
                        <td className="px-1 py-2 border">{task?.status}</td>
                        <td className={`border px-1 py-2`}>
                          <span
                            className={`text-sm text-center font-semibold px-3 py-0.5 mx-2 rounded-full border ${color(
                              task?.priority,
                            )}`}
                          >
                            {setPriorityValue(task?.priority)}
                          </span>
                        </td>
                        <td className="px-1 py-2 border">
                          {new Date(task?.start_date).toDateString()}
                        </td>
                        <td className="px-1 py-2 border">
                          {durToHour(task?.duration)}
                        </td>
                        <td className="px-1 py-2 border">
                          {formatMinutesToHours(
                            task?.workingHourTask?.find((rec) =>
                              taskIds.includes(rec.task_id),
                            )?.duration,
                          )}
                        </td>

                        <td className="flex justify-center px-1 py-2 border">
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
      </div>
      {selectedTask && (
        <SelectedTask
          taskDetail={selectedTask}
          taskID={taskID}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          setTasks={tasks}
        />
      )}
    </div>
  );
};

export default AllTask;
