"use client";

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState, useCallback, useEffect } from "react";
import TimeLine from "./TimeLine";
import Overview from "./Overview";
import Team from "./Team";
import DateFilter from "./DateFilter";
import { CustomSelect, GetProject } from "../../index";

const ProjectStatus = ({ projectId, onClose }) => {
  const userType = sessionStorage.getItem("userType");
  const [selectedView, setSelectedView] = useState("all");
  const [hoveredTask, setHoveredTask] = useState(null);
  const [expandedTypes, setExpandedTypes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleTaskCount, setVisibleTaskCount] = useState(20);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterUserId, setFilterUserId] = useState("all");
  const [filteredData, setFilteredData] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    type: "all", // all, week, month, year, range
    month: new Date().getMonth(), // 0-11
    year: new Date().getFullYear(),
    startMonth: new Date().getMonth(), // For range
    endMonth: new Date().getMonth() + 2, // For range
    weekStart: null, // For week filter
    weekEnd: null, // For week filter
  });

  const projectData = useSelector((state) =>
    state?.projectData.projectData.find((project) => project.id === projectId)
  );
  const userData = useSelector((state) => state.userData.staffData);

  const taskData = useSelector((state) => state.taskData.taskData);

  const filteredTaskData = useMemo(() => {
    if (userType === "department-manager") {
      const departmentProjects = taskData.filter(
        (task) => task.id === projectId
      );
      const departmentTasks = departmentProjects?.map((project) => {
        return project.tasks.map((task) => ({ ...task, projectId: project.id }));
      });
      console.log("Department Tasks", departmentTasks);
      return departmentTasks && departmentTasks.length > 0 ? departmentTasks : projectTasks;
    }
    return taskData;
  }, [taskData, userType, projectId]);

  const projectTasks = useMemo(() => {
    if (userType === "department-manager") {
      return filteredTaskData?.flat() || [];
    }
    return taskData.filter((task) => task.project_id === projectId);
  }, [taskData, projectId, userType, filteredTaskData]);

  console.log("Project Tasks", filteredTaskData);

  const parseDuration = (duration) => {
    if (!duration || typeof duration !== "string") return 0;
    const [h, m, s] = duration.split(":").map(Number);
    return h + m / 60 + s / 3600;
  };






  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const userContributions = userData
    .map((user) => {
      const userTasks = projectTasks?.filter(
        (task) => task.user?.id === user.id
      );
      const totalWorkingHourTasks = userTasks.reduce((sum, task) => {
        const taskDuration =
          task.workingHourTask?.reduce(
            (innerSum, innerTask) => innerSum + (innerTask.duration || 0),
            0
          ) || 0;
        return sum + taskDuration;
      }, 0);
      return {
        name: user.f_name,
        taskCount: userTasks.length,
        totalAssignedHours: userTasks.reduce(
          (sum, task) => sum + parseDuration(task.duration),
          0
        ),
        totalWorkedHours: (totalWorkingHourTasks / 60).toFixed(2),
      };
    })
    .filter((user) => user.taskCount > 0)
    .sort((a, b) => b.taskCount - a.taskCount);

  // Prepare data for Gantt chart
  const ganttData = useMemo(() => {
    return projectTasks.map((task) => {
      const startDate = new Date(task.start_date);
      const endDate = new Date(task.due_date);
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const type = task.name.split(" ")[0]; // Assuming first word is the type

      // Extract assigned and taken hours
      const assignedHours = parseDuration(task.duration);
      const takenHours =
        task?.workingHourTask?.reduce(
          (sum, innerTask) => sum + innerTask.duration,
          0
        ) || 0;

      // Calculate progress percentage
      let progress = assignedHours
        ? Math.min((takenHours / assignedHours) * 100, 100)
        : 0;

      // Override progress based on status
      if (task.status === "IN_REVIEW") {
        progress = 80;
      } else if (task.status === "COMPLETE") {
        progress = 100;
      }
      // Ensure progress does not exceed 80% when in progress or break
      if (
        (task.status === "IN_PROGRESS" || task.status === "BREAK") &&
        progress > 80
      ) {
        progress = 80;
      }

      return {
        id: task.id,
        name: task.name,
        username:
          `${task.user?.f_name || ""} ${task.user?.l_name || ""}`.trim() ||
          "Unassigned",
        type,
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        duration,
        progress: Math.round(progress), // Ensure it's rounded
        status: task.status,
      };
    });
  }, [projectTasks]);

  // Apply date filtering
  const applyDateFilter = useCallback(
    (data) => {
      if (dateFilter.type === "all") {
        return data;
      }

      return data.filter((task) => {
        const taskStartDate = task.startDate;
        const taskEndDate = task.endDate;

        if (
          dateFilter.type === "week" &&
          dateFilter.weekStart &&
          dateFilter.weekEnd
        ) {
          return (
            (taskStartDate >= dateFilter.weekStart &&
              taskStartDate <= dateFilter.weekEnd) ||
            (taskEndDate >= dateFilter.weekStart &&
              taskEndDate <= dateFilter.weekEnd) ||
            (taskStartDate <= dateFilter.weekStart &&
              taskEndDate >= dateFilter.weekEnd)
          );
        }

        if (dateFilter.type === "month") {
          const filterStartDate = new Date(
            dateFilter.year,
            dateFilter.month,
            1
          ).getTime();
          const filterEndDate = new Date(
            dateFilter.year,
            dateFilter.month + 1,
            0
          ).getTime();

          return (
            (taskStartDate >= filterStartDate &&
              taskStartDate <= filterEndDate) ||
            (taskEndDate >= filterStartDate && taskEndDate <= filterEndDate) ||
            (taskStartDate <= filterStartDate && taskEndDate >= filterEndDate)
          );
        }

        if (dateFilter.type === "year") {
          const filterStartDate = new Date(dateFilter.year, 0, 1).getTime();
          const filterEndDate = new Date(dateFilter.year, 11, 31).getTime();

          return (
            (taskStartDate >= filterStartDate &&
              taskStartDate <= filterEndDate) ||
            (taskEndDate >= filterStartDate && taskEndDate <= filterEndDate) ||
            (taskStartDate <= filterStartDate && taskEndDate >= filterEndDate)
          );
        }

        if (dateFilter.type === "range") {
          const filterStartDate = new Date(
            dateFilter.year,
            dateFilter.startMonth,
            1
          ).getTime();
          const filterEndDate = new Date(
            dateFilter.year,
            dateFilter.endMonth + 1,
            0
          ).getTime();

          return (
            (taskStartDate >= filterStartDate &&
              taskStartDate <= filterEndDate) ||
            (taskEndDate >= filterStartDate && taskEndDate <= filterEndDate) ||
            (taskStartDate <= filterStartDate && taskEndDate >= filterEndDate)
          );
        }

        return true;
      });
    },
    [dateFilter]
  );

  // Filter tasks based on search, status, type, and date
  const filteredGanttData = useMemo(() => {
    let filtered = [...ganttData];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(lowerSearchTerm) ||
          task.username.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((task) => task.type === filterType);
    }

    // Apply user filter
    if (filterUserId !== "all") {
      filtered = filtered.filter((task) => {
        const taskUser = projectTasks.find((t) => t.id === task.id)?.user;
        return taskUser && taskUser.id === filterUserId;
      });
    }

    // Apply date filter
    filtered = applyDateFilter(filtered);

    // Update filtered data for summary
    setFilteredData({
      tasks: filtered,
      workingHourUser: filtered.flatMap((task) => {
        const originalTask = projectTasks.find((t) => t.id === task.id);
        return originalTask?.workingHourTask || [];
      }),
    });

    return filtered;
  }, [
    ganttData,
    searchTerm,
    filterStatus,
    filterType,
    filterUserId,
    applyDateFilter,
    projectTasks,
  ]);

  // Group filtered tasks by type
  const filteredGroupedTasks = useMemo(() => {
    return filteredGanttData.reduce((acc, task) => {
      if (!acc[task.type]) acc[task.type] = [];
      acc[task.type].push(task);
      return acc;
    }, {});
  }, [filteredGanttData]);

  // Initialize expandedTypes state when task types change
  useEffect(() => {
    const types = Object.keys(filteredGroupedTasks);
    const initialExpandedState = {};
    let hasChanged = false;
    types.forEach((type) => {
      const existing = expandedTypes[type];
      const newVal = existing !== undefined ? existing : true;
      if (initialExpandedState[type] !== newVal) hasChanged = true;
      initialExpandedState[type] = newVal;
    });
    if (hasChanged) setExpandedTypes(initialExpandedState);
  }, [filteredGroupedTasks]);

  const timelineWidth = 1000;
  const rowHeight = 40;

  // Find the earliest and latest dates
  const { minDate, maxDate, totalDays } = useMemo(() => {
    if (filteredGanttData.length === 0) {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return {
        minDate: today.getTime(),
        maxDate: nextMonth.getTime(),
        totalDays: 30,
      };
    }

    const dates = filteredGanttData.reduce((acc, task) => {
      acc.push(task.startDate, task.endDate);
      return acc;
    }, []);

    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));

    // Add some padding to the date range
    min.setDate(min.getDate() - 2);
    max.setDate(max.getDate() + 2);

    return {
      minDate: min.getTime(),
      maxDate: max.getTime(),
      totalDays: Math.ceil((max - min) / (1000 * 60 * 60 * 24)),
    };
  }, [filteredGanttData]);

  const typeColors = {
    MODELING: "#3b82f6", // blue-500
    MC: "#1d4ed8", // blue-700
    DETAILING: "#22c55e", // green-500
    DC: "#15803d", // green-700
    ERECTION: "#a855f7", // purple-500
    EC: "#7e22ce", // purple-700
    OTHERS: "#f59e0b", // amber-500
  };

  // Status colors
  const statusColors = {
    IN_PROGRESS: "#fbbf24", // amber-400
    IN_REVIEW: "#60a5fa", // blue-400
    COMPLETE: "#34d399", // emerald-400
    ASSIGNED: "#d1d5db", // gray-300
    BREAK: "#f87171", // red-400
  };

  // Get all unique statuses for filter dropdown
  const uniqueStatuses = useMemo(() => {
    return [...new Set(ganttData.map((task) => task.status))];
  }, [ganttData]);

  // Get all unique types for filter dropdown
  const uniqueTypes = useMemo(() => {
    return [...new Set(ganttData.map((task) => task.type))];
  }, [ganttData]);

  // Function to toggle expansion of a task type
  const toggleTypeExpansion = (type) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Function to load more tasks
  const loadMoreTasks = () => {
    setVisibleTaskCount((prev) => prev + 20);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-85">
      <div className="bg-white h-[90vh] overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
        {/* Header with improved styling */}
        <div className="sticky top-0 z-10 flex flex-col items-start justify-between pb-4 mb-6 bg-white border-b md:flex-row md:items-center">
          <div className="flex flex-col gap-3 mb-3 md:flex-row md:items-center md:mb-0">
            <div className="px-4 py-2 text-lg font-bold text-white rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-800 md:px-5 md:py-3 md:text-xl">
              {projectData?.name || "Unknown Project"}
            </div>
            <span className="text-xs text-gray-500 md:text-sm">
              {formatDate(projectData?.startDate)} -{" "}
              {formatDate(projectData?.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DateFilter
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              filteredData={filteredData}
            />
            <button
              className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <div className="grid grid-cols-1 gap-4 p-4 mb-6 items-center rounded-lg bg-gray-50 md:grid-cols-4">
            {/* <div>
              <select
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
              >
                <option value="all">All Users</option>
                {userData.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.f_name} {user.l_name}
                  </option>
                ))}
              </select>
            </div> */}
            {/* <div>
              <CustomSelect
                label="Stage"
                name="stage"
                color="blue"
                options={[
                  { label: "Select Stage", value: "" },
                  { label: "(RFI)Request for Information", value: "RFI" },
                  { label: "(IFA)Issue for Approval", value: "IFA" },
                  {
                    label: "(BFA)Back from Approval/ Returned App",
                    value: "BFA",
                  },
                  {
                    label: "(BFA-M)Back from Approval - Markup",
                    value: "BFA_M",
                  },
                  { label: "(RIFA)Re-issue for Approval", value: "RIFA" },
                  { label: "(RBFA)Return Back from Approval", value: "RBFA" },
                  { label: "(IFC)Issue for Construction/ DIF", value: "IFC" },
                  {
                    label: "(BFC)Back from Construction/ Drawing Revision",
                    value: "BFC",
                  },
                  { label: "(RIFC)Re-issue for Construction", value: "RIFC" },
                  { label: "(REV)Revision", value: "REV" },
                  { label: "(CO#)Change Order", value: "CO#" },
                ]}
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
              />
            </div> */}
            {/* <div>
              <select
                label="Task Type"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Date Filter Component */}

          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "projectDetail"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setActiveTab("projectDetail")}
            >
              Project Details
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "timeline"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setActiveTab("timeline")}
            >
              Timeline
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "team"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setActiveTab("team")}
            >
              Team
            </button>
          </div>
        </div>

        {activeTab === "projectDetail" && (
          <GetProject
          projectId={projectId}
          onClose={onClose}
          projectData={projectData}
          />
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <Overview
            projectData={projectData}
            projectTasks={projectTasks}
            userContributions={userContributions}
            dateFilter={dateFilter}
          />
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <TimeLine
            tasks={filteredGanttData}
            minDate={minDate}
            maxDate={maxDate}
            totalDays={totalDays}
            timelineWidth={timelineWidth}
            rowHeight={rowHeight}
            expandedTypes={expandedTypes}
            toggleTypeExpansion={toggleTypeExpansion}
            visibleTaskCount={visibleTaskCount}
            loadMoreTasks={loadMoreTasks}
            typeColors={typeColors}
            statusColors={statusColors}
            dateFilter={dateFilter}
          />
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <Team
            userContributions={userContributions}
            dateFilter={dateFilter}
            projectTasks={projectTasks}
            userData={userData}
          />
        )}

        {/* Task details tooltip */}
        {hoveredTask && (
          <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2">
            <div className="max-w-md p-4 bg-white border rounded-lg shadow-xl">
              <h3 className="mb-2 text-lg font-bold">{hoveredTask.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Assigned to:</div>
                <div className="font-medium">
                  {hoveredTask.username || "Unassigned"}
                </div>

                <div className="text-gray-600">Timeline:</div>
                <div className="font-medium">
                  {formatDate(hoveredTask.startDate)} -{" "}
                  {formatDate(hoveredTask.endDate)}
                </div>

                <div className="text-gray-600">Duration:</div>
                <div className="font-medium">{hoveredTask.duration} days</div>

                <div className="text-gray-600">Status:</div>
                <div className="font-medium">
                  <span
                    className="inline-block px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor:
                        statusColors[hoveredTask.status] || "#ccc",
                      color:
                        hoveredTask.status === "ASSIGNED" ? "#333" : "#fff",
                    }}
                  >
                    {hoveredTask.status}
                  </span>
                </div>

                <div className="text-gray-600">Progress:</div>
                <div className="font-medium">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${hoveredTask.progress}%`,
                        backgroundColor:
                          statusColors[hoveredTask.status] || "#ccc",
                      }}
                    ></div>
                  </div>
                  <span className="text-xs">{hoveredTask.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectStatus;
