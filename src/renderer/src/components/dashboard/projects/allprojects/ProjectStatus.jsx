/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from "react-redux"
import { Users, AlertCircle, X, Calendar, BarChart2, PieChart, Filter, ChevronDown, ChevronUp } from 'lucide-react'
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
import { useMemo, useState, useCallback, useEffect } from "react"
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

const ProjectStatus = ({ projectId, onClose }) => {
  const [selectedView, setSelectedView] = useState("all")
  const [hoveredTask, setHoveredTask] = useState(null)
  const [expandedTypes, setExpandedTypes] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [visibleTaskCount, setVisibleTaskCount] = useState(20)
  const [activeTab, setActiveTab] = useState("overview")

  const projectData = useSelector((state) => state?.projectData.projectData.find((project) => project.id === projectId))
  const taskData = useSelector((state) => state.taskData.taskData)
  const userData = useSelector((state) => state.userData.staffData)

  const projectTasks = useMemo(() => taskData.filter((task) => task.project_id === projectId), [taskData, projectId])

  const parseDuration = (duration) => {
    if (!duration || typeof duration !== "string") return 0
    const [h, m, s] = duration.split(":").map(Number)
    return h + m / 60 + s / 3600
  }

  const calculateHours = (type) => {
    const tasks = projectTasks.filter((task) => task.name.startsWith(type))
    return {
      assigned: tasks.reduce((sum, task) => sum + parseDuration(task.duration), 0),
      taken: tasks.reduce(
        (sum, task) =>
          sum + (task?.workingHourTask?.reduce((innerSum, innerTask) => innerSum + (Number(innerTask.duration) || 0), 0) || 0),
        0,
      ), // taken is already in hours
    }
  }

  const taskTypes = {
    MODELING: calculateHours("MODELING"),
    MC: calculateHours("MC"),
    DETAILING: calculateHours("DETAILING"),
    DC: calculateHours("DC"),
    ERECTION: calculateHours("ERECTION"),
    EC: calculateHours("EC"),
    OTHERS: calculateHours("OTHERS"),
  }

  const totalAssignedHours = Object.values(taskTypes).reduce((sum, type) => sum + type?.assigned, 0)

  const formatHours = (hours) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const formatMinutesToHours = (minutes) => {
    if (!minutes) return "0h 0m"
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }

  const userContributions = userData
    .map((user) => {
      const userTasks = projectTasks?.filter((task) => task.user?.id === user.id)
      return {
        name: user.f_name,
        taskCount: userTasks.length,
      }
    })
    .filter((user) => user.taskCount > 0)
    .sort((a, b) => b.taskCount - a.taskCount)

  // Prepare data for Gantt chart
  const ganttData = useMemo(() => {
    return projectTasks.map((task) => {
      const startDate = new Date(task.start_date)
      const endDate = new Date(task.due_date)
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      const type = task.name.split(" ")[0] // Assuming first word is the type

      // Extract assigned and taken hours
      const assignedHours = parseDuration(task.duration)
      const takenHours = task?.workingHourTask?.reduce((sum, innerTask) => sum + innerTask.duration, 0) || 0

      // Calculate progress percentage
      let progress = assignedHours ? Math.min((takenHours / assignedHours) * 100, 100) : 0

      // Override progress based on status
      if (task.status === "IN_REVIEW") {
        progress = 80
      } else if (task.status === "COMPLETE") {
        progress = 100
      } 
      // Ensure progress does not exceed 80% when in progress or break
      if ((task.status === "IN_PROGRESS" || task.status === "BREAK") && progress > 80) {
        progress 
      }

      return {
        id: task.id,
        name: task.name,
        username: `${task.user?.f_name || ''} ${task.user?.l_name || ''}`.trim() || "Unassigned",
        type,
        startDate,
        endDate,
        duration,
        progress: Math.round(progress), // Ensure it's rounded
        status: task.status,
      }
    })
  }, [projectTasks]); // Removed parseDuration as a dependency

  // Filter tasks based on search, status, and type
  const filteredGanttData = useMemo(() => {
    let filtered = [...ganttData]
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        task => 
          task.name.toLowerCase().includes(lowerSearchTerm) || 
          task.username.toLowerCase().includes(lowerSearchTerm)
      )
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(task => task.status === filterStatus)
    }
    
    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(task => task.type === filterType)
    }
    
    // Apply view filter (week, month, all)
    if (selectedView === "week") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const oneWeekAhead = new Date()
      oneWeekAhead.setDate(oneWeekAhead.getDate() + 7)
      
      filtered = filtered.filter(
        task => 
          (task.startDate >= oneWeekAgo && task.startDate <= oneWeekAhead) || 
          (task.endDate >= oneWeekAgo && task.endDate <= oneWeekAhead)
      )
    } else if (selectedView === "month") {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      const oneMonthAhead = new Date()
      oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1)
      
      filtered = filtered.filter(
        task => 
          (task.startDate >= oneMonthAgo && task.startDate <= oneMonthAhead) || 
          (task.endDate >= oneMonthAgo && task.endDate <= oneMonthAhead)
      )
    }
    
    return filtered
  }, [ganttData, searchTerm, filterStatus, filterType, selectedView])

  // Group filtered tasks by type
  const filteredGroupedTasks = useMemo(() => {
    return filteredGanttData.reduce((acc, task) => {
      if (!acc[task.type]) acc[task.type] = []
      acc[task.type].push(task)
      return acc
    }, {})
  }, [filteredGanttData])

  // Initialize expandedTypes state when task types change
  useEffect(() => {
    const types = Object.keys(filteredGroupedTasks)
    const initialExpandedState = {}
    types.forEach(type => {
      // If we already have a state for this type, keep it, otherwise default to expanded
      initialExpandedState[type] = expandedTypes[type] !== undefined ? expandedTypes[type] : true
    })
    setExpandedTypes(initialExpandedState)
  }, [filteredGroupedTasks, setExpandedTypes]); // Added setExpandedTypes as a dependency


  const timelineWidth = 1000
  const rowHeight = 40
  const today = new Date()

  // Find the earliest and latest dates
  const { minDate, maxDate, totalDays, totalMonths } = useMemo(() => {
    if (filteredGanttData.length === 0) {
      const today = new Date()
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      return { 
        minDate: today, 
        maxDate: nextMonth, 
        totalDays: 30 
      }
    }

    const dates = filteredGanttData.reduce((acc, task) => {
      acc.push(task.startDate, task.endDate)
      return acc
    }, [])
    
    const min = new Date(Math.min(...dates))
    const max = new Date(Math.max(...dates))
    
    // Add some padding to the date range
    min.setDate(min.getDate() - 2)
    max.setDate(max.getDate() + 2)
    
    const totalMonths = (max.getFullYear() - min.getFullYear()) * 12 + (max.getMonth() - min.getMonth()) + 1

    return { 
      minDate: min, 
      maxDate: max, 
      totalDays: Math.ceil((max - min) / (1000 * 60 * 60 * 24)),
      totalMonths
    }
  }, [filteredGanttData])

  // Format date to display in a more readable way
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Enhanced getPositionAndWidth to handle date calculations
  const getPositionAndWidth = useCallback((start, end) => {
    const left = ((start - minDate) / (1000 * 60 * 60 * 24)) * (timelineWidth / totalDays)
    const width = Math.max(((end - start) / (1000 * 60 * 60 * 24)) * (timelineWidth / totalDays), 30) // Minimum width of 30px for better visibility
    return { left, width }
  }, [minDate, totalDays]); // Removed timelineWidth from dependencies

  // Calculate month divisions for the timeline header
  const monthDivisions = useMemo(() => {
    const months = []
    const currentDate = new Date(minDate)

    while (currentDate <= maxDate) {
      const monthStart = new Date(currentDate)
      currentDate.setMonth(currentDate.getMonth() + 1)
      const monthEnd = new Date(Math.min(currentDate.getTime(), maxDate.getTime()))

      const { left } = getPositionAndWidth(monthStart, monthStart)
      const { width } = getPositionAndWidth(monthStart, monthEnd)

      months.push({
        label: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        left,
        width,
      })
    }
    return months
  }, [minDate, maxDate, getPositionAndWidth])

  const typeColors = {
    MODELING: "#3b82f6", // blue-500
    MC: "#1d4ed8", // blue-700
    DETAILING: "#22c55e", // green-500
    DC: "#15803d", // green-700
    ERECTION: "#a855f7", // purple-500
    EC: "#7e22ce", // purple-700
    OTHERS: "#f59e0b", // amber-500
  }

  // Status colors
  const statusColors = {
    "IN_PROGRESS": "#fbbf24", // amber-400
    "IN_REVIEW": "#60a5fa", // blue-400
    "COMPLETE": "#34d399", // emerald-400
    "ASSIGNED": "#d1d5db", // gray-300
  }

  // Prepare data for pie chart
  const statusData = useMemo(() => {
    return Object.entries(
      projectTasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      }, {})
    ).map(([status, count]) => ({
      name: status,
      value: count,
    }))
  }, [projectTasks])

  // Prepare data for task type breakdown
  const taskTypeData = useMemo(() => {
    return Object.entries(taskTypes).map(([type, hours]) => ({
      name: type,
      assigned: hours.assigned,
      taken: hours.taken / 60, // Convert minutes to hours for comparison
    }))
  }, [taskTypes])

  // COLORS for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  // Get all unique statuses for filter dropdown
  const uniqueStatuses = useMemo(() => {
    return [...new Set(ganttData.map(task => task.status))]
  }, [ganttData])

  // Get all unique types for filter dropdown
  const uniqueTypes = useMemo(() => {
    return [...new Set(ganttData.map(task => task.type))]
  }, [ganttData])

  // Calculate total tasks for each type
  const typeTaskCounts = useMemo(() => {
    return ganttData.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1
      return acc
    }, {})
  }, [ganttData])

  // Function to toggle expansion of a task type
  const toggleTypeExpansion = (type) => {
    setExpandedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  // Function to load more tasks
  const loadMoreTasks = () => {
    setVisibleTaskCount(prev => prev + 20)
  }

  // Virtualized row renderer for timeline
  const TaskRow = ({ index, style, data }) => {
    const task = data[index]
    const { left, width } = getPositionAndWidth(
      task.startDate,
      new Date(task.endDate.getTime() + 24 * 60 * 60 * 1000) // Add one day to end date
    )

    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          transition: 'background-color 0.2s',
          backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white'
        }}
        className="hover:bg-gray-100"
      >
        <div className="w-52 flex-shrink-0 truncate px-2 font-medium">
          {task.username}
        </div>
        <div className="flex-1 relative">
          <div
            className="absolute z-0 h-6 rounded-md overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{
              left: `${left}px`,
              width: `${width}px`,
              top: "8px",
              backgroundColor: typeColors[task.type] || "#ccc",
            }}
            onMouseEnter={() => setHoveredTask(task)}
            onMouseLeave={() => setHoveredTask(null)}
          >
            <div className="h-full bg-white bg-opacity-30" style={{ width: `${task.progress}%` }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white drop-shadow-sm">{task.progress}%</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Flatten the grouped tasks for virtualization
  const flattenedTasks = useMemo(() => {
    const flattened = []
    Object.entries(filteredGroupedTasks).forEach(([type, tasks]) => {
      if (expandedTypes[type]) {
        tasks.forEach(task => flattened.push(task))
      }
    })
    return flattened
  }, [filteredGroupedTasks, expandedTypes])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
        {/* Header with improved styling */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3 md:mb-0">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 md:px-5 md:py-3 text-lg md:text-xl font-bold rounded-lg shadow-md">
              {projectData?.name || "Unknown Project"}
            </div>
            <span className="text-gray-500 text-xs md:text-sm">
              {formatDate(minDate)} - {formatDate(maxDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              Filters {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button> */}
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Search tasks or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Task Type
              </label>
              <select
                id="type"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="view" className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedView === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedView("all")}
                >
                  All
                </button>
                <button
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedView === "week" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedView("week")}
                >
                  Week
                </button>
                <button
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedView === "month" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedView("month")}
                >
                  Month
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "overview" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "timeline" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("timeline")}
            >
              Timeline
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "team" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("team")}
            >
              Team
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Tasks</h3>
                <p className="text-3xl font-bold">{projectTasks.length}</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Completed</h3>
                <p className="text-3xl font-bold text-green-600">
                  {projectTasks.filter((task) => task.status === "COMPLETE").length}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-green-600 h-1.5 rounded-full" 
                    style={{ 
                      width: `${(projectTasks.filter((task) => task.status === "COMPLETE").length / projectTasks.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Team Members</h3>
                <p className="text-3xl font-bold">{userContributions.length}</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Hours</h3>
                <p className="text-3xl font-bold">{formatHours(totalAssignedHours)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Project Overview Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm border border-blue-100">
                <h2 className="flex items-center gap-2 text-lg font-bold mb-4 text-blue-800">
                  <AlertCircle className="h-5 w-5" /> Project Overview
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Tasks:</span>
                    <span className="font-semibold text-lg">{projectTasks.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-semibold text-lg text-green-600">
                      {projectTasks.filter((task) => task.status === "COMPLETE").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">In Review:</span>
                    <span className="font-semibold text-lg text-blue-500">
                      {projectTasks.filter((task) => task.status === "IN_REVIEW").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">In Break:</span>
                    <span className="font-semibold text-lg text-amber-500">
                      {projectTasks.filter((task) => task.status === "BREAK").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">In Progress:</span>
                    <span className="font-semibold text-lg text-amber-500">
                      {projectTasks.filter((task) => task.status === "IN_PROGRESS").length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Not Started:</span>
                    <span className="font-semibold text-lg text-gray-500">
                      {projectTasks.filter((task) => task.status === "ASSIGNED").length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Distribution Pie Chart */}
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                  <PieChart className="h-5 w-5" /> Task Status Distribution
                </h2>
                <div className="h-[300px] text-sm">
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
                      <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Task Type Hours Comparison */}
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                  <BarChart2 className="h-5 w-5" /> Hours by Task Type
                </h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskTypeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => [`${value.toFixed(2)} hours`, ""]} labelStyle={{ color: "black" }} />
                      <Legend />
                      <Bar dataKey="assigned" name="Assigned Hours" fill="#8884d8" />
                      <Bar dataKey="taken" name="Hours Taken" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
              

            {/* User Contributions Chart with improved styling */}
            <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
              <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                <Users className="h-5 w-5" /> Team Contributions
              </h2>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userContributions}>
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
                      formatter={(value) => [`${value} tasks`, "Task Count"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                      labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
                    />
                    <Bar dataKey="taskCount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
       <div className="bg-white rounded-xl p-5 shadow-md border mb-6">
       <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
         <Calendar className="h-5 w-5 text-gray-700" /> Project Timeline
       </h2>
     
       {/* Task Legend */}
       <div className="flex flex-wrap gap-3 mb-4">
         {Object.entries(typeColors).map(([type, color]) => (
           <div key={type} className="flex items-center gap-2">
             <div className="w-4 h-4 rounded-md" style={{ backgroundColor: color }}></div>
             <span className="text-sm text-gray-700 font-medium">{type}</span>
           </div>
         ))}
       </div>
     
       {/* Task Count Summary */}
       <div className="mb-4 text-sm text-gray-600">
         Showing <b>{filteredGanttData.length}</b> of <b>{ganttData.length}</b> tasks
       </div>
     
       <div className="overflow-x-auto w-full">
         <div style={{ width: `${timelineWidth + 300}px` }} className="relative">
     
           {/* Timeline Header */}
           <div className="flex border-b sticky top-0 bg-white shadow-md z-10">
             <div className="w-60 flex-shrink-0 font-bold p-3 bg-gray-50 text-gray-700">Task Name</div>
             <div className="flex-1 relative">
     
               {/* Month Divisions */}
               <div className="h-10 border-b bg-gray-50 flex">
                 {monthDivisions.map((month, i) => (
                   <div key={i} className="flex items-center justify-center text-gray-600 text-sm font-semibold border-l border-gray-300"
                        style={{ width: `${timelineWidth / totalMonths}px` }}>
                     {month.label}
                   </div>
                 ))}
               </div>
     
               {/* Date Axis */}
               <div className="absolute left-0 right-0 border-b">
                 {Array.from({ length: Math.min(totalDays + 1, 60) }).map((_, i) => {
                   const date = new Date(minDate);
                   date.setDate(date.getDate() + i);
                   const isToday = date.toDateString() === today.toDateString();
     
                   return (
                     <div key={i} className={`absolute border-l text-xs text-center ${isToday ? "border-red-500" : "border-gray-200"}`}
                          style={{ left: `${(i * timelineWidth) / totalDays}px`, width: `${timelineWidth / totalDays}px`, height: "25px" }}>
                       {i % 2 === 0 && (
                         <span className={`text-xs ${isToday ? "text-red-600 font-semibold" : "text-gray-600"}`}>
                           {date.getDate()}
                         </span>
                       )}
                     </div>
                   );
                 })}
               </div>
             </div>
           </div>
     
           {/* Today Indicator */}
           {minDate <= today && today <= maxDate && (
             <div className="absolute top-10 bottom-0 border-l-2 border-red-500 z-20"
                  style={{ left: `${((today - minDate) / (1000 * 60 * 60 * 24)) * (timelineWidth / totalDays) + 130}px` }}>
               <div className="bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg transform -translate-x-1/2">
                 Today
               </div>
             </div>
           )}
     
           {/* Render Grouped Tasks */}
           {Object.keys(filteredGroupedTasks).length > 0 ? (
             Object.keys(filteredGroupedTasks).map((type) => (
               <div key={type} className="mt-5 w-full">
                 <div className="text-lg font-semibold p-3 bg-gray-100 rounded-md border-b-2 flex justify-between items-center cursor-pointer"
                      style={{ borderColor: typeColors[type] || "#ccc" }}
                      onClick={() => toggleTypeExpansion(type)}>
                   <div className="flex items-center gap-2">
                     <h3>{type}</h3>
                     <span className="text-sm text-gray-600">({filteredGroupedTasks[type].length} tasks)</span>
                   </div>
                   {expandedTypes[type] ? (
                     <ChevronUp className="h-5 w-5 text-gray-500" />
                   ) : (
                     <ChevronDown className="h-5 w-5 text-gray-500" />
                   )}
                 </div>
     
                 {expandedTypes[type] && (
                   <div style={{ height: `${Math.min(filteredGroupedTasks[type].length * rowHeight, 200)}px` }}>
                     <AutoSizer>
                       {({ height, width }) => (
                         <List
                           height={height}
                           itemCount={filteredGroupedTasks[type].length}
                           itemSize={rowHeight}
                           width={width}
                           itemData={filteredGroupedTasks[type]}
                         >
                           {TaskRow}
                         </List>
                       )}
                     </AutoSizer>
                   </div>
                 )}
               </div>
             ))
           ) : (
             <div className="py-10 text-center text-gray-500">No tasks match the current filters</div>
           )}
         </div>
       </div>
     </div>
     
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <>
            <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
              <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                <Users className="h-5 w-5" /> Team Contributions
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userContributions} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80}
                      tick={{ fontSize: 14 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} tasks`, "Tasks Assigned"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    />
                    <Bar dataKey="taskCount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Members Grid */}
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h2 className="text-lg font-bold mb-4">Team Members</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {userContributions.map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg shadow-sm">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        {user.taskCount} {user.taskCount === 1 ? 'task' : 'tasks'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Task details tooltip */}
        {hoveredTask && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="bg-white rounded-lg shadow-xl border p-4 max-w-md">
              <h3 className="font-bold text-lg mb-2">{hoveredTask.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Assigned to:</div>
                <div className="font-medium">{hoveredTask.username || "Unassigned"}</div>

                <div className="text-gray-600">Timeline:</div>
                <div className="font-medium">
                  {formatDate(hoveredTask.startDate)} - {formatDate(hoveredTask.endDate)}
                </div>

                <div className="text-gray-600">Duration:</div>
                <div className="font-medium">{hoveredTask.duration} days</div>

                <div className="text-gray-600">Status:</div>
                <div className="font-medium">
                  <span
                    className="inline-block px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: statusColors[hoveredTask.status] || "#ccc",
                      color: hoveredTask.status === "ASSIGNED" ? "#333" : "#fff",
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
                        backgroundColor: statusColors[hoveredTask.status] || "#ccc",
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
  )
}

export default ProjectStatus
