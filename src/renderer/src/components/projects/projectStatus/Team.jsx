/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"

import { useMemo } from "react"
import { Users, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const Team = ({ userContributions, dateFilter, projectTasks, userData }) => {
    // COLORS for user cards
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

    // Helper function to parse duration strings
    const parseDuration = (duration) => {
        if (!duration || typeof duration !== "string") return 0
        const [h, m, s] = duration.split(":").map(Number)
        return h + m / 60 + s / 3600
    }

    // Apply date filtering to tasks
    const filteredTasks = useMemo(() => {
        if (dateFilter.type === "all") {
            return projectTasks
        }

        return projectTasks.filter((task) => {
            const taskStartDate = new Date(task.start_date).getTime()
            const taskEndDate = new Date(task.due_date).getTime()

            if (dateFilter.type === "week" && dateFilter.weekStart && dateFilter.weekEnd) {
                return (
                    (taskStartDate >= dateFilter.weekStart && taskStartDate <= dateFilter.weekEnd) ||
                    (taskEndDate >= dateFilter.weekStart && taskEndDate <= dateFilter.weekEnd) ||
                    (taskStartDate <= dateFilter.weekStart && taskEndDate >= dateFilter.weekEnd)
                )
            }

            if (dateFilter.type === "month") {
                const filterStartDate = new Date(dateFilter.year, dateFilter.month, 1).getTime()
                const filterEndDate = new Date(dateFilter.year, dateFilter.month + 1, 0).getTime()

                return (
                    (taskStartDate >= filterStartDate && taskStartDate <= filterEndDate) ||
                    (taskEndDate >= filterStartDate && taskEndDate <= filterEndDate) ||
                    (taskStartDate <= filterStartDate && taskEndDate >= filterEndDate)
                )
            }

            if (dateFilter.type === "year") {
                const filterStartDate = new Date(dateFilter.year, 0, 1).getTime()
                const filterEndDate = new Date(dateFilter.year, 11, 31).getTime()

                return (
                    (taskStartDate >= filterStartDate && taskStartDate <= filterEndDate) ||
                    (taskEndDate >= filterStartDate && taskEndDate <= filterEndDate) ||
                    (taskStartDate <= filterStartDate && taskEndDate >= filterEndDate)
                )
            }

            if (dateFilter.type === "range") {
                const filterStartDate = new Date(dateFilter.year, dateFilter.startMonth, 1).getTime()
                const filterEndDate = new Date(dateFilter.year, dateFilter.endMonth + 1, 0).getTime()

                return (
                    (taskStartDate >= filterStartDate && taskStartDate <= filterEndDate) ||
                    (taskEndDate >= filterStartDate && taskEndDate <= filterEndDate) ||
                    (taskStartDate <= filterStartDate && taskEndDate >= filterEndDate)
                )
            }

            return true
        })
    }, [projectTasks, dateFilter])

    // Calculate filtered user contributions based on the date filter
    const filteredUserContributions = useMemo(() => {
        return userData
            .map((user) => {
                const userTasks = filteredTasks.filter((task) => task.user?.id === user.id)
                const totalWorkingHourTasks = userTasks.reduce((sum, task) => {
                    const taskDuration =
                        task.workingHourTask?.reduce((innerSum, innerTask) => innerSum + (innerTask.duration || 0), 0) || 0
                    return sum + taskDuration
                }, 0)
                
                return {
                    id: user.id,
                    name: user.f_name,
                    fullName: `${user.f_name} ${user.l_name}`.trim(),
                    taskCount: userTasks.length,
                    totalAssignedHours: userTasks.reduce((sum, task) => sum + parseDuration(task.duration), 0),
                    totalWorkedHours: (totalWorkingHourTasks / 60).toFixed(2),
                }
            })
            .filter((user) => user.taskCount > 0)
            .sort((a, b) => b.taskCount - a.taskCount)
    }, [userData, filteredTasks])

    // Format hours to display in a more readable way
    const formatHours = (hours) => {
        if (isNaN(hours)) return "0h 0m"
        const h = Math.floor(parseFloat(hours))
        const m = Math.round((parseFloat(hours) - h) * 60)
        return `${h}h ${m}m`
    }

    return (
        <>
            {/* DateFilter indicator */}
            {dateFilter.type !== "all" && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                    <span className="font-medium">Note:</span> Showing team data filtered by selected date range. 
                    Total tasks: {filteredTasks.length} | Team members: {filteredUserContributions.length}
                </div>
            )}

            {/* Team contribution chart */}
            <div className="p-5 mb-6 bg-white border shadow-sm rounded-xl">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
                    <Users className="w-5 h-5" /> Team Contributions
                </h2>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={filteredUserContributions} 
                            layout="vertical" 
                            margin={{ left: 100 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 14 }} />
                            <Tooltip
                                formatter={(value, name) => {
                                    if (name === "taskCount") return [`${value} tasks`, "Tasks Assigned"]
                                    if (name === "totalWorkedHours") return [formatHours(value), "Hours Worked"]
                                    return [value, name]
                                }}
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
                </div>
            </div>

            {/* Hours worked chart */}
            {/* <div className="p-5 mb-6 bg-white border shadow-sm rounded-xl">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
                    <Clock className="w-5 h-5" /> Hours Contributed
                </h2>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={filteredUserContributions} 
                            layout="vertical" 
                            margin={{ left: 100 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 14 }} />
                            <Tooltip
                                formatter={(value) => [formatHours(value), "Hours"]}
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    padding: "10px",
                                }}
                            />
                            <Bar dataKey="totalAssignedHours" name="Assigned Hours" fill="#8884d8" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="totalWorkedHours" name="Hours Worked" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div> */}

            {/* Team Members Grid */}
            <div className="p-5 bg-white border shadow-sm rounded-xl">
                <h2 className="mb-4 text-lg font-bold">Team Members</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredUserContributions.map((user, index) => (
                        <div key={user.id || index} className="flex items-center gap-3 p-4 border rounded-lg shadow-sm">
                            <div
                                className="flex items-center justify-center w-12 h-12 font-bold text-white rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            >
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">{user.fullName || user.name}</div>
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
                                            width: `${Math.min((parseFloat(user.totalWorkedHours) / user.totalAssignedHours) * 100, 100)}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {filteredUserContributions.length === 0 && (
                <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium text-gray-600">No team members found</h3>
                    <p className="text-gray-500 mt-1">
                        No team members have tasks assigned during the selected date range.
                    </p>
                </div>
            )}
        </>
    )
}

export default Team