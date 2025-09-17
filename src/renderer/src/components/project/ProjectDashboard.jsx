/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
"use client";

/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import {
  LayoutGrid,
  ListFilter,
  Search,
  Building2,
  ArrowUpDown,
  ChevronDown,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PauseCircle,
} from "lucide-react";
import ProjectStatus from "./projectTab/ProjectStatus";
import { useSortBy, useTable } from "react-table";
import Button from "../fields/Button";

const ProjectDashboard = () => {
  const userType = sessionStorage.getItem("userType");
  const projectData = useSelector((state) => state?.projectData?.projectData);
  const taskData = useSelector((state) => state.taskData.taskData);
  const userData = useSelector((state) => state.userData.staffData);
  const fabricators = useSelector(
    (state) => state?.fabricatorData?.fabricatorData
  );
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState({ key: "name", order: "asc" });
  const [activeChart, setActiveChart] = useState("line");
  const [projectFilter, setProjectFilter] = useState([]);
  const [departmentTask, setDepartmentTask] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    fabricator: "",
    status: "",
  });

  useEffect(() => {
    if (userType === "department-manager") {
      const departmentTaskData = (taskData ?? []).flatMap(
        (tasks) => tasks?.tasks
      );
      setDepartmentTask(departmentTaskData);
    }
  }, [userType, taskData]);
  // Prepare project data with associated tasks
  const projectsWithTasks = projectData.map((project) => ({
    ...project,
    tasks: (userType === "department-manager"
      ? departmentTask
      : taskData
    ).filter((task) => task?.project_id === project.id),
  }));

  // Calculate task statistics
  const tasksToUse =
    userType === "department-manager" ? departmentTask : taskData;
  const completedTasks =
    tasksToUse?.filter((task) => task?.status === "COMPLETE")?.length || 0;
  const inProgressTasks =
    tasksToUse?.filter((task) => task?.status === "IN_PROGRESS")?.length || 0;
  const assignedTask =
    tasksToUse?.filter((task) => task?.status === "ASSIGNED")?.length || 0;
  const inReviewTask =
    tasksToUse?.filter((task) => task?.status === "IN_REVIEW")?.length || 0;

  // Chart data with improved colors
  const chartColors = {
    completed: "rgba(16, 185, 129, 0.8)", // green
    inProgress: "rgba(59, 130, 246, 0.8)", // blue
    assigned: "rgba(139, 92, 246, 0.8)", // purple
    inReview: "rgba(245, 158, 11, 0.8)", // amber
    onHold: "rgba(239, 68, 68, 0.8)", // red
  };

  // const barData = fabricatorTaskData()
  const projectTaskData = () => {
    // Get unique projects
    const projects =
      userType === "department-manager"
        ? taskData.map((p) => p.name)
        : projectData.map((p) => p.name);
    // For each project, count tasks by status
    return {
      labels: projects,
      datasets: [
        {
          label: "Tasks Completed",
          data: projects.map((projectName) => {
            const project =
              userType === "department-manager"
                ? taskData.find((p) => p.name === projectName)
                : projectData.find((p) => p.name === projectName);

            if (userType === "department-manager") {
              console.log(
                "==================",
                taskData?.filter(
                  (task) =>
                    task?.id === project?.id &&
                    task?.tasks?.status === "COMPLETE"
                ).length
              );
              console.log(
                "==================",
                taskData?.filter((task) => task?.id === project?.id && task)
              );
              return taskData?.filter(
                (task) =>
                  task?.id === project?.id && task?.tasks?.status === "COMPLETE"
              ).length;
            }

            return taskData?.filter(
              (task) =>
                task?.project?.id === project?.id && task?.status === "COMPLETE"
            ).length;
          }),
          backgroundColor: chartColors.completed,
          borderRadius: 6,
        },
        {
          label: "Tasks In Review",
          data: projects.map((projectName) => {
            const project =
              userType === "department-manager"
                ? taskData.find((p) => p.name === projectName)
                : projectData.find((p) => p.name === projectName);
            if (userType === "department-manager") {
              return taskData?.filter(
                (task) =>
                  task?.id === project?.id &&
                  task?.tasks?.status === "IN_REVIEW"
              ).length;
            }

            return taskData?.filter(
              (task) =>
                task?.project?.id === project?.id &&
                task?.status === "IN_REVIEW"
            ).length;
          }),
          backgroundColor: chartColors.inReview,
          borderRadius: 6,
        },
        {
          label: "Tasks In Progress",
          data: projects.map((projectName) => {
            const project =
              userType === "department-manager"
                ? taskData.find((p) => p.name === projectName)
                : projectData.find((p) => p.name === projectName);
            if (userType === "department-manager") {
              return taskData?.filter(
                (task) =>
                  task?.id === project?.id &&
                  task?.tasks?.status === "IN_PROGRESS"
              ).length;
            }

            return taskData?.filter(
              (task) =>
                task?.project?.id === project?.id &&
                task?.status === "IN_PROGRESS"
            ).length;
          }),
          backgroundColor: chartColors.inProgress,
          borderRadius: 6,
        },
        {
          label: "Tasks Assigned",
          data: projects.map((projectName) => {
            const project =
              userType === "department-manager"
                ? taskData.find((p) => p.name === projectName)
                : projectData.find((p) => p.name === projectName);
            if (userType === "department-manager") {
              return taskData?.filter(
                (task) =>
                  task?.id === project?.id && task?.tasks?.status === "ASSIGNED"
              ).length;
            }

            return taskData?.filter(
              (task) =>
                task?.project?.id === project?.id && task?.status === "ASSIGNED"
            ).length;
          }),
          backgroundColor: chartColors.assigned,
          borderRadius: 6,
        },
      ],
    };
  };

  const barData = projectTaskData();

  const pieData = {
    labels: ["Completed", "In Progress", "Assigned", "In Review"],
    datasets: [
      {
        data: [completedTasks, inProgressTasks, assignedTask, inReviewTask],
        backgroundColor: [
          chartColors.completed,
          chartColors.inProgress,
          chartColors.assigned,
          chartColors.inReview,
        ],
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };

  const lineData = {
    labels: projectsWithTasks?.map((project) => project?.name) || [],
    datasets: [
      {
        label: "Tasks Completed",
        data: projectsWithTasks?.map(
          (project) =>
            project?.tasks?.filter((task) => task?.status === "COMPLETE")
              ?.length || 0
        ),
        borderColor: chartColors.completed,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: chartColors.completed,
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
      {
        label: "Tasks In Progress",
        data: projectsWithTasks?.map(
          (project) =>
            project?.tasks?.filter((task) => task?.status === "IN_PROGRESS")
              ?.length || 0
        ),
        borderColor: chartColors.inProgress,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: chartColors.inProgress,
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
      {
        label: "Tasks Assigned",
        data: projectsWithTasks?.map(
          (project) =>
            project?.tasks?.filter((task) => task?.status === "ASSIGNED")
              ?.length || 0
        ),
        borderColor: chartColors.assigned,
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: chartColors.assigned,
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
    ],
  };

  // Calculate dynamic height for bar chart based on number of fabricators
  const getBarChartHeight = () => {
    const fabricatorCount = barData.labels.length;
    // Base height plus additional height per fabricator
    const baseHeight = 300;
    const heightPerFabricator = 40;
    return Math.max(baseHeight, fabricatorCount * heightPerFabricator);
  };

  const handleViewClick = (projectID) => {
    setSelectedProject(projectID);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };
  useEffect(() => {
    setProjectFilter(projectData);
  }, [projectData]);


  const filterAndSortData = () => {
    let filtered = projectData?.filter((project) => {
      const searchMatch = project?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const filterMatch =
        (!filters?.fabricator ||
          project?.fabricator?.fabName === filters?.fabricator) &&
        (!filters?.status || project?.status === filters?.status);
      return searchMatch && filterMatch;
    });

    filtered.sort((a, b) => {
      let aKey = a[sortOrder?.key];
      let bKey = b[sortOrder?.key];

      if (sortOrder?.key === "fabricator") {
        aKey = a.fabricator?.fabName || "";
        bKey = b.fabricator?.fabName || "";
      }

      const aValue = typeof aKey === "string" ? aKey.toLowerCase() : aKey ?? "";
      const bValue = typeof bKey === "string" ? bKey.toLowerCase() : bKey ?? "";

      return sortOrder?.order === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

    setProjectFilter(filtered);
  };

  useEffect(() => {
    filterAndSortData();
  }, [searchQuery, filters, sortOrder, projectData]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const data = useMemo(() => projectFilter || [], [projectFilter]);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "sno",
      },
      {
        Header: "Project Name",
        accessor: "name",
      },
      {
        Header: "Fabricator",
        accessor: (row) => row?.fabricator?.fabName || "N/A",
        id: "fabricator",
      },
      {
        Header: "Submission Date",
        accessor: "endDate",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const status = row.original.status;
          let StatusIcon = CheckCircle2;
          let statusColor = "text-green-500";
          let statusBgColor = "bg-green-50";

          if (status === "ACTIVE") {
            StatusIcon = Loader2;
            statusColor = "text-blue-500";
            statusBgColor = "bg-blue-50";
          } else if (status === "ONHOLD") {
            StatusIcon = PauseCircle;
            statusColor = "text-amber-500";
            statusBgColor = "bg-amber-50";
          } else if (status === "BREAK") {
            StatusIcon = AlertCircle;
            statusColor = "text-red-500";
            statusBgColor = "bg-red-50";
          }

          return (
            <span
              className={`px-2 sm:px-3 py-0.5 sm:py-1 inline-flex items-center gap-1 text-xs font-medium rounded-full ${statusBgColor} ${statusColor}`}
            >
              <StatusIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {status}
            </span>
          );
        },
      },
      {
        Header: "Tasks",
        id: "tasks",
        Cell: ({ row }) => {
          const project = row.original;
          const projectTasks = tasksToUse.filter(
            (task) => task?.project_id === project.id
          );
          const completedTasksCount = projectTasks.filter(
            (task) => task.status === "COMPLETE"
          ).length;
          return (
            <div>
              <div className="text-xs font-medium text-gray-700 sm:text-sm">
                {projectTasks.length}
              </div>
              <div className="text-xs text-gray-500">
                {completedTasksCount} completed
              </div>
            </div>
          );
        },
      },
      {
        Header: "Approval Date",
        accessor: "approvalDate",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <Button onClick={() => handleViewClick(row.original.id)}>View</Button>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  // Get summary stats
  const totalProjects = projectData.length;
  const activeProjects = projectData.filter(
    (p) => p.status === "ACTIVE"
  ).length;
  const totalTasks = taskData.length;
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
            Project Dashboard
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Track and manage all your projects in one place
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:mb-8">
          <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl sm:p-6 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500 sm:text-sm">
                  Total Projects
                </p>
                <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
                  {totalProjects}
                </h3>
              </div>
              <div className="p-2 rounded-full bg-blue-50 sm:p-3">
                <LayoutGrid className="w-4 h-4 text-blue-500 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl sm:p-6 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500 sm:text-sm">
                  Active Projects
                </p>
                <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
                  {activeProjects}
                </h3>
              </div>
              <div className="p-2 rounded-full bg-green-50 sm:p-3">
                <CheckCircle2 className="w-4 h-4 text-green-500 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl sm:p-6 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500 sm:text-sm">
                  Total Tasks
                </p>
                <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
                  {totalTasks}
                </h3>
              </div>
              <div className="p-2 rounded-full bg-purple-50 sm:p-3">
                <CheckCircle2 className="w-4 h-4 text-purple-500 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl sm:p-6 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500 sm:text-sm">
                  Completion Rate
                </p>
                <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
                  {completionRate}%
                </h3>
              </div>
              <div className="p-2 rounded-full bg-amber-50 sm:p-3">
                <PieChart className="w-4 h-4 sm:w-6 sm:h-6 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
        {userType === "department-manager" ? null : (
          <div className="mb-6 overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl sm:mb-8">
            <div className="overflow-x-auto border-b border-gray-100">
              <div className="flex min-w-max">
                <button
                  onClick={() => setActiveChart("bar")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeChart === "bar"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Fabricator Task Overview
                </button>
                <button
                  onClick={() => setActiveChart("pie")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeChart === "pie"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <PieChart className="w-4 h-4" />
                  Task Distribution
                </button>
                <button
                  onClick={() => setActiveChart("line")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeChart === "line"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <LineChart className="w-4 h-4" />
                  Task Trends
                </button>
              </div>
            </div>
            {userType === "department-manager" ? null : (
              <div className="p-4 sm:p-6">
                <div
                  className="w-full"
                  style={{
                    height:
                      activeChart === "bar"
                        ? `${getBarChartHeight()}px`
                        : "400px",
                  }}
                >
                  {userType === "department-manager"
                    ? null
                    : activeChart === "bar" && (
                        <Bar
                          data={barData}
                          options={{
                            indexAxis: "y", // This makes the bar chart horizontal
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "top",
                                labels: {
                                  usePointStyle: true,
                                  boxWidth: 6,
                                  font: {
                                    size: 12,
                                  },
                                },
                              },
                              tooltip: {
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                padding: 12,
                                titleFont: {
                                  size: 14,
                                },
                                bodyFont: {
                                  size: 13,
                                },
                                cornerRadius: 8,
                              },
                            },
                            scales: {
                              x: {
                                beginAtZero: true,
                                grid: {
                                  color: "rgba(0, 0, 0, 0.05)",
                                },
                                stacked: true,
                              },
                              y: {
                                grid: {
                                  display: false,
                                },
                                stacked: true,
                                ticks: {
                                  // Ensure fabricator names are fully visible
                                  callback: function (value) {
                                    const label = this.getLabelForValue(value);
                                    // Truncate long fabricator names on small screens
                                    const maxLength =
                                      window.innerWidth < 768 ? 15 : 25;
                                    return label.length > maxLength
                                      ? label.substring(0, maxLength) + "..."
                                      : label;
                                  },
                                },
                              },
                            },
                          }}
                        />
                      )}

                  {activeChart === "pie" && (
                    <Pie
                      data={pieData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position:
                              window.innerWidth < 768 ? "bottom" : "right",
                            labels: {
                              usePointStyle: true,
                              padding: window.innerWidth < 768 ? 10 : 20,
                              font: {
                                size: 12,
                              },
                            },
                          },
                          tooltip: {
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            padding: 12,
                            titleFont: {
                              size: 14,
                            },
                            bodyFont: {
                              size: 13,
                            },
                            cornerRadius: 8,
                          },
                        },
                      }}
                    />
                  )}
                  {activeChart === "line" && (
                    <Line
                      data={lineData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                            labels: {
                              usePointStyle: true,
                              boxWidth: 6,
                              font: {
                                size: 12,
                              },
                            },
                          },
                          tooltip: {
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            padding: 12,
                            titleFont: {
                              size: 14,
                            },
                            bodyFont: {
                              size: 13,
                            },
                            cornerRadius: 8,
                          },
                        },
                        scales: {
                          x: {
                            grid: {
                              display: false,
                            },
                            ticks: {
                              // Handle long project names
                              callback: function (value) {
                                const label = this.getLabelForValue(value);
                                // Truncate long project names
                                const maxLength =
                                  window.innerWidth < 768 ? 8 : 15;
                                return label.length > maxLength
                                  ? label.substring(0, maxLength) + "..."
                                  : label;
                              },
                              maxRotation: 45,
                              minRotation: 45,
                            },
                          },
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: "rgba(0, 0, 0, 0.05)",
                            },
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Chart Section with Tabs */}

        {/* Enhanced Filters */}
        <div className="flex flex-col gap-4 mb-4 md:flex-row">
          <input
            type="text"
            placeholder="Search by name"
            className="w-full p-2 border rounded"
            value={searchQuery}
            onChange={handleSearch}
          />
          <select
            name="fabricator"
            value={filters.fabricator}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Fabricator</option>
            {fabricators?.map((fab) => (
              <option key={fab.id} value={fab.fabName}>
                {fab.fabName}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ON-HOLD">ON-HOLD</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DELAY">DELAY</option>
            <option value="COMPLETE">COMPLETED</option>
          </select>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-md border max-h-[65vh]">
          <table
            {...getTableProps()}
            className="min-w-[800px] w-full border-collapse text-sm text-center"
          >
            <thead className="sticky top-0 z-10 bg-teal-200/80">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-4 py-2 font-semibold border whitespace-nowrap"
                    >
                      {column.render("Header")}
                      {column.isSorted ? (column.isSortedDesc ? " " : " ") : ""}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center">
                    No Projects Found
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-100">
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-4 py-2 border"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedProject && (
        <ProjectStatus
          projectId={selectedProject}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          className="max-w-full mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl"
        />
      )}
    </div>
  );
};

export default ProjectDashboard;
