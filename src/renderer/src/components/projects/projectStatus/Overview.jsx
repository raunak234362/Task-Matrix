/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client"

import { useMemo } from "react"
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
} from "lucide-react"
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
} from "recharts"

// Custom UI components since component/ui is not available
const Card = ({ children, className = "" }) => (
  <div className={`p-4 bg-white border shadow-sm rounded-xl ${className}`}>{children}</div>
)

const ProgressBar = ({ value, max, className = "" }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0
  return (
    <div className={`w-full bg-gray-200 rounded-full h-1.5 mt-2 ${className}`}>
      <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
  )
}

const Overview = ({ projectData, projectTasks, userContributions, dateFilter }) => {
  // Helper function to parse duration strings (HH:MM:SS) to hours
  const parseDuration = (duration) => {
    if (!duration || typeof duration !== "string") return 0
    const [h, m, s] = duration.split(":").map(Number)
    return h + m / 60 + s / 3600
  }

  // Format hours to display in a more readable way (5h 30m)
  const formatHours = (hours) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  // Filter tasks based on date filter
  const filteredTasks = useMemo(() => {
    if (!dateFilter || dateFilter.type === "all") {
      return projectTasks
    }

    return projectTasks.filter((task) => {
      // Convert dates to timestamps for comparison
      const taskStartDate = new Date(task.start_date).getTime()
      const taskEndDate = new Date(task.due_date).getTime()

      if (dateFilter.type === "week" && dateFilter.weekStart && dateFilter.weekEnd) {
        const weekStart = dateFilter.weekStart
        const weekEnd = dateFilter.weekEnd

        return (
          (taskStartDate >= weekStart && taskStartDate <= weekEnd) ||
          (taskEndDate >= weekStart && taskEndDate <= weekEnd) ||
          (taskStartDate <= weekStart && taskEndDate >= weekEnd)
        )
      }

      if (dateFilter.type === "month" && dateFilter.year !== undefined && dateFilter.month !== undefined) {
        const monthStart = new Date(dateFilter.year, dateFilter.month, 1).getTime()
        const monthEnd = new Date(dateFilter.year, dateFilter.month + 1, 0, 23, 59, 59).getTime()

        return (
          (taskStartDate >= monthStart && taskStartDate <= monthEnd) ||
          (taskEndDate >= monthStart && taskEndDate <= monthEnd) ||
          (taskStartDate <= monthStart && taskEndDate >= monthEnd)
        )
      }

      if (dateFilter.type === "year" && dateFilter.year !== undefined) {
        const yearStart = new Date(dateFilter.year, 0, 1).getTime()
        const yearEnd = new Date(dateFilter.year, 11, 31, 23, 59, 59).getTime()

        return (
          (taskStartDate >= yearStart && taskStartDate <= yearEnd) ||
          (taskEndDate >= yearStart && taskEndDate <= yearEnd) ||
          (taskStartDate <= yearStart && taskEndDate >= yearEnd)
        )
      }

      if (
        dateFilter.type === "range" &&
        dateFilter.year !== undefined &&
        dateFilter.startMonth !== undefined &&
        dateFilter.endMonth !== undefined
      ) {
        const rangeStart = new Date(dateFilter.year, dateFilter.startMonth, 1).getTime()
        const rangeEnd = new Date(dateFilter.year, dateFilter.endMonth + 1, 0, 23, 59, 59).getTime()

        return (
          (taskStartDate >= rangeStart && taskStartDate <= rangeEnd) ||
          (taskEndDate >= rangeStart && taskEndDate <= rangeEnd) ||
          (taskStartDate <= rangeStart && taskEndDate >= rangeEnd)
        )
      }

      return true
    })
  }, [projectTasks, dateFilter])

  // Calculate hours for each task type
  const calculateHours = (type) => {
    const tasks = filteredTasks.filter((task) => task.name.startsWith(type))

    return {
      assigned: tasks.reduce((sum, task) => sum + parseDuration(task.duration), 0),
      taken: tasks.reduce(
        (sum, task) =>
          sum +
          (task?.workingHourTask?.reduce((innerSum, innerTask) => innerSum + (Number(innerTask.duration) || 0), 0) ||
            0),
        0,
      ), // taken is already in hours
    }
  }

  // Calculate hours for each task type
  const taskTypes = {
    MODELING: calculateHours("MODELING"),
    MC: calculateHours("MC"),
    DETAILING: calculateHours("DETAILING"),
    DC: calculateHours("DC"),
    ERECTION: calculateHours("ERECTION"),
    EC: calculateHours("EC"),
    DESIGNING: calculateHours("DESIGNING"),
    DESIGNCHECKING: calculateHours("DWG_CHECKING"),
    OTHERS: calculateHours("OTHERS"),
  }

  // Calculate total hours
  const totalTakenHours = Object.values(taskTypes).reduce((sum, type) => sum + type.taken / 60, 0)

  const totalAssignedHours = projectData.estimatedHours || 0
  const assignedHour = Object.values(taskTypes).reduce((sum, type) => sum + type?.assigned, 0)
  
  // Pie chart: task status distribution
  const statusData = useMemo(() => {
    return Object.entries(
      filteredTasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      }, {}),
    ).map(([status, count]) => ({
      name: status,
      value: count,
    }))
  }, [filteredTasks])

  // Task types: breakdown
  const taskTypeData = useMemo(() => {
    return Object.entries(taskTypes)
      .filter(([_, hours]) => hours.assigned > 0 || hours.taken > 0) // Only show types with hours
      .map(([type, hours]) => ({
        name: type,
        assigned: hours.assigned,
        taken: hours.taken / 60,
      }))
      .sort((a, b) => b.assigned + b.taken - (a.assigned + a.taken)) // Sort by total hours
  }, [userContributions, projectTasks, dateFilter])

  // Filter and sort user contributions
  const filteredUserContributions = useMemo(() => {
    return [...userContributions]
      .filter((user) => {
        // Filter users who have tasks in the filtered period
        const userTasks = filteredTasks.filter(
          (task) => task.assignedTo === user.id || task.workingHourTask?.some((wht) => wht.userId === user.id),
        )
        return userTasks.length > 0
      })
      .sort((a, b) => b.taskCount - a.taskCount) // Sort by task count
  }, [userContributions, filteredTasks])

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
  ]

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <div className="flex items-center">
            <LayoutList className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
          </div>
          <p className="text-3xl font-bold">{filteredTasks.length}</p>
        </Card>

        <Card>
          <div className="flex items-center">
            <ClipboardCheck className="h-5 w-5 text-green-700 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {filteredTasks.filter((task) => task.status === "COMPLETE").length}
          </p>
          <ProgressBar
            value={filteredTasks.filter((task) => task.status === "COMPLETE").length}
            max={filteredTasks.length}
          />
        </Card>

        <Card>
          <div className="flex items-center">
            <UsersRound className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
          </div>
          <p className="text-3xl font-bold">{filteredUserContributions.length}</p>
        </Card>

        <Card>
          <div className="flex items-center">
            <Hourglass className="h-5 w-5 text-gray-800 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
          </div>
          <p className="text-3xl font-bold">{formatHours(totalAssignedHours)}</p>
        </Card>

        <Card>
          <div className="flex items-center">
            <Timer className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Approval Hours</h3>
          </div>
          <p className="text-3xl font-bold">{formatHours(totalAssignedHours * 0.8)}</p>
        </Card>

        <Card>
          <div className="flex items-center">
            <Timer className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Fabrication Hours</h3>
          </div>
          <p className="text-3xl font-bold">{formatHours(totalAssignedHours * 0.2)}</p>
        </Card>

        <Card>
          <div className="flex items-center">
            <Timer className="h-5 w-5 text-gray-700 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Total Assigned Hours</h3>
          </div>
          <p className="text-3xl font-bold">{formatHours(assignedHour)}</p>
        </Card>

        <Card>
          <div className="flex items-center">
            <Timer className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Total-Time Taken</h3>
          </div>
          <p className="text-3xl font-bold">{formatHours(totalTakenHours)}</p>
        </Card>

        <Card>
          <div className="flex items-center">
            <Target className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Project Approval Efficiency</h3>
          </div>
          <p className="text-3xl font-bold">
            {assignedHour && totalTakenHours > 0 ? Math.round(((assignedHour * 0.7) / totalTakenHours) * 100) : 0} %
          </p>
        </Card>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
        {/* Project Overview Card */}
        <div className="p-5 border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-blue-800">
            <AlertCircle className="w-5 h-5" /> Project Overview
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Tasks:</span>
              <span className="text-lg font-semibold">{filteredTasks.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="text-lg font-semibold text-green-600">
                {filteredTasks.filter((task) => task.status === "COMPLETE").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">In Review:</span>
              <span className="text-lg font-semibold text-blue-500">
                {filteredTasks.filter((task) => task.status === "IN_REVIEW").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">In Break:</span>
              <span className="text-lg font-semibold text-amber-500">
                {filteredTasks.filter((task) => task.status === "BREAK").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">In Progress:</span>
              <span className="text-lg font-semibold text-amber-500">
                {filteredTasks.filter((task) => task.status === "IN_PROGRESS").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Not Started:</span>
              <span className="text-lg font-semibold text-gray-500">
                {filteredTasks.filter((task) => task.status === "ASSIGNED").length}
              </span>
            </div>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="p-5 bg-white border shadow-sm rounded-xl">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
            <PieChart className="w-5 h-5" /> Task Status Distribution
          </h2>
          <div className="h-[300px] text-sm">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} tasks`, "Count"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "10px",
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available for the selected period
              </div>
            )}
          </div>
        </div>

        {/* Task Type Hours Comparison */}
        <div className="p-5 bg-white border shadow-sm rounded-xl">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
            <BarChart2 className="w-5 h-5" /> Hours by Task Type
          </h2>
          <div className="h-[300px] w-full">
            {taskTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value) => [`${value.toFixed(2)} hours`, ""]}
                    labelStyle={{ color: "black" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "10px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="assigned" name="Assigned Hours" fill="#8884d8" />
                  <Bar dataKey="taken" name="Hours Taken" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available for the selected period
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Contributions Chart with improved styling */}
      <div className="p-5 mb-6 bg-white border shadow-sm rounded-xl">
        <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
          <UsersRound className="w-5 h-5" /> Team Contributions
        </h2>
        <div className="h-[250px]">
          {filteredUserContributions.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredUserContributions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{
                    value: "Tasks",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    if (name === "taskCount") return [`${value} tasks`, "Task Count"]
                    if (name === "assignedHours") return [`${value.toFixed(2)} hours`, "Assigned Hours"]
                    if (name === "workedHours") return [`${value.toFixed(2)} hours`, "Worked Hours"]
                    return [value, name]
                  }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "10px",
                  }}
                  labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
                />
                <Legend />
                <Bar dataKey="taskCount" name="Task Count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                {/* Add these bars if your data has these properties */}
                {filteredUserContributions[0]?.assignedHours !== undefined && (
                  <Bar
                    dataKey="assignedHours"
                    name="Assigned Hours"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                )}
                {filteredUserContributions[0]?.workedHours !== undefined && (
                  <Bar dataKey="workedHours" name="Worked Hours" fill="#82ca9d" radius={[4, 4, 0, 0]} barSize={40} />
                )}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No user contribution data available for the selected period
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Overview
