/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useCallback, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip } from "react-tooltip";

const TimeLine = ({
    tasks = [],
    minDate,
    maxDate,
    totalDays,
    rowHeight = 50,
    expandedTypes = {},
    toggleTypeExpansion,
    visibleTaskCount,
    loadMoreTasks,
    typeColors = {},
    statusColors = {},
}) => {
    // Parse dates with fallback
    const startDate =
        minDate && !isNaN(new Date(minDate)) ? new Date(minDate) : new Date();
    const endDate =
        maxDate && !isNaN(new Date(maxDate)) ? new Date(maxDate) : new Date();
    const today = new Date();
    const showToday = today >= startDate && today <= endDate;

    // Calculate today’s column index
    const todayIndex = showToday
        ? Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
        : -1;

    // Generate day headers
    const dayHeaders = useMemo(() => {
        const days = [];
        for (let i = 0; i <= totalDays; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push({
                date,
                label: date.toLocaleDateString("en-US", { day: "numeric" }),
                month: date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                }),
            });
        }
        return days;
    }, [startDate, totalDays]);

    // Group tasks by type
    const groupedTasks = useMemo(() => {
        return (tasks || []).reduce((acc, task) => {
            if (!task.type) return acc;
            if (!acc[task.type]) acc[task.type] = [];
            acc[task.type].push(task);
            return acc;
        }, {});
    }, [tasks]);

    // Flatten tasks for rendering (headers + expanded tasks)
    const renderedTasks = useMemo(() => {
        const list = [];
        Object.entries(groupedTasks).forEach(([type, taskList]) => {
            list.push({ isHeader: true, type });
            if (expandedTypes[type]) {
                list.push(...taskList);
            }
        });
        return list.slice(0, visibleTaskCount);
    }, [groupedTasks, expandedTypes, visibleTaskCount]);

    // Get status badge styling
    const getStatusBadge = (status) => {
        const baseClasses =
            "px-2 py-0.5 rounded-full text-xs font-medium inline-block";
        const color = statusColors[status] || "#666";
        return (
            <span
                className={baseClasses}
                style={{
                    backgroundColor: `${color}20`,
                    color,
                    border: `1px solid ${color}`,
                }}
            >
                {status || "Unknown"}
            </span>
        );
    };

    // Determine if task is active on a given day
    const isTaskActiveOnDay = useCallback(
        (task, dayIndex) => {
            if (!task.startDate || !task.endDate) return false;
            const taskStart = new Date(task.startDate).setHours(0, 0, 0, 0);
            const taskEnd = new Date(task.endDate).setHours(23, 59, 59, 999);
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + dayIndex);
            dayDate.setHours(12, 0, 0, 0);
            return taskStart <= dayDate.getTime() && taskEnd >= dayDate.getTime();
        },
        [startDate]
    );

    // Task Row Component
    const TaskRow = ({ index, style, data }) => {
        const item = data[index];

        if (item.isHeader) {
            const taskCount = groupedTasks[item.type]?.length || 0;
            const typeColor = typeColors[item.type] || "#ccc";

            return (
                <div
                    style={{
                        ...style,
                        borderLeft: `4px solid ${typeColor}`,
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 px-4 font-semibold border-b text-sm text-gray-700 sticky left-0 z-10"
                >
                    <button
                        onClick={() => toggleTypeExpansion(item.type)}
                        className="hover:bg-gray-200 p-1.5 rounded-full transition-colors duration-200"
                        aria-label={
                            expandedTypes[item.type] ? "Collapse section" : "Expand section"
                        }
                    >
                        {expandedTypes[item.type] ? (
                            <ChevronUp size={16} />
                        ) : (
                            <ChevronDown size={16} />
                        )}
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-base">
                            {item.type}{" "}
                            <span className="text-sm text-gray-500 font-normal">
                                ({taskCount} tasks)
                            </span>
                        </span>
                    </div>
                </div>
            );
        }

        const typeColor = typeColors[item.type] || "#ccc";
        const statusColor = statusColors[item.status] || "#666";
        const startDateFormatted = item.startDate
            ? new Date(item.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })
            : "N/A";
        const endDateFormatted = item.endDate
            ? new Date(item.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })
            : "N/A";

        return (
            <div
                style={style}
                className="flex border-b bg-white hover:bg-gray-50 transition-colors duration-200 relative"
            >
                <div className="w-60 px-4 flex items-center text-sm font-medium text-gray-800 truncate sticky left-0 bg-inherit z-10 border-r">
                    {item.name || "Unnamed Task"}
                </div>
                <div className="flex flex-1">
                    {dayHeaders.map((day, dayIndex) => {
                        const isActive = isTaskActiveOnDay(item, dayIndex);
                        const isStartDay =
                            item.startDate &&
                            new Date(item.startDate).toDateString() ===
                            day.date.toDateString();
                        const isEndDay =
                            item.endDate &&
                            new Date(item.endDate).toDateString() === day.date.toDateString();

                        return (
                            <div
                                key={dayIndex}
                                className={`flex-1 min-w-[50px] h-[${rowHeight}px] border-r border-gray-200 flex items-center justify-center relative ${dayIndex === todayIndex ? "bg-red-50" : ""
                                    }`}
                            >
                                {isActive && (
                                    <div
                                        data-tooltip-id="task-tooltip"
                                        data-tooltip-html={`
                      <div class="p-2">
                        <div class="font-bold text-base mb-2">${item.name || "Unnamed Task"
                                            }</div>
                        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div class="text-gray-500">Status:</div>
                          <div>${item.status || "Unknown"}</div>
                          <div class="text-gray-500">Progress:</div>
                          <div class="flex items-center gap-1">
                            <div class="w-20 h-2 bg-gray-200 rounded-full">
                              <div class="h-full bg-blue-500 rounded-full" style="width: ${item.progress || 0
                                            }%"></div>
                            </div>
                            <span>${item.progress || 0}%</span>
                          </div>
                          <div class="text-gray-500">Start:</div>
                          <div>${startDateFormatted}</div>
                          <div class="text-gray-500">End:</div>
                          <div>${endDateFormatted}</div>
                          <div class="text-gray-500">Assigned to:</div>
                          <div>${item.username || "Unassigned"}</div>
                        </div>
                      </div>
                    `}
                                        className={`absolute h-6 flex items-center px-2 rounded-md border cursor-pointer hover:shadow-md z-20 ${isStartDay ? "rounded-l-md" : ""
                                            } ${isEndDay ? "rounded-r-md" : ""}`}
                                        style={{
                                            left: isStartDay ? 0 : "-1px",
                                            right: isEndDay ? 0 : "-1px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            backgroundColor: `${typeColor}15`,
                                            borderColor: typeColor,
                                            borderLeft: isStartDay
                                                ? `2px solid ${typeColor}`
                                                : "none",
                                            borderRight: isEndDay ? `2px solid ${typeColor}` : "none",
                                        }}
                                    >
                                        <div
                                            className="h-full rounded-l-md"
                                            style={{
                                                width: `${item.progress || 0}%`,
                                                backgroundColor: statusColor,
                                                opacity: 0.85,
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center px-2 justify-between text-xs font-medium text-gray-800">
                                            <span className="truncate max-w-[70%]">
                                                {item.progress > 0 && `${item.progress}%`}
                                            </span>
                                            <span className="bg-white/80 px-1 py-0.5 rounded text-gray-700">
                                                {item.status || "Unknown"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Group days by month for header
    const monthHeaders = useMemo(() => {
        const months = [];
        let currentMonth = null;
        let startIndex = 0;

        dayHeaders.forEach((day, index) => {
            const monthLabel = day.month;
            if (monthLabel !== currentMonth) {
                if (currentMonth) {
                    months.push({
                        label: currentMonth,
                        startIndex,
                        width: (index - startIndex) * 50, // 50px per day
                    });
                }
                currentMonth = monthLabel;
                startIndex = index;
            }
        });
        if (currentMonth) {
            months.push({
                label: currentMonth,
                startIndex,
                width: (dayHeaders.length - startIndex) * 50,
            });
        }
        return months;
    }, [dayHeaders]);

    return (
        <div className="mt-6 border rounded-lg shadow-lg bg-white overflow-hidden">
            {/* Legends */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(typeColors).map(([type, color]) => (
                            <div key={type} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {type}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(statusColors).map(([status, color]) => (
                            <div key={status} className="flex items-center">
                                {getStatusBadge(status)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white shadow-sm">
                {/* Month Header */}
                <div className="relative h-10 border-b bg-gray-50 text-xs font-semibold flex">
                    <div className="w-60 flex items-center justify-center sticky left-0 bg-gray-50 z-10 border-r">
                        Task
                    </div>
                    <div className="flex flex-1 overflow-hidden">
                        {monthHeaders.map((month, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-center text-gray-600 border-l border-gray-200"
                                style={{
                                    width: `${month.width}px`,
                                    minWidth: `${month.width}px`,
                                }}
                            >
                                {month.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Day Header */}
                <div className="relative h-8 border-b bg-white flex">
                    <div className="w-60 flex items-center justify-center sticky left-0 bg-white z-10 border-r text-xs font-semibold text-gray-600">
                        Name
                    </div>
                    <div className="flex flex-1 overflow-hidden">
                        {dayHeaders.map((day, idx) => (
                            <div
                                key={idx}
                                className={`flex-1 min-w-[50px] flex items-center justify-center text-xs ${idx === todayIndex
                                        ? "bg-red-50 text-red-600 font-semibold"
                                        : "text-gray-600"
                                    } border-l border-gray-200`}
                            >
                                {day.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Task Grid */}
            <div className="relative" style={{ height: 500 }}>
                <AutoSizer>
                    {({ height, width }) => (
                        <div className="overflow-x-auto">
                            <List
                                height={height}
                                width={Math.max(width, 60 + dayHeaders.length * 50)} // 60px for task name + 50px per day
                                itemCount={renderedTasks.length}
                                itemSize={rowHeight}
                                itemData={renderedTasks}
                            >
                                {TaskRow}
                            </List>
                        </div>
                    )}
                </AutoSizer>
            </div>

            {/* Load More */}
            {visibleTaskCount < tasks.length && (
                <div className="text-center p-4 bg-gradient-to-b from-white to-gray-50 border-t">
                    <button
                        onClick={loadMoreTasks}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm shadow-md transition-colors duration-200"
                    >
                        Load More Tasks
                    </button>
                </div>
            )}

            {/* Tooltip */}
            <Tooltip
                id="task-tooltip"
                place="top"
                className="z-[1000] !bg-white !text-gray-800 shadow-lg rounded-lg border border-gray-200 p-0"
                opacity={1}
            />
        </div>
    );
};

export default TimeLine;
