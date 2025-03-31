/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import { Button, Header, SelectedTask } from "../../../index";
import { useDispatch, useSelector } from "react-redux";
import { showTask, showTaskByID } from "../../../../store/taskSlice";

const AllTask = () => {
  const userType = sessionStorage.getItem("userType");
  const tasks = useSelector((state) => state?.taskData?.taskData);
  const projectData = useSelector((state) => state?.projectData?.projectData);
  const userData = useSelector((state) => state?.userData?.staffData);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [inReviewPercentage, setInReviewPercentage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskFilter, setTaskFilter] = useState([]);
  const [projectFilter, setProjectFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState({ key: "name", order: "asc" });
  const [filters, setFilters] = useState({
    fabricator: "",
    status: "",
  });


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 50;

  const departmentTask = tasks?.flatMap((task) => task?.tasks) || [];

  useEffect(() => {
    setTaskFilter(userType === "department-manager" ? departmentTask : tasks);
  }, [tasks, userType]);
  const uniqueProject = [
    ...new Set(
      (userType === "department-manager" ? departmentTask : tasks)?.map(
        (project) => project?.project?.name,
      ),
    ),
  ];
  // console.log("UNIQUE PROJECTS:", uniqueProject);
  const filterAndSortData = () => {
    let filtered = (
      userType === "department-manager" ? departmentTask : tasks
    )?.filter((task) => {
      const searchMatch =
        task?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userData
          ?.find((user) => user?.id === task?.user_id)
          ?.f_name?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        userData
          ?.find((user) => user?.id === task?.user_id)
          ?.m_name?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        userData
          ?.find((user) => user?.id === task?.user_id)
          ?.l_name?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const filterMatch =
        (!filters?.project || task?.project?.name === filters?.project) &&
        (!filters?.status || task?.status === filters?.status);

      return searchMatch && filterMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aKey = a[sortOrder?.key];
      let bKey = b[sortOrder?.key];

      // Handle fabricator sorting separately
      if (sortOrder?.key === "project") {
        aKey = a.project?.name || "";
        bKey = b.project?.name || "";
      }

      // Convert only if it's a string
      const aValue =
        typeof aKey === "string" ? aKey.toLowerCase() : (aKey ?? "");
      const bValue =
        typeof bKey === "string" ? bKey.toLowerCase() : (bKey ?? "");

      if (sortOrder?.order === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
    setTaskFilter(filtered);
  };

    // Pagination logic
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = taskFilter.slice(indexOfFirstTask, indexOfLastTask);
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    const totalPages = Math.ceil(taskFilter.length / tasksPerPage);
  

  // Search handler
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Sort handler
  const handleSort = (key) => {
    const order =
      sortOrder.key === key && sortOrder.order === "asc" ? "desc" : "asc";
    setSortOrder({ key, order });
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
      const projectTasks = (
        userType === "department-manager" ? departmentTask : tasks
      ).filter((task) => task?.project?.name === projectFilter);
      const completedTasks = projectTasks.filter(
        (task) => task?.status === "COMPLETE",
      ).length;
      const totalTasks = projectTasks.length;

      const inReviewTasks = projectTasks.filter(
        (task) => task?.status === "IN_REVIEW",
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
    }

    filterAndSortData();
  }, [tasks, searchQuery, filters, sortOrder]);

  const getCompletionBarColor = (status) => {
    switch (status) {
      case "COMPLETE":
        return "bg-green-500"; // Green for completed
      case "IN_REVIEW":
        return "bg-yellow-500"; // Yellow for IN_REVIEW
      default:
        return "bg-green-500"; // Default or no status
    }
  };
  const getInReviewBarColor = (status) => {
    switch (status) {
      case "COMPLETE":
        return "bg-green-500"; // Green for completed
      case "IN_REVIEW":
        return "bg-yellow-500"; // Yellow for IN_REVIEW
      default:
        return "bg-yellow-500"; // Default or no status
    }
  };

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
    state?.taskData?.taskData?.map((task) => task.id),
  );

  const reloadWnidow = () => {
    window.location.reload();
  };

  return (
    <div className="h-[65vh] overflow-y-auto">
      <div className="table-container w-full rounded-lg">
        <div className="w-full rounded-lg shadow-xl table-container">
          <div className="mx-5 my-3">
            <div className=" py-5 bg-white h-full my-5 overflow-auto rounded-lg">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search by Task name & User Name"
                  className="border p-2 rounded w-full mb-4"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Fabricator Filter */}
                  <select
                    name="project"
                    value={filters.project}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                  >
                    <option value="">All Projects</option>
                    {uniqueProject?.map((project) => (
                      <option key={project} value={project}>
                        {project}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                  >
                    <option value="">All Status</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="ONHOLD">ON HOLD</option>
                    <option value="BREAK">BREAK</option>
                    <option value="IN_REVIEW">IN REVIEW</option>
                    <option value="COMPLETE">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <Button onClick={reloadWnidow}>Refresh</Button>
                </div>
              </div>
              <div className=" bg-white rounded-lg">

                <table className="md:w-full w-[90vw] border-collapse text-center md:text-lg text-xs rounded-xl">
                  <thead>
                    <tr className="bg-teal-200/70">
                      {[
                        "s.no",
                        "project",
                        "task name",
                        "Assigned user",
                        "status",
                        "priority",
                        "due_date",
                        "Allocated Hours",
                        "Hours taken",
                      ].map((key) => (
                        <th
                          key={key}
                          className="px-2 py-1 cursor-pointer"
                          onClick={() => handleSort(key)}
                        >
                          {key.charAt(0)?.toUpperCase() + key.slice(1)}
                          {sortOrder.key === key &&
                            (sortOrder.order === "asc" ? "" : "")}
                        </th>
                      ))}
                      <th className="px-2 py-1">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {currentTasks?.length === 0 ? (
                      <tr className="bg-white">
                        <td colSpan="7" className="text-center">
                          No Task Found
                        </td>
                      </tr>
                    ) : (
                      currentTasks?.map((task, index) => {
                        const allocatedHours = task?.duration
                          ? parseInt(task?.duration.split(":")[0], 10)
                          : 0;
                        const takenHours =
                          task?.workingHourTask?.find((rec) =>
                            taskIds.includes(rec.task_id),
                          )?.duration / 60 || 0;
                        const isOverAllocated = takenHours > allocatedHours;

                        return (
                          <tr
                            key={task.id}
                            className={`${isOverAllocated
                                ? "bg-red-200"
                                : index % 2 === 0
                                  ? "bg-white"
                                  : "bg-gray-200/50"
                              }`}
                          >
                            <td className="px-1 py-2 border">{indexOfFirstTask + index + 1}</td>
                            <td className="px-1 py-2 border">
                              {
                                projectData?.find(
                                  (project) => project?.id === task?.project_id,
                                )?.name
                              }
                            </td>
                            <td className="px-1 py-2 border">{task?.name}</td>

                            <td className="px-1 py-2 border">
                              {userData?.find(
                                (user) => user?.id === task?.user_id,
                              )
                                ? `${userData.find((user) => user.id === task.user_id)?.f_name || ""} ${userData.find((user) => user.id === task.user_id)?.m_name || ""} ${userData.find((user) => user.id === task.user_id)?.l_name || ""}`.trim()
                                : ""}
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
                              {new Date(task?.due_date).toDateString()}
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
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
               {/* Pagination Controls */}
               <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 mx-1 border rounded ${
                      currentPage === index + 1
                        ? "bg-teal-500 text-white"
                        : "bg-white text-teal-500"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
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
