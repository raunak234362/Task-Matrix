/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"

import { useCallback, useMemo } from "react"
import { FixedSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Tooltip } from "react-tooltip"

const TimeLine = ({
  tasks,
  minDate,
  maxDate,
  totalDays,
  timelineWidth = 1000,
  rowHeight = 50,
  expandedTypes,
  toggleTypeExpansion,
  visibleTaskCount,
  loadMoreTasks,
  typeColors,
  statusColors,
}) => {
  minDate = new Date(minDate)
  maxDate = new Date(maxDate)
  const today = new Date()
  const showTodayLine = today >= minDate && today <= maxDate
  const todayLeft = ((today - minDate) / (1000 * 60 * 60 * 24)) * (timelineWidth / totalDays)

  const getPositionAndWidth = useCallback(
    (start, end) => {
      const left = ((start - minDate) / (1000 * 60 * 60 * 24)) * (timelineWidth / totalDays)
      const width = Math.max(((end - start) / (1000 * 60 * 60 * 24)) * (timelineWidth / totalDays), 30)
      return { left, width }
    },
    [minDate, totalDays, timelineWidth],
  )

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

  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.type]) acc[task.type] = []
      acc[task.type].push(task)
      return acc
    }, {})
  }, [tasks])

  const renderedTasks = useMemo(() => {
    const list = []
    Object.entries(groupedTasks).forEach(([type, taskList]) => {
      list.push({ isHeader: true, type })
      if (expandedTypes[type]) {
        list.push(...taskList)
      }
    })
    return list.slice(0, visibleTaskCount)
  }, [groupedTasks, expandedTypes, visibleTaskCount])

  const TaskRow = ({ index, style, data }) => {
    const item = data[index]

    if (item.isHeader) {
      const taskCount = groupedTasks[item.type]?.length || 0
      return (
        <div
          style={style}
          className="flex items-center gap-2 bg-gray-100 px-4 font-semibold border-b text-sm text-gray-700"
        >
          <button onClick={() => toggleTypeExpansion(item.type)} className="hover:bg-gray-200 p-1 rounded">
            {expandedTypes[item.type] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <span className="text-base">
            {item.type} ({taskCount} tasks)
          </span>
        </div>
      )
    }

    const { left, width } = getPositionAndWidth(item.startDate, item.endDate)

    return (
      <div style={style} className="flex items-center border-b px-4 text-sm bg-white hover:bg-gray-50">
        <div className="w-1/4 truncate font-medium text-gray-800">{item.name}</div>
        <div className="w-3/4 relative h-6 bg-gray-100 rounded overflow-visible">
          <div
            data-tooltip-id="task-tooltip"
            data-tooltip-html={`<div><strong>${item.name}</strong></div>
              <div>Status: ${item.status}</div>
              <div>Progress: ${item.progress}%</div>
              <div>Start: ${new Date(item.startDate).toLocaleDateString()}</div>
              <div>End: ${new Date(item.endDate).toLocaleDateString()}</div>
              <div>Assigned to: ${item.username}</div>`}
            className="absolute h-full cursor-pointer transition-all duration-200"
            style={{
              left,
              width,
              backgroundColor: typeColors[item.type] || "#ccc",
              opacity: 0.9,
              borderRadius: 6,
            }}
          >
            <div
              className="h-full"
              style={{
                width: `${item.progress}%`,
                backgroundColor: statusColors[item.status] || "#666",
                borderRadius: 6,
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 border rounded-lg shadow bg-white overflow-hidden">
      {/* Task Legend */}
      <div className="flex gap-3 p-4 flex-wrap bg-white border-b">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
            <span className="text-sm font-medium text-gray-700">{type}</span>
          </div>
        ))}
      </div>

      {/* Sticky Timeline Header */}
      <div className="sticky top-0 z-10 bg-white">
        {/* Month Header */}
        <div className="relative h-10 border-b bg-gray-50 text-xs font-semibold">
          {monthDivisions.map((month, idx) => (
            <div
              key={idx}
              style={{
                width: month.width,
                left: month.left,
                position: "absolute",
                textAlign: "center",
              }}
            >
              {month.label}
            </div>
          ))}
        </div>

        {/* Day Axis */}
        <div className="relative h-6 border-b bg-white">
          {Array.from({ length: Math.min(totalDays + 1, 60) }).map((_, i) => {
            const date = new Date(minDate)
            date.setDate(date.getDate() + i)
            const isToday = date.toDateString() === today.toDateString()

            return (
              <div
                key={i}
                className={`absolute text-center text-xs border-l ${isToday ? "border-red-500" : "border-gray-200"
                  }`}
                style={{
                  left: `${(i * timelineWidth) / totalDays}px`,
                  width: `${timelineWidth / totalDays}px`,
                  height: "100%",
                }}
              >
                {i % 2 === 0 && (
                  <span className={isToday ? "text-red-600 font-semibold" : "text-gray-600"}>
                    {date.getDate()}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Today Indicator */}
      {showTodayLine && (
        <div
          className="absolute z-20 border-l-2 border-red-500 top-[100px] bottom-0"
          style={{ left: `${todayLeft}px` }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
            Today
          </div>
        </div>
      )}

      {/* Virtualized Task List */}
      <div className="relative" style={{ width: `${timelineWidth + 300}px`, height: 500 }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={renderedTasks.length}
              itemSize={rowHeight}
              itemData={renderedTasks}
            >
              {TaskRow}
            </List>
          )}
        </AutoSizer>
      </div>

      {/* Load More */}
      {visibleTaskCount < tasks.length && (
        <div className="text-center p-4 bg-gray-50">
          <button
            onClick={loadMoreTasks}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow"
          >
            Load More Tasks
          </button>
        </div>
      )}

      {/* Tooltip */}
      <Tooltip
        id="task-tooltip"
        place="top"
        className="z-[1000] text-sm max-w-xs p-2 bg-white text-gray-800 shadow-md rounded"
      />
    </div>
  )
}

export default TimeLine
