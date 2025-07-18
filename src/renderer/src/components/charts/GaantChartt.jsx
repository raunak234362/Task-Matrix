/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react'
import { addDays, format, differenceInDays, parseISO, isValid, isAfter } from 'date-fns'

const GanttChartt = ({ taskData }) => {
  const [data, setData] = useState([])
  const [filterProject, setFilterProject] = useState('All') // Project filter state
  const chartRef = useRef(null)

  // Loading state
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (taskData) {
      setData(taskData)
      setLoading(false) // Stop loading when data is available
    }
  }, [taskData])

  // Helper function to validate dates
  const isValidDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
      return false
    }
    const date = parseISO(dateString)
    return isValid(date)
  }

  // Find the earliest start date and latest end date across all tasks
  const findTimelineBounds = (tasks) => {
    let minStartDate = null
    let maxEndDate = null

    tasks?.forEach((taskGroup) => {
      taskGroup?.tasks?.forEach((task) => {
        const taskStartDate = parseISO(task.created_on)
        const taskEndDate = parseISO(task.due_date)

        if (isValidDate(task.created_on)) {
          if (!minStartDate || taskStartDate < minStartDate) {
            minStartDate = taskStartDate
          }
        }

        if (isValidDate(task.due_date)) {
          if (!maxEndDate || taskEndDate > maxEndDate) {
            maxEndDate = taskEndDate
          }
        }
      })
    })

    const today = new Date()
    const nextMonth = addDays(today, 30)

    // Extend the end date to one month from today if it's earlier than that
    if (!maxEndDate || isAfter(nextMonth, maxEndDate)) {
      maxEndDate = nextMonth
    }

    return { minStartDate: minStartDate || today, maxEndDate }
  }

  // Get the timeline boundaries
  const { minStartDate, maxEndDate } = findTimelineBounds(data)

  // Generate the full range of dates between the earliest start and latest end date
  const generateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return []
    const daysCount = differenceInDays(endDate, startDate) + 1
    return Array.from({ length: daysCount }, (_, i) => addDays(startDate, i))
  }

  const dateRange = generateDateRange(minStartDate, maxEndDate)

  // Get unique project names for the dropdown
  const uniqueProjects = Array.from(
    new Set(data.flatMap((taskGroup) => taskGroup.tasks.map((task) => task.project.name)))
  )

  // Filter team members based on the selected project
  const filteredTeam =
    filterProject === 'All'
      ? data // Show all team members for "All Projects"
      : data.filter((taskGroup) =>
          taskGroup.tasks.some((task) => task.project.name === filterProject)
        )

  const renderGanttChart = () => {
    return (
      <div className="relative border p-2 h-[65vh] overflow-y-auto border-gray-300 rounded-lg overflow-hidden shadow-md w-full">
        {/* Grid container for names and chart */}
        <div className="grid grid-cols-[250px_1fr]">
          {/* Sidebar with team member names */}
          <div className="bg-gray-700 z-10">
            <div className="h-8"></div>
            {filteredTeam?.map((taskGroup, index) => (
              <div
                key={taskGroup.id}
                className={`h-12 flex items-center px-2 font-medium text-sm text-gray-400 truncate bg-gray-200 border-b ${
                  index === filteredTeam.length - 1 ? '' : 'border-b border-gray-400'
                }`}
              >
                {taskGroup.name}
              </div>
            ))}
          </div>

          {/* Gantt Chart body */}
          <div className="overflow-x-auto" ref={chartRef}>
  {/* Sticky Date Row */}
  <div className="flex sticky top-0 items-center h-8 bg-gray-300 z-10">
    {dateRange.map((day, index) => (
      <div
        key={index}
        className="flex-grow justify-center items-center text-center text-xs text-gray-700 border-r border-gray-500"
      >
        {format(day, 'dd')}
      </div>
    ))}
  </div>

  <div className="min-w-full flex flex-col">
    {/* Team Members' Tasks */}
    {filteredTeam?.map((taskGroup, index) => (
      <div
        key={taskGroup.id}
        className={`flex justify-center h-12 relative ${
          index % 2 === 0 ? 'bg-white' : 'bg-gray-300'
        }`}
      >
        <div className="flex-grow relative">
          {/* Adding dividing lines between rows */}
          <div
            className={`absolute top-0 left-0 right-0 h-full ${
              index === filteredTeam.length - 1 ? '' : ' border-b border-gray-400'
            }`}
          />
          {taskGroup.tasks.map((task) => {
            if (!isValidDate(task?.created_on)) {
              return null // Skip tasks with invalid start dates
            }

            const taskStart = differenceInDays(parseISO(task.created_on), minStartDate)
            const taskDuration =
              differenceInDays(
                parseISO(task.due_date || addDays(parseISO(task.created_on), 30)),
                parseISO(task.created_on)
              ) + 1

            return (
                
              <div
                key={task.id}
                className={`absolute mt-1 h-10 rounded-lg flex items-center justify-center text-xs text-white font-medium ${
                  index % 2 === 0 ? 'bg-indigo-600' : 'bg-green-600'
                }`}
                style={{
                  left: `${(taskStart / dateRange.length) * 105}%`,
                  width: `${(taskDuration / dateRange.length) * 120}%`
                }}
                title={`${task.project.name} (${format(
                  parseISO(task.created_on),
                  'MMM dd'
                )} - ${
                  task.due_date
                    ? format(parseISO(task.due_date), 'MMM dd')
                    : 'No End Date'
                })`}
              >
                <span className="truncate px-2">{task.project.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
    )
  }

  const clearFilter = () => {
    setFilterProject('All')
  }

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-4">
        {/* <div className="text-lg font-semibold">
          Timeline:
          {loading
            ? 'Loading...'
            : taskData && taskData.length > 0
            ? (() => {
                let minStartDate = null
                let maxEndDate = null

                taskData.forEach((taskGroup) => {
                  const startDate = taskGroup?.tasks[0]?.project?.created_at
                  const endDate = taskGroup?.tasks[0]?.project?.endDate

                  if (isValidDate(startDate)) {
                    const parsedStartDate = parseISO(startDate)
                    if (!minStartDate || parsedStartDate < minStartDate) {
                      minStartDate = parsedStartDate
                    }
                  }

                  if (isValidDate(endDate)) {
                    const parsedEndDate = parseISO(endDate)
                    if (!maxEndDate || parsedEndDate > maxEndDate) {
                      maxEndDate = parsedEndDate
                    }
                  }
                })

                const formattedStartDate = minStartDate
                  ? format(minStartDate, 'yyyy-MM-dd')
                  : 'Invalid Start Date'
                const formattedEndDate = maxEndDate
                  ? format(maxEndDate, 'yyyy-MM-dd')
                  : 'No End Date'

                return `${formattedStartDate} to ${formattedEndDate}`
              })()
            : 'No tasks available'}
        </div> */}

        <div className="flex space-x-2">
          {/* Project Filter Dropdown */}
          <div className="relative inline-block text-left">
            <select
              className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="All">All Projects</option>
              {uniqueProjects.map((projectName) => (
                <option key={projectName} value={projectName}>
                  {projectName}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={clearFilter}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Clear Filter
          </button>
        </div>
      </div>
      {renderGanttChart()}
    </div>
  )
}

export default GanttChartt
