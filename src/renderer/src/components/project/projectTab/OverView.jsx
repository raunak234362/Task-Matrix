/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LayoutList,
  ClipboardCheck,
  UsersRound,
  Hourglass,
  Timer,
  Target,
  AlertCircle,
  PieChart,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import Service from "../../../api/configAPI";

// Constants
const STAGE_NAMES = {
  RFI: "(RFI) Request for Information",
  IFA: "(IFA) Issue for Approval",
  BFA: "(BFA) Back from Approval/Returned App",
  BFA_M: "(BFA-M) Back from Approval - Markup",
  RIFA: "(RIFA) Re-issue for Approval",
  RBFA: "(RBFA) Return Back from Approval",
  IFC: "(IFC) Issue for Construction/DIF",
  BFC: "(BFC) Back from Construction/Drawing Revision",
  RIFC: "(RIFC) Re-issue for Construction",
  REV: "(REV) Revision",
  "CO#": "(CO#) Change Order",
};

const TASK_TYPES = [
  "MODELING",
  "MC",
  "DETAILING",
  "DC",
  "ERECTION",
  "EC",
  "DESIGNING",
  "DESIGNCHECKING",
  "OTHERS",
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#a4de6c",
  "#d0ed57",
  "#83a6ed",
];

const EFFICIENCY_FACTOR = 0.8; // 80% for approval hours
const FABRICATION_FACTOR = 0.2; // 20% for fabrication hours

// Utility Functions
const parseDuration = (duration) => {
  if (!duration || typeof duration !== "string") return 0;
  const [h, m, s] = duration.split(":").map(Number);
  return h + m / 60 + s / 3600;
};

const formatHours = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

const isDateInRange = (taskStartDate, taskEndDate, rangeStart, rangeEnd) => {
  if (!taskStartDate || !taskEndDate) return false;
  const start = new Date(taskStartDate).getTime();
  const end = new Date(taskEndDate).getTime();
  return (
    (start >= rangeStart && start <= rangeEnd) ||
    (end >= rangeStart && end <= rangeEnd) ||
    (start <= rangeStart && end >= rangeEnd)
  );
};

const filterTasksByDate = (tasks, dateFilter) => {
  if (!dateFilter || dateFilter.type === "all") return tasks;

  try {
    switch (dateFilter.type) {
      case "week": {
        const weekStart = new Date(dateFilter.weekStart).getTime();
        const weekEnd = new Date(dateFilter.weekEnd).getTime();
        return tasks.filter((task) =>
          isDateInRange(task.start_date, task.due_date, weekStart, weekEnd),
        );
      }
      case "month": {
        if (dateFilter.year === undefined || dateFilter.month === undefined)
          return tasks;
        const monthStart = new Date(
          dateFilter.year,
          dateFilter.month,
          1,
        ).getTime();
        const monthEnd = new Date(
          dateFilter.year,
          dateFilter.month + 1,
          0,
          23,
          59,
          59,
          999,
        ).getTime();
        return tasks.filter((task) =>
          isDateInRange(task.start_date, task.due_date, monthStart, monthEnd),
        );
      }
      case "year": {
        if (dateFilter.year === undefined) return tasks;
        const yearStart = new Date(dateFilter.year, 0, 1).getTime();
        const yearEnd = new Date(
          dateFilter.year,
          11,
          31,
          23,
          59,
          59,
          999,
        ).getTime();
        return tasks.filter((task) =>
          isDateInRange(task.start_date, task.due_date, yearStart, yearEnd),
        );
      }
      case "range": {
        if (
          dateFilter.year === undefined ||
          dateFilter.startMonth === undefined ||
          dateFilter.endMonth === undefined
        )
          return tasks;
        const rangeStart = new Date(
          dateFilter.year,
          dateFilter.startMonth,
          1,
        ).getTime();
        const rangeEnd = new Date(
          dateFilter.year,
          dateFilter.endMonth + 1,
          0,
          23,
          59,
          59,
          999,
        ).getTime();
        return tasks.filter((task) =>
          isDateInRange(task.start_date, task.due_date, rangeStart, rangeEnd),
        );
      }
      case "dateRange": {
        if (!dateFilter.startDate || !dateFilter.endDate) return tasks;
        const rangeStart = new Date(dateFilter.startDate).setHours(0, 0, 0, 0);
        const rangeEnd = new Date(dateFilter.endDate).setHours(23, 59, 59, 999);
        return tasks.filter((task) =>
          isDateInRange(task.start_date, task.due_date, rangeStart, rangeEnd),
        );
      }
      default:
        return tasks;
    }
  } catch (error) {
    console.error("Error in date filtering:", error, { dateFilter });
    return tasks;
  }
};

// Custom UI Components
const Card = ({ children, className = "" }) => (
  <div className={`p-4 bg-white border shadow-sm rounded-xl ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ value, max, className = "" }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className={`w-full bg-gray-200 rounded-full h-1.5 mt-2 ${className}`}>
      <div
        className="bg-green-600 h-1.5 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Main Component
const Overview = ({
  projectData,
  projectTasks,
  userContributions,
  dateFilter,
  filterStage,
}) => {
  const [workBreakdownHours, setWorkBreakdownHours] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch work breakdown hours
  useEffect(() => {
    const fetchWorkBreakdownHours = async () => {
      setLoading(true);
      setError(null);
      try {
        const hours = {};
        if (filterStage && filterStage !== "all") {
          for (const type of TASK_TYPES) {
            const data = await Service.fetchWorkBreakdownHours(
              type,
              projectData?.id,
              filterStage,
            );
            hours[type] = data;
          }
        }
        setWorkBreakdownHours(hours);
      } catch (err) {
        console.error("Failed to fetch work breakdown hours:", err);
        setError("Failed to load work breakdown hours");
      } finally {
        setLoading(false);
      }
    };

    if (projectData?.id) {
      fetchWorkBreakdownHours();
    }
  }, [projectData?.id, filterStage]);

  // Filter tasks by stage and date
  const filteredTasks = useMemo(() => {
    let tasks = projectTasks || [];

    // Apply stage filter
    if (filterStage && filterStage !== "all") {
      tasks = tasks.filter((task) => {
        const taskStage = task.stage || task.Stage || task.STAGE || "";
        return taskStage.toUpperCase() === filterStage.toUpperCase();
      });
    }

    // Apply date filter
    return filterTasksByDate(tasks, dateFilter);
  }, [projectTasks, filterStage, dateFilter]);

  // Calculate hours by task type
  const taskTypes = useMemo(() => {
    const types = {};
    TASK_TYPES.forEach((type) => {
      const tasks = filteredTasks.filter((task) => task.name?.startsWith(type));
      types[type] = {
        assigned: tasks.reduce(
          (sum, task) => sum + parseDuration(task.duration),
          0,
        ),
        taken:
          tasks.reduce(
            (sum, task) =>
              sum +
              (task?.workingHourTask?.reduce(
                (innerSum, innerTask) =>
                  innerSum + (Number(innerTask.duration) || 0),
                0,
              ) || 0),
            0,
          ) / 60, // Convert minutes to hours
      };
    });
    return types;
  }, [filteredTasks]);

  const totalAssignedHours = projectData?.estimatedHours || 0;
  const totalTakenHours = Object.values(taskTypes).reduce(
    (sum, type) => sum + type.taken,
    0,
  );
  const assignedHour = Object.values(taskTypes).reduce(
    (sum, type) => sum + type.assigned,
    0,
  );

  // Task status distribution for pie chart
  const statusData = useMemo(() => {
    const statusCounts = filteredTasks.reduce((acc, task) => {
      let status = task.status;
      if (
        status === "COMPLETE" ||
        status === "VALIDATE_COMPLETE" ||
        status === "COMPLETE_OTHER"
      ) {
        status = "COMPLETE";
      }
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [filteredTasks]);

  // Task type data for bar chart
  const taskTypeData = useMemo(() => {
    return Object.entries(taskTypes)
      .filter(([, hours]) => hours.assigned > 0 || hours.taken > 0)
      .map(([type, hours]) => ({
        name: type,
        assigned: hours.assigned,
        taken: hours.taken,
      }))
      .sort((a, b) => b.assigned + b.taken - (a.assigned + a.taken));
  }, [taskTypes]);

  // Filtered user contributions
  const filteredUserContributions = useMemo(() => {
    return userContributions
      .map((user) => {
        const userTasks = filteredTasks.filter(
          (task) => task.user?.id === user.id,
        );
        const totalWorkingHourTasks = userTasks.reduce(
          (sum, task) =>
            sum +
            (task.workingHourTask?.reduce(
              (innerSum, innerTask) => innerSum + (innerTask.duration || 0),
              0,
            ) || 0),
          0,
        );
        return {
          ...user,
          taskCount: userTasks.length,
          totalAssignedHours: userTasks.reduce(
            (sum, task) => sum + parseDuration(task.duration),
            0,
          ),
          totalWorkedHours: (totalWorkingHourTasks / 60).toFixed(2),
        };
      })
      .filter((user) => user.taskCount > 0)
      .sort((a, b) => b.taskCount - a.taskCount);
  }, [userContributions, filteredTasks]);

  // Stage-specific statistics
  const stageStats = useMemo(() => {
    if (!filterStage || filterStage === "all") return null;
    const stageHours = {
      assigned: filteredTasks.reduce(
        (sum, task) => sum + parseDuration(task.duration),
        0,
      ),
      taken:
        filteredTasks.reduce(
          (sum, task) =>
            sum +
            (task?.workingHourTask?.reduce(
              (innerSum, innerTask) =>
                innerSum + (Number(innerTask.duration) || 0),
              0,
            ) || 0),
          0,
        ) / 60,
    };
    return {
      taskCount: filteredTasks.length,
      assignedHours: stageHours.assigned,
      takenHours: stageHours.taken,
      efficiency:
        stageHours.taken > 0
          ? ((stageHours.assigned / stageHours.taken) * 100).toFixed(1)
          : 0,
      completedTasks: filteredTasks.filter((task) => task.status === "COMPLETE")
        .length,
      inProgressTasks: filteredTasks.filter(
        (task) => task.status === "IN_PROGRESS",
      ).length,
      inReviewTasks: filteredTasks.filter((task) => task.status === "IN_REVIEW")
        .length,
    };
  }, [filteredTasks, filterStage]);

  const getStageDisplayName = (stage) => STAGE_NAMES[stage] || stage;

  return (
    <div className="space-y-6">
      {/* Error and Loading States */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}
      {loading && (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
          Loading data...
        </div>
      )}

      {/* Stage-Specific Header */}
      {stageStats && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="p-4">
            <h2 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Stage Filter: {getStageDisplayName(filterStage)}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Tasks:</span>{" "}
                <span className="font-semibold">{stageStats.taskCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Assigned Hours:</span>{" "}
                <span className="font-semibold">
                  {formatHours(stageStats.assignedHours)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Time Taken:</span>{" "}
                <span className="font-semibold">
                  {formatHours(stageStats.takenHours)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>{" "}
                <span className="font-semibold text-green-600">
                  {stageStats.completedTasks}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            icon: <LayoutList className="w-5 h-5 text-green-500" />,
            label: "Total Tasks",
            value: filteredTasks.length,
            subtext:
              filterStage && filterStage !== "all"
                ? `In ${getStageDisplayName(filterStage)}`
                : null,
          },
          {
            icon: <ClipboardCheck className="w-5 h-5 text-green-700" />,
            label: "Completed",
            value: filteredTasks.filter(
              (task) =>
                task.status === "COMPLETE" ||
                task.status === "VALIDATE_COMPLETE" ||
                task.status === "COMPLETE_OTHER",
            ).length,
            component: (
              <ProgressBar
                value={
                  filteredTasks.filter(
                    (task) =>
                      task.status === "COMPLETE" ||
                      task.status === "VALIDATE_COMPLETE" ||
                      task.status === "COMPLETE_OTHER",
                  ).length
                }
                max={filteredTasks.length}
              />
            ),
          },
          // {
          //   icon: <UsersRound className="w-5 h-5 text-gray-500" />,
          //   label: "Team Members",
          //   value: filteredUserContributions.length,
          // },
          // {
          //   icon: <Hourglass className="w-5 h-5 text-gray-800" />,
          //   label: "Total Hours",
          //   value: formatHours(totalAssignedHours),
          // },
          // {
          //   icon: <Timer className="w-5 h-5 text-blue-500" />,
          //   label: "Approval Hours",
          //   value: formatHours(totalAssignedHours * EFFICIENCY_FACTOR),
          // },
          // {
          //   icon: <Timer className="w-5 h-5 text-purple-500" />,
          //   label: "Fabrication Hours",
          //   value: formatHours(totalAssignedHours * FABRICATION_FACTOR),
          // },
          {
            icon: <Timer className="w-5 h-5 text-gray-700" />,
            label: "Total Assigned Hours",
            value: formatHours(assignedHour),
            subtext:
              filterStage && filterStage !== "all"
                ? "For selected stage"
                : null,
          },
          {
            icon: <Timer className="w-5 h-5 text-orange-500" />,
            label: "Total Time Taken",
            value: formatHours(totalTakenHours),
            subtext:
              filterStage && filterStage !== "all"
                ? "For selected stage"
                : null,
          },
          {
            icon: <Target className="w-5 h-5 text-purple-500" />,
            label: "Project Efficiency for Approval",
            value:
              totalTakenHours > 0
                ? `${Math.round(
                    ((totalAssignedHours * EFFICIENCY_FACTOR) /
                      totalTakenHours) *
                      100,
                  )}%`
                : "0%",
            subtext:
              filterStage && filterStage !== "all" ? "Stage efficiency" : null,
            show: filterStage === "IFA",
          },
          // {
          //   icon: <Target className="w-5 h-5 text-purple-500" />,
          //   label: "Project Efficiency for Fabrication",
          //   value:
          //     totalTakenHours > 0
          //       ? `${Math.round(
          //           ((totalAssignedHours * FABRICATION_FACTOR) /
          //             totalTakenHours) *
          //             100
          //         )}%`
          //       : "0%",
          //   subtext:
          //     filterStage && filterStage !== "all" ? "Stage efficiency" : null,
          //   show: filterStage === "IFC",
          // },
          // {
          //   icon: <Target className="w-5 h-5 text-purple-500" />,
          //   label: "Project Efficiency for Change Order",
          //   value:
          //     totalTakenHours > 0
          //       ? `${Math.round((totalAssignedHours / totalTakenHours) * 100)}%`
          //       : "0%",
          //   subtext:
          //     filterStage && filterStage !== "all" ? "Stage efficiency" : null,
          //   show: filterStage === "CO",
          // },
          {
            icon: <Target className="w-5 h-5 text-purple-500" />,
            label: "Overall Project Efficiency",
            value:
              totalTakenHours > 0
                ? `${Math.round((assignedHour / totalTakenHours) * 100)}%`
                : "0%",
            subtext:
              filterStage && filterStage !== "all" ? "Stage efficiency" : null,
            show: filterStage === "all",
          },
        ]
          .filter((card) => card.show === undefined || card.show)
          .map(({ icon, label, value, subtext, component }, index) => (
            <Card key={index}>
              <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-sm font-medium text-gray-500">{label}</h3>
              </div>
              <p className="text-3xl font-bold">{value}</p>
              {subtext && (
                <p className="text-xs text-gray-500 mt-1">{subtext}</p>
              )}
              {component}
            </Card>
          ))}
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project/Stage Overview */}
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100">
          <div className="p-5">
            <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-teal-800">
              <AlertCircle className="w-5 h-5" />
              {filterStage && filterStage !== "all"
                ? `${getStageDisplayName(filterStage)} Overview`
                : "Project Overview"}
            </h2>
            <div className="space-y-3 text-sm">
              {[
                {
                  label: "Total Tasks",
                  value: filteredTasks.length,
                  className: "text-teal-800",
                },
                {
                  label: "Completed",
                  value: filteredTasks.filter(
                    (task) => task.status === "COMPLETE",
                  ).length,
                  className: "text-teal-800",
                },
                {
                  label: "In Review",
                  value: filteredTasks.filter(
                    (task) => task.status === "IN_REVIEW",
                  ).length,
                  className: "text-teal-800",
                },
                {
                  label: "In Break",
                  value: filteredTasks.filter((task) => task.status === "BREAK")
                    .length,
                  className: "text-teal-800",
                },
                {
                  label: "In Progress",
                  value: filteredTasks.filter(
                    (task) => task.status === "IN_PROGRESS",
                  ).length,
                  className: "text-teal-800",
                },
                {
                  label: "Not Started",
                  value: filteredTasks.filter(
                    (task) => task.status === "ASSIGNED",
                  ).length,
                  className: "text-teal-800",
                },
              ].map(({ label, value, className }, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{label}:</span>
                  <span className={`font-semibold ${className || ""}`}>
                    {value}
                  </span>
                </div>
              ))}
              {filterStage && filterStage !== "all" && stageStats && (
                <div className="pt-2 border-t border-blue-200">
                  {[
                    {
                      label: "Modeling",
                      value: (
                        (workBreakdownHours.MODELING?._sum?.totalExecHr || 0) /
                        60
                      ).toFixed(2),
                    },
                    {
                      label: "Model Checking",
                      value: (
                        (workBreakdownHours.MODELING?._sum?.totalCheckHr || 0) /
                        60
                      ).toFixed(2),
                    },
                    {
                      label: "Detailing",
                      value: (
                        (workBreakdownHours.DETAILING?._sum?.totalExecHr || 0) /
                        60
                      ).toFixed(2),
                    },
                    {
                      label: "Detail Checking",
                      value: (
                        (workBreakdownHours.DETAILING?._sum?.totalCheckHr ||
                          0) / 60
                      ).toFixed(2),
                    },
                    {
                      label: "Erection",
                      value: (
                        (workBreakdownHours.ERECTION?._sum?.totalExecHr || 0) /
                        60
                      ).toFixed(2),
                    },
                    {
                      label: "Erection Checking",
                      value: (
                        (workBreakdownHours.ERECTION?._sum?.totalCheckHr || 0) /
                        60
                      ).toFixed(2),
                    },
                    {
                      label: "Stage Efficiency",
                      value: `${stageStats.efficiency}%`,
                      className: "text-purple-600",
                    },
                  ].map(({ label, value, className }, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-600">{label}:</span>
                      <span
                        className={`font-semibold ${
                          className || "text-gray-500"
                        }`}
                      >
                        {value} {label.includes("Efficiency") ? "" : "hours"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <div className="p-3">
            <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
              <PieChart className="w-5 h-5" /> Task Status Distribution
            </h2>

            <div className="h-[300px] flex flex-row items-center justify-between">
              {statusData.length > 0 ? (
                <div className="flex w-full items-center justify-center gap-10">
                  {/* 🥧 PIE CHART ON LEFT */}
                  <ResponsiveContainer width="60%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        dataKey="value"
                        nameKey="name"
                      >
                        {statusData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      {/* 🧠 CUSTOM TOOLTIP */}
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0];
                            const total = statusData.reduce(
                              (acc, item) => acc + item.value,
                              0,
                            );
                            const percentage = (
                              (data.value / total) *
                              100
                            ).toFixed(1);

                            return (
                              <div
                                className="bg-white shadow-md rounded-md p-3 border border-gray-200 text-sm"
                                style={{ lineHeight: "1.5" }}
                              >
                                <p className="font-semibold text-gray-800">
                                  {data.name}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Count:</span>{" "}
                                  {data.value}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">
                                    Percentage:
                                  </span>{" "}
                                  {percentage}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>

                  {/* 🧾 LEGEND ON RIGHT */}
                  <div className="flex flex-col gap-2 text-sm">
                    {statusData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <span className="font-medium text-gray-700">
                          {entry.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available for the selected{" "}
                  {filterStage && filterStage !== "all" ? "stage" : "period"}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Task Type Hours Comparison */}
        <Card>
          <div className="p-5">
            <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
              <BarChart2 className="w-5 h-5" /> Hours by Task Type
            </h2>
            <div className="h-[300px]">
              {taskTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskTypeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip
                      formatter={(value) => [`${value.toFixed(2)} hours`, ""]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="assigned"
                      name="Assigned Hours"
                      fill="#8884d8"
                    />
                    <Bar dataKey="taken" name="Hours Taken" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available for the selected{" "}
                  {filterStage && filterStage !== "all" ? "stage" : "period"}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
