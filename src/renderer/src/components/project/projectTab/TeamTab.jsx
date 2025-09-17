/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useMemo } from "react";
import { Users, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Constants
const STAGE_PRIORITY = {
    RFI: 1,
    IFA: 2,
    BFA: 3,
    BFA_M: 4,
    RIFA: 5,
    RBFA: 6,
    IFC: 7,
    BFC: 8,
    RIFC: 9,
    REV: 10,
    "CO#": 11,
};

const STAGE_NAMES = {
    RFI: "Request for Information",
    IFA: "Issue for Approval",
    BFA: "Back from Approval",
    BFA_M: "Back from Approval - Markup",
    RIFA: "Re-issue for Approval",
    RBFA: "Return Back from Approval",
    IFC: "Issue for Construction",
    BFC: "Back from Construction",
    RIFC: "Re-issue for Construction",
    REV: "Revision",
    "CO#": "Change Order",
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

// Utility Functions
const parseDuration = (duration) => {
    if (!duration || typeof duration !== "string") return 0;
    const [h, m, s] = duration.split(":").map(Number);
    return h + m / 60 + s / 3600;
};

const formatHours = (hours) => {
    if (isNaN(hours)) return "0h 0m";
    const h = Math.floor(parseFloat(hours));
    const m = Math.round((parseFloat(hours) - h) * 60);
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
                    isDateInRange(task.start_date, task.due_date, weekStart, weekEnd)
                );
            }
            case "month": {
                if (dateFilter.year === undefined || dateFilter.month === undefined) return tasks;
                const monthStart = new Date(dateFilter.year, dateFilter.month, 1).getTime();
                const monthEnd = new Date(dateFilter.year, dateFilter.month + 1, 0, 23, 59, 59, 999).getTime();
                return tasks.filter((task) =>
                    isDateInRange(task.start_date, task.due_date, monthStart, monthEnd)
                );
            }
            case "year": {
                if (dateFilter.year === undefined) return tasks;
                const yearStart = new Date(dateFilter.year, 0, 1).getTime();
                const yearEnd = new Date(dateFilter.year, 11, 31, 23, 59, 59, 999).getTime();
                return tasks.filter((task) =>
                    isDateInRange(task.start_date, task.due_date, yearStart, yearEnd)
                );
            }
            case "range": {
                if (
                    dateFilter.year === undefined ||
                    dateFilter.startMonth === undefined ||
                    dateFilter.endMonth === undefined
                )
                    return tasks;
                const rangeStart = new Date(dateFilter.year, dateFilter.startMonth, 1).getTime();
                const rangeEnd = new Date(dateFilter.year, dateFilter.endMonth + 1, 0, 23, 59, 59, 999).getTime();
                return tasks.filter((task) =>
                    isDateInRange(task.start_date, task.due_date, rangeStart, rangeEnd)
                );
            }
            case "dateRange": {
                if (!dateFilter.startDate || !dateFilter.endDate) return tasks;
                const rangeStart = new Date(dateFilter.startDate).setHours(0, 0, 0, 0);
                const rangeEnd = new Date(dateFilter.endDate).setHours(23, 59, 59, 999);
                return tasks.filter((task) =>
                    isDateInRange(task.start_date, task.due_date, rangeStart, rangeEnd)
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

// Main Component
const Team = ({ userContributions, dateFilter, projectTasks, userData, filterStage }) => {
    // Normalize and filter tasks
    const filteredTasks = useMemo(() => {
        let tasks = (projectTasks || []).map((task) => ({
            ...task,
            stage: task.stage || task.Stage || task.STAGE || "unknown",
        }));

        // Apply stage filter
        if (filterStage) {
            if (Array.isArray(filterStage) && filterStage.length > 0) {
                tasks = tasks.filter((task) => filterStage.includes(task.stage));
            } else if (filterStage !== "all") {
                tasks = tasks.filter((task) => task.stage.toUpperCase() === filterStage.toUpperCase());
            }
        }

        // Apply date filter
        return filterTasksByDate(tasks, dateFilter);
    }, [projectTasks, filterStage, dateFilter]);

    // Calculate user contributions per stage
    const usersByStage = useMemo(() => {
        const stageContributions = {};

        (userData || []).forEach((user) => {
            const userTasks = filteredTasks.filter((task) => task.user?.id === user.id);

            // Group tasks by stage
            const tasksByStage = userTasks.reduce((acc, task) => {
                const stage = task.stage || "unknown";
                if (!acc[stage]) {
                    acc[stage] = [];
                }
                acc[stage].push(task);
                return acc;
            }, {});

            // Calculate metrics for each stage
            Object.entries(tasksByStage).forEach(([stage, tasks]) => {
                const earliestTaskDate = tasks.length > 0
                    ? Math.min(...tasks.map((task) => new Date(task.start_date).getTime()))
                    : Date.now();

                const totalAssignedHours = tasks.reduce((sum, task) => sum + parseDuration(task.duration), 0);

                const totalWorkedHours = tasks.reduce(
                    (sum, task) =>
                        sum +
                        (task.workingHourTask?.reduce((innerSum, innerTask) => innerSum + (Number(innerTask.duration) || 0), 0) || 0),
                    0
                ) / 60; // Convert minutes to hours

                if (!stageContributions[stage]) {
                    stageContributions[stage] = [];
                }

                stageContributions[stage].push({
                    id: user.id,
                    name: user.f_name,
                    fullName: `${user.f_name || ""} ${user.l_name || ""}`.trim() || user.f_name,
                    taskCount: tasks.length,
                    totalAssignedHours,
                    totalWorkedHours: totalWorkedHours.toFixed(2),
                    earliestTaskDate,
                    stage,
                    stagePriority: STAGE_PRIORITY[stage] || 999,
                });
            });
        });

        // Sort users within each stage
        Object.keys(stageContributions).forEach((stage) => {
            stageContributions[stage].sort((a, b) => {
                if (a.earliestTaskDate !== b.earliestTaskDate) {
                    return a.earliestTaskDate - b.earliestTaskDate;
                }
                return b.taskCount - a.taskCount;
            });
        });

        return stageContributions;
    }, [userData, filteredTasks]);

    // Overall user contributions for bar chart (total across all stages)
    const filteredUserContributions = useMemo(() => {
        return (userData || [])
            .map((user) => {
                const userTasks = filteredTasks.filter((task) => task.user?.id === user.id);
                const totalAssignedHours = userTasks.reduce((sum, task) => sum + parseDuration(task.duration), 0);
                const totalWorkedHours = userTasks.reduce(
                    (sum, task) =>
                        sum +
                        (task.workingHourTask?.reduce((innerSum, innerTask) => innerSum + (Number(innerTask.duration) || 0), 0) || 0),
                    0
                ) / 60;

                return {
                    id: user.id,
                    name: user.f_name,
                    fullName: `${user.f_name || ""} ${user.l_name || ""}`.trim() || user.f_name,
                    taskCount: userTasks.length,
                    totalAssignedHours,
                    totalWorkedHours: totalWorkedHours.toFixed(2),
                };
            })
            .filter((user) => user.taskCount > 0)
            .sort((a, b) => b.taskCount - a.taskCount);
    }, [userData, filteredTasks]);

    const formatStageName = (stage) => STAGE_NAMES[stage] || stage;

    return (
        <div className="space-y-6">
            {/* Date Filter Indicator */}
            {dateFilter?.type !== "all" && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                    <span className="font-medium">Note:</span> Showing team data filtered by selected date range. Total tasks:{" "}
                    {filteredTasks.length} | Team members: {filteredUserContributions.length}
                </div>
            )}

            {/* Sorting Information */}
            <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800">
                <span className="font-medium">Sorting:</span> Users are sorted by Earliest Task Date → Task Count within each stage
            </div>

            {/* Team Contribution Chart */}
            <div className="p-5 bg-white border shadow-sm rounded-xl">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
                    <Users className="w-5 h-5" /> Team Contributions (Total Tasks)
                </h2>
                <div className="h-[300px]">
                    {filteredUserContributions.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredUserContributions} layout="vertical" margin={{ left: 100 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 14 }} />
                                <Tooltip
                                    formatter={(value, name) =>
                                        name === "taskCount" ? [`${value} tasks`, "Tasks Assigned"] : [(value), "Total Task Assigned"]
                                    }
                                    contentStyle={{
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        padding: "10px",
                                    }}
                                />
                                <Bar dataKey="taskCount" name="Tasks" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No data available for the selected period or stage
                        </div>
                    )}
                </div>
            </div>

            {/* Team Members Grid - Grouped by Stage */}
            <div className="p-5 bg-white border shadow-sm rounded-xl">
                <h2 className="mb-4 text-lg font-bold">Team Members by Stage</h2>
                {Object.keys(usersByStage).length > 0 ? (
                    Object.entries(usersByStage)
                        .sort(([stageA], [stageB]) => (STAGE_PRIORITY[stageA] || 999) - (STAGE_PRIORITY[stageB] || 999))
                        .map(([stage, users]) => (
                            <div key={stage} className="mb-6">
                                <h3 className="mb-3 text-md font-semibold text-gray-700 border-b pb-2">
                                    {formatStageName(stage)} ({users.length} members)
                                </h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {users.map((user, index) => (
                                        <div key={`${user.id}-${stage}`} className="flex items-center gap-3 p-4 border rounded-lg shadow-sm">
                                            <div
                                                className="flex items-center justify-center w-12 h-12 font-bold text-white rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            >
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{user.fullName}</div>
                                                <div className="text-xs text-gray-500 mb-1">Stage: {formatStageName(stage)}</div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-sm text-gray-500">Tasks:</span>
                                                    <span className="font-semibold text-sm">{user.taskCount}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-sm text-gray-500">Assigned:</span>
                                                    <span className="font-semibold text-sm">{formatHours(user.totalAssignedHours)}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-sm text-gray-500">Worked:</span>
                                                    <span className="font-semibold text-sm">{formatHours(user.totalWorkedHours)}</span>
                                                </div>
                                                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-blue-600 h-1.5 rounded-full"
                                                        style={{
                                                            width: `${user.totalAssignedHours > 0
                                                                    ? Math.min((parseFloat(user.totalWorkedHours) / user.totalAssignedHours) * 100, 100)
                                                                    : 0
                                                                }%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-600">No team members found</h3>
                        <p className="text-gray-500 mt-1">No team members have tasks assigned during the selected date range or stage.</p>
                    </div>
                )}
            </div>

            {/* Summary Statistics */}
            <div className="p-5 bg-white border shadow-sm rounded-xl">
                <h2 className="mb-4 text-lg font-bold">Stage Distribution Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(usersByStage)
                        .sort(([stageA], [stageB]) => (STAGE_PRIORITY[stageA] || 999) - (STAGE_PRIORITY[stageB] || 999))
                        .map(([stage, users]) => (
                            <div key={stage} className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium text-sm">{formatStageName(stage)}</div>
                                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                                <div className="text-xs text-gray-500">
                                    {users.reduce((sum, user) => sum + user.taskCount, 0)} tasks |{" "}
                                    {formatHours(users.reduce((sum, user) => sum + parseFloat(user.totalWorkedHours), 0))} worked
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Team;