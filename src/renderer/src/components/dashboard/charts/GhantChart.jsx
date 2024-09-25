/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react'
import { addDays, format, differenceInDays, parseISO, isValid, isAfter } from 'date-fns'

const GanttChart = ({ taskData }) => {
  const [data, setData] = useState([])
  const [filter, setFilter] = useState('All')
  const chartRef = useRef(null)

  useEffect(() => {
    const taskDetails = taskData || []
    setData(taskDetails)
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

  // Filtering team members based on selected role
  const filteredTeam =
    filter === 'All'
      ? data.map((task) => task || [])
      : data.flatMap((task) => (task.team || []).filter((member) => member?.role === filter))

  const renderGanttChart = () => {
    return (
      <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-md w-full">
        {/* Grid container for names and chart */}
        <div className="grid grid-cols-[250px_1fr]">
          {/* Sidebar with team member names */}
          <div className="bg-gray-200 z-10">
            <div className="h-8"></div>
            {filteredTeam.map((member, index) => (
              <div
                key={member.id}
                className={`h-12 flex items-center px-2 font-medium text-sm text-gray-700 truncate bg-gray-200 border-b ${
                  index === filteredTeam.length - 1 ? '' : 'border-b border-gray-400'
                }`}
              >
                {member.name} ({member.role})
              </div>
            ))}
          </div>

          {/* Gantt Chart body */}
          <div className="overflow-x-auto" ref={chartRef}>
            <div className="min-w-full flex flex-col">
              {/* Date Row */}
              <div className="flex h-8 bg-gray-300">
                {dateRange.map((day, index) => (
                  <div
                    key={index}
                    className="flex-grow text-center text-xs text-gray-600 border-r border-gray-400"
                  >
                    {format(day, 'dd')}
                  </div>
                ))}
              </div>

              {/* Team Members' Tasks */}
              {filteredTeam.map((member, index) => (
                <div key={member.id} className="flex mt-2 h-10 relative">
                  <div className="flex-grow relative">
                    {/* Adding dividing lines between rows */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-full ${
                        index === filteredTeam.length - 1 ? '' : 'border-b border-gray-400'
                      }`}
                    />
                    {member.tasks.map((task) => {
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
                          className="absolute h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs text-white font-medium"
                          style={{
                            left: `${(taskStart / dateRange.length) * 100}%`,
                            width: `${(taskDuration / dateRange.length) * 120}%`
                          }}
                          title={`${task.name} (${format(parseISO(task.created_on), 'MMM dd')} - ${
                            task.due_date
                              ? format(parseISO(task.due_date), 'MMM dd')
                              : 'No End Date'
                          })`}
                        >
                          <span className="truncate px-2">{task.name}</span>
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

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-4">
      <div className="text-lg font-semibold">
  Timeline:
  {taskData && taskData.length > 0 ? (
    (() => {
      let minStartDate = null;
      let maxEndDate = null;

      taskData.forEach((task) => {
        const startDate = task?.tasks[0]?.project?.created_at;
        const endDate = task?.tasks[0]?.project?.endDate;

        if (isValidDate(startDate)) {
          const parsedStartDate = parseISO(startDate);
          if (!minStartDate || parsedStartDate < minStartDate) {
            minStartDate = parsedStartDate;
          }
        }

        if (isValidDate(endDate)) {
          const parsedEndDate = parseISO(endDate);
          if (!maxEndDate || parsedEndDate > maxEndDate) {
            maxEndDate = parsedEndDate;
          }
        }
      });

      const formattedStartDate = minStartDate
        ? format(minStartDate, 'yyyy-MM-dd')
        : 'Invalid Start Date';
      const formattedEndDate = maxEndDate
        ? format(maxEndDate, 'yyyy-MM-dd')
        : 'No End Date';

      return `${formattedStartDate} to ${formattedEndDate}`;
    })()
  ) : (
    'No tasks available'
  )}
</div>


        {/* <div className="relative inline-block text-left">
          <select
            className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Modeler">Modeler</option>
            <option value="Erector">Erector</option>
            <option value="Checker">Checker</option>
            <option value="Detailer">Detailer</option>
          </select>
        </div> */}
      </div>
      {renderGanttChart()}
    </div>
  )
}

export default GanttChart
