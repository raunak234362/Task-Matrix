/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import Header from "./Header";
import { useCallback, useEffect, useMemo, useState } from "react";
import GetProject from "./GetProject";
import Overview from "./OverView";
import Team from "./TeamTab";
import TimeLine from "./TimelineTab";
import Service from "../../../api/configAPI";
import RFI from "../../rfi/RFI"
import Submittals from "../../submittals/Submittals"
import Notes from "../../notes/Notes"
import CO from "../../changeOrder/CO"
const ProjectStatus = ({ projectId, onClose }) => {
  const [activeTab, setActiveTab] = useState("projectDetail");
  const [projectData, setProjectData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [sortBy, setSortBy] = useState("stage_date");
  const [dateFilter, setDateFilter] = useState({
    type: "all", // all, week, month, year, range, dateRange
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    startMonth: new Date().getMonth(),
    endMonth: new Date().getMonth() + 2,
    weekStart: null,
    weekEnd: null,
    startDate: null,
    endDate: null,
  });
  const [filterStage, setFilterStage] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterUserId, setFilterUserId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTypes, setExpandedTypes] = useState({});
  const id = projectId;
  // Fetch project data
  const getProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Service.getProject(id);
      setProjectData(response);
    } catch (err) {
      setError("Failed to load project data");
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      getProject(projectId);
    }
  }, [projectId]);

  const userType = sessionStorage.getItem("userType");
  const taskData = useSelector((state) => state.taskData.taskData);
  const userData = useSelector((state) => state.userData.staffData);

  // Filter tasks for department managers
  const filteredTaskData = useMemo(() => {
    if (userType === "department-manager") {
      return taskData
        .filter((task) => task?.id === projectId) // <-- actual condition
        .flatMap((task) =>
          (task.tasks || []).map((subTask) => ({
            ...subTask,
            projectId,
          }))
        );
    }
    return taskData;
  }, [taskData, userType, projectId]);

  // Compute project tasks
  const projectTasks = useMemo(() => {
    if (userType === "department-manager") {
      return filteredTaskData;
    }
    return taskData.filter((task) => task.project_id === projectId);
  }, [taskData, projectId, userType, filteredTaskData]);

  // Format date utility
  const formatDate = (date) => {
    return date && !isNaN(new Date(date))
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";
  };

  // Parse duration utility
  const parseDuration = (duration) => {
    if (!duration || typeof duration !== "string") return 0;
    const [h, m, s] = duration.split(":").map(Number);
    return h + m / 60 + s / 3600;
  };

  // Compute user contributions
  const userContributions = useMemo(() => {
    return (userData || [])
      .map((user) => {
        const userTasks =
          projectTasks?.filter((task) => task.user?.id === user.id) || [];
        const totalWorkingHourTasks = userTasks.reduce((sum, task) => {
          const taskDuration =
            task.workingHourTask?.reduce(
              (innerSum, innerTask) =>
                innerSum + (Number(innerTask.duration) || 0),
              0
            ) || 0;
          return sum + taskDuration;
        }, 0);
        return {
          id: user.id,
          name: user.f_name || "Unknown",
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
  }, [userData, projectTasks]);

  // Prepare data for Gantt chart
  const ganttData = useMemo(() => {
    return projectTasks.map((task) => {
      const startDate =
        task.start_date && !isNaN(new Date(task.start_date))
          ? new Date(task.start_date)
          : new Date();
      const endDate =
        task.due_date && !isNaN(new Date(task.due_date))
          ? new Date(task.due_date)
          : new Date();
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const type = task.name?.split(" ")[0] || "Unknown";

      const assignedHours = parseDuration(task.duration);
      const takenHours =
        task.workingHourTask?.reduce(
          (sum, innerTask) => sum + (Number(innerTask.duration) || 0),
          0
        ) || 0;

      let progress = assignedHours
        ? Math.min((takenHours / assignedHours) * 100, 100)
        : 0;
      if (task.status === "IN_REVIEW") progress = 80;
      else if (task.status === "COMPLETE") progress = 100;
      else if (
        (task.status === "IN_PROGRESS" || task.status === "BREAK") &&
        progress > 80
      )
        progress = 80;

      return {
        id: task.id || "",
        name: task.name || "Unnamed Task",
        username:
          `${task.user?.f_name || ""} ${task.user?.l_name || ""}`.trim() ||
          "Unassigned",
        type,
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        duration: duration >= 0 ? duration : 0,
        progress: Math.round(progress),
        status: task.status || "Unknown",
      };
    });
  }, [projectTasks]);

  // Apply date filtering
  const applyDateFilter = useCallback(
    (data) => {
      if (dateFilter.type === "all") return data;

      return data.filter((task) => {
        const taskStartDate = task.startDate;
        const taskEndDate = task.endDate;

        try {
          if (
            dateFilter.type === "week" &&
            dateFilter.weekStart &&
            dateFilter.weekEnd
          ) {
            const weekStart = new Date(dateFilter.weekStart).getTime();
            const weekEnd = new Date(dateFilter.weekEnd).getTime();
            return (
              (taskStartDate >= weekStart && taskStartDate <= weekEnd) ||
              (taskEndDate >= weekStart && taskEndDate <= weekEnd) ||
              (taskStartDate <= weekStart && taskEndDate >= weekEnd)
            );
          }

          if (
            dateFilter.type === "month" &&
            dateFilter.year !== undefined &&
            dateFilter.month !== undefined
          ) {
            const filterStartDate = new Date(
              dateFilter.year,
              dateFilter.month,
              1
            ).getTime();
            const filterEndDate = new Date(
              dateFilter.year,
              dateFilter.month + 1,
              0,
              23,
              59,
              59,
              999
            ).getTime();
            return (
              (taskStartDate >= filterStartDate &&
                taskStartDate <= filterEndDate) ||
              (taskEndDate >= filterStartDate &&
                taskEndDate <= filterEndDate) ||
              (taskStartDate <= filterStartDate && taskEndDate >= filterEndDate)
            );
          }

          if (dateFilter.type === "year" && dateFilter.year !== undefined) {
            const filterStartDate = new Date(dateFilter.year, 0, 1).getTime();
            const filterEndDate = new Date(
              dateFilter.year,
              11,
              31,
              23,
              59,
              59,
              999
            ).getTime();
            return (
              (taskStartDate >= filterStartDate &&
                taskStartDate <= filterEndDate) ||
              (taskEndDate >= filterStartDate &&
                taskEndDate <= filterEndDate) ||
              (taskStartDate <= filterStartDate && taskEndDate >= filterEndDate)
            );
          }

          if (
            dateFilter.type === "range" &&
            dateFilter.year !== undefined &&
            dateFilter.startMonth !== undefined &&
            dateFilter.endMonth !== undefined
          ) {
            const filterStartDate = new Date(
              dateFilter.year,
              dateFilter.startMonth,
              1
            ).getTime();
            const filterEndDate = new Date(
              dateFilter.year,
              dateFilter.endMonth + 1,
              0,
              23,
              59,
              59,
              999
            ).getTime();
            return (
              (taskStartDate >= filterStartDate &&
                taskStartDate <= filterEndDate) ||
              (taskEndDate >= filterStartDate &&
                taskEndDate <= filterEndDate) ||
              (taskStartDate <= filterStartDate && taskEndDate >= filterEndDate)
            );
          }

          if (
            dateFilter.type === "dateRange" &&
            dateFilter.startDate &&
            dateFilter.endDate
          ) {
            const filterStartDate = new Date(dateFilter.startDate).getTime();
            const filterEndDate = new Date(dateFilter.endDate).setHours(
              23,
              59,
              59,
              999
            );
            return (
              (taskStartDate >= filterStartDate &&
                taskStartDate <= filterEndDate) ||
              (taskEndDate >= filterStartDate &&
                taskEndDate <= filterEndDate) ||
              (taskStartDate <= filterStartDate && taskEndDate >= filterEndDate)
            );
          }

          return true;
        } catch (error) {
          useEffect;
          console.error("Error in date filtering:", error, { dateFilter });
          return true;
        }
      });
    },
    [dateFilter]
  );

  // Compute filtered Gantt data
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

    // Apply stage filter
    if (filterStage !== "all") {
      filtered = filtered.filter((task) => {
        const originalTask = projectTasks.find((t) => t.id === task.id);
        return (
          originalTask &&
          (
            originalTask.stage ||
            originalTask.Stage ||
            originalTask.STAGE ||
            ""
          ).toUpperCase() === filterStage.toUpperCase()
        );
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
    filterStage,
    applyDateFilter,
    projectTasks,
  ]);

  // Gantt chart props
  const minDate = useMemo(() => {
    return projectTasks.length > 0
      ? Math.min(
          ...projectTasks.map((task) => new Date(task.start_date).getTime())
        )
      : new Date().getTime();
  }, [projectTasks]);

  const maxDate = useMemo(() => {
    return projectTasks.length > 0
      ? Math.max(
          ...projectTasks.map((task) => new Date(task.due_date).getTime())
        )
      : new Date().getTime();
  }, [projectTasks]);

  const totalDays = useMemo(() => {
    return Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
  }, [minDate, maxDate]);

  const typeColors = useMemo(() => {
    const types = [
      ...new Set(
        projectTasks.map((task) => (task.name || "").split(" ")[0] || "Unknown")
      ),
    ];
    const colors = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#8884d8",
      "#82ca9d",
    ];
    return types.reduce((acc, type, index) => {
      acc[type] = colors[index % colors.length];
      return acc;
    }, {});
  }, [projectTasks]);

  const statusColors = {
    ASSIGNED: "#6B7280",
    IN_PROGRESS: "#3B82F6",
    IN_REVIEW: "#F59E0B",
    COMPLETE: "#10B981",
    BREAK: "#EF4444",
  };

  // Handle type expansion for TimeLine
  const toggleTypeExpansion = useCallback((type) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }, []);

  // Initialize expandedTypes
  useEffect(() => {
    const initialExpanded = projectTasks.reduce((acc, task) => {
      const type = (task.name || "").split(" ")[0] || "Unknown";
      acc[type] = true;
      return acc;
    }, {});
    setExpandedTypes(initialExpanded);
  }, [projectTasks]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
        {/* Loading and Error States */}
        {loading && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-center">
            Loading project data...
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        {!loading && !error && projectData && (
          <>
            <Header
              projectData={projectData}
              filterStage={filterStage}
              setFilterStage={setFilterStage}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              filteredData={filteredData}
              formatDate={formatDate}
              onClose={onClose}
            />
            {/* Tabs */}
            <div className="my-3 border-b">
              <div className="flex overflow-x-auto">
                {[
                  { key: "projectDetail", label: "Project Details" },
                  { key: "overview", label: "Overview" },
                  { key: "team", label: "Team" },
                  { key: "RFI", label: "RFI" },
                  { key: "Submittals", label: "Submittals" },
                  // { key: "CO", label: "CO#" },
                  { key: "Notes", label: "Notes" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === key
                        ? "bg-teal-500 text-white font-semibold rounded-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* Tab Content */}
            {activeTab === "projectDetail" && (
              <GetProject
                projectId={projectId}
                onClose={onClose}
                projectData={projectData}
                getProject={getProject}
              />
            )}
            {activeTab === "overview" && (
              <Overview
                projectData={projectData}
                projectTasks={projectTasks}
                userContributions={userContributions}
                dateFilter={dateFilter}
                filterStage={filterStage}
              />
            )}
            {activeTab === "team" && (
              <Team
                userContributions={userContributions}
                dateFilter={dateFilter}
                filterStage={filterStage}
                projectTasks={projectTasks}
                userData={userData}
                sortBy={sortBy}
              />
            )}
            {/* {activeTab === "timeline" && (
              <TimeLine
                tasks={filteredGanttData}
                minDate={minDate}
                maxDate={maxDate}
                totalDays={totalDays}
                rowHeight={50}
                expandedTypes={expandedTypes}
                toggleTypeExpansion={toggleTypeExpansion}
                visibleTaskCount={filteredGanttData.length}
                loadMoreTasks={() => {}}
                typeColors={typeColors}
                statusColors={statusColors}
              />
            )} */}
            {/* {activeTab === "milestone" && (
              <Milestone
                projectId={projectId}
                onClose={onClose}
                projectData={projectData}
                getProject={getProject}
              />
            )} */}
            {activeTab === "RFI" && <RFI projectData={projectData} />}
            {activeTab === "Submittals" && (
              <Submittals projectData={projectData} />
            )}
            {/* {activeTab === "CO" && <CO projectData={projectData} />} */}
            {activeTab === "Notes" && (
              <Notes projectData={projectData} projectId={projectId} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectStatus;
