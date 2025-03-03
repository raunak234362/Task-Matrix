/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { Clock, Users, CheckCircle, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";

const ProjectStatus = ({ projectId, onClose }) => {
  const [selectedView, setSelectedView] = useState("all"); // 'all', 'week', 'month'

  const projectData = useSelector((state) =>
    state?.projectData.projectData.find((project) => project.id === projectId)
  );
  const taskData = useSelector((state) => state.taskData.taskData);
  const userData = useSelector((state) => state.userData.staffData);

  const projectTasks = useMemo(
    () => taskData.filter((task) => task.project_id === projectId),
    [taskData, projectId]
  );

  const parseDuration = (duration) => {
    if (!duration || typeof duration !== "string") return 0;
    const [h, m, s] = duration.split(":").map(Number);
    return h + m / 60 + s / 3600;
  };

  const calculateHours = (type) => {
    const tasks = projectTasks.filter((task) => task.name.startsWith(type));
    console.log(tasks);
    return {
      assigned: tasks.reduce(
        (sum, task) => sum + parseDuration(task.duration),
        0
      ),
      taken: tasks.reduce(
        (sum, task) =>
          sum +
          (task?.workingHourTask?.reduce(
            (innerSum, innerTask) => innerSum + innerTask.duration,
            0
          ) || 0),
        0
      ),
    };
  };

  const taskTypes = {
    MODELING: calculateHours("MODELING"),
    MODEL_CHECKING: calculateHours("MODELING_CHECKING"),
    DETAILING: calculateHours("DETAILING"),
    DETAIL_CHECKING: calculateHours("DETAILING_CHECKING"),
    ERECTION: calculateHours("ERECTION"),
    ERECTIONCHECKING: calculateHours("ERECTION_CHECKING"),
  };

  console.log(taskTypes);

  const totalAssignedHours = Object.values(taskTypes).reduce(
    (sum, type) => sum + type?.assigned,
    0
  );

  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatMinutesToHours = (minutes) => {
    if (!minutes) return "0h 0m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const userContributions = userData
    .map((user) => {
      const userTasks = projectTasks?.filter(
        (task) => task.user?.id === user.id
      );
      console.log(userTasks)
      return {
        name: user.f_name,
        taskCount: userTasks.length,
      };
    })
    .filter((user) => user.taskCount > 0)
    .sort((a, b) => b.taskCount - a.taskCount);

  // Prepare data for Gantt chart
  const ganttData = projectTasks.map((task) => {
    const startDate = new Date(task.start_date);
    const endDate = new Date(task.due_date);
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const type = task.name.split(" ")[0]; // Assuming first word is the type

    // Extract assigned and taken hours
    const assignedHours = parseDuration(task.duration);
    const takenHours =
      task?.workingHourTask?.reduce(
        (sum, innerTask) => sum + innerTask.duration,
        0
      ) || 0;

    // Calculate progress percentage
    let progress = assignedHours
      ? Math.min((takenHours / assignedHours) * 100, 100)
      : 0;

    // Override progress based on status
    if (task.status === "IN REVIEW") {
      progress = 80;
    } else if (task.status === "COMPLETED") {
      progress = 100;
    } else if (task.status === "IN PROGRESS") {
      progress = Math.min(progress, 80);
    }

    // Ensure progress does not exceed 80% when in progress
    if (task.status === "IN PROGRESS" && progress > 80) {
      progress = 80;
    }

    return {
      id: task.id,
      name: task.name,
      username: `${task.user?.f_name} ${task.user?.l_name}`,
      type,
      startDate,
      endDate,
      duration,
      progress: Math.round(progress), // Ensure it's rounded
    };
  });

  const timelineWidth = 1000;
  const rowHeight = 40;
  const today = new Date();

  // Find the earliest and latest dates
  const dates = ganttData.reduce((acc, task) => {
    acc.push(task.startDate, task.endDate);
    return acc;
  }, []);
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));

  const [hoveredTask, setHoveredTask] = useState(null);
  console.log(hoveredTask);
  // Format date to display in a more readable way
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Enhanced getPositionAndWidth to handle date calculations
  const getPositionAndWidth = (start, end) => {
    const left =
      ((start - minDate) / (1000 * 60 * 60 * 24)) * (timelineWidth / totalDays);
    const width = Math.max(
      ((end - start) / (1000 * 60 * 60 * 24)) * (timelineWidth / totalDays),
      30
    ); // Minimum width of 30px for better visibility
    return { left, width };
  };

  // Calculate month divisions for the timeline header
  const getMonthDivisions = () => {
    const months = [];
    const currentDate = new Date(minDate);

    while (currentDate <= maxDate) {
      const monthStart = new Date(currentDate);
      currentDate.setMonth(currentDate.getMonth() + 1);
      const monthEnd = new Date(
        Math.min(currentDate.getTime(), maxDate.getTime())
      );

      const { left } = getPositionAndWidth(monthStart, monthStart);
      const { width } = getPositionAndWidth(monthStart, monthEnd);

      months.push({
        label: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        left,
        width,
      });
    }
    return months;
  };

  const monthDivisions = getMonthDivisions();

  const groupedTasks = ganttData.reduce((acc, task) => {
    if (!acc[task.type]) acc[task.type] = [];
    acc[task.type].push(task);
    return acc;
  }, {});

  const typeColors = {
    MODELING: "bg-blue-500",
    MODELCHECKING: "bg-blue-700",
    DETAILING: "bg-green-500",
    DETAILCHECKING: "bg-green-700",
    ERECTION: "bg-purple-500",
    ERECTIONCHECKING: "bg-purple-700",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto p-5 rounded-lg shadow-lg w-11/12 md:w-10/12">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="bg-blue-600 text-white px-4 py-2 text-xl font-bold rounded-lg shadow-md">
              Project: {projectData?.name || "Unknown"}
            </div>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          {/* User Contributions Chart */}
          <div className="border rounded-lg p-4">
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
              <Users className="h-5 w-5" /> Team Contributions
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userContributions}>
                  <XAxis dataKey="name" />
                  <YAxis
                    label={{
                      value: "Tasks",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => `${value} tasks`}
                    labelStyle={{ color: "black" }}
                  />
                  <Bar dataKey="taskCount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gantt Chart */}
          <div className="border rounded-lg p-4 mx-auto">
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
              <Clock className="h-5 w-5" /> Project Timeline
            </h2>
            <div className="overflow-x-auto w-full">
              <div
                style={{ width: `${timelineWidth + 300}px` }}
                className="relative"
              >
                {/* Timeline Header */}
                <div className="flex border-b">
                  <div className="w-48 flex-shrink-0 font-bold">Task Name</div>
                  <div className="flex-1 relative">
                    {/* Date Axis */}
                    <div className="absolute left-0 right-0 border-b">
                      {Array.from({ length: totalDays + 1 }).map((_, i) => {
                        const date = new Date(minDate);
                        date.setDate(date.getDate() + i);
                        return (
                          <div
                            key={i}
                            className="absolute border-l border-gray-300 text-xs text-gray-700 text-center"
                            style={{
                              left: `${(i * timelineWidth) / totalDays}px`,
                              width: `${timelineWidth / totalDays}px`,
                            }}
                          >
                            {date.toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Render grouped tasks */}
                {Object.keys(groupedTasks).map((type) => (
                  <div key={type} className="mt-4 w-full">
                    <div className="text-lg font-bold p-2">
                      <div className="w-full  rounded">
                        <h3 className=" ">{type}</h3>
                        <hr />
                      </div>
                    </div>
                    {groupedTasks[type].map((task, index) => {
                      const { left, width } = getPositionAndWidth(
                        task.startDate,
                        new Date(task.endDate.getTime() + 24 * 60 * 60 * 1000) // Add one day to end date
                      );

                      return (
                        <div
                          key={index}
                          className="flex w-full items-center border-b"
                          style={{ height: `${rowHeight}px` }}
                        >
                          <div className="w-52 flex-shrink-0 truncate px-2">
                            {task.username || ""}
                          </div>
                          <div className="flex-1 relative">
                            <div
                              className={`absolute z-0 h-4 w-full rounded overflow-x-auto ${
                                typeColors[task.type] || "bg-gray-500"
                              } opacity-80 cursor-pointer hover:opacity-100 transition-opacity duration-200`}
                              style={{
                                left: `${left}px`,
                                width: `${width}px`,
                                top: "0px",
                              }}
                              onMouseEnter={() => setHoveredTask(task)}
                              onMouseLeave={() => setHoveredTask(null)}
                            >
                              <div
                                className="h-full bg-opacity-50 bg-green-300"
                                style={{ width: `${task.progress}%` }}
                              />

                              {hoveredTask?.id === task.id && (
                                <div className="h-fit fixed top-56 inset-0 flex justify-center items-center w-full z-50">
                                  <div className="h-fit w-fit bg-black bg-opacity-50 flex justify-center items-center">
                                    <div className="bg-white h-fit p-5 rounded-lg shadow-lg w-fit">
                                      <p className="font-medium text-xl">
                                        {task.name}
                                      </p>
                                      <p className="text-md text-gray-600">
                                        {formatDate(task?.startDate)} -{" "}
                                        {formatDate(task?.endDate)}
                                      </p>
                                      <p className="text-md text-gray-600">
                                        Duration: {task.duration} days
                                      </p>
                                      <p className="text-md text-gray-600">
                                        Progress: {task.progress}%
                                      </p>
                                      {/* <p className="text-md text-gray-600">
                                        Hours Taken: {task.progress}
                                      </p> */}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Other stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <CheckCircle className="h-5 w-5" /> Task Type Breakdown
              </h2>
              {Object.entries(taskTypes).map(([type, hours]) => (
                <p key={type} className="space-y-5">
                  {type}: {formatMinutesToHours(hours.taken)} /{" "}
                  {formatHours(hours.assigned)}
                </p>
              ))}
            </div>
            <div className="border rounded-lg p-4">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <AlertCircle className="h-5 w-5" /> Project Status
              </h2>
              <p>Total Tasks: {projectTasks.length}</p>
              <p>
                Completed:{" "}
                {
                  projectTasks.filter((task) => task.status === "COMPLETE")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;