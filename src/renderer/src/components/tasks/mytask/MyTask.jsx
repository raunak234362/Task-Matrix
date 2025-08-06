/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

import { toast } from "react-toastify";
import socket from "../../../socket";
import Button from "../../fields/Button.jsx";
import { useSortBy, useTable } from "react-table";
import { useEffect, useMemo, useState } from "react";
import Service from "../../../api/configAPI.js";
import { useSelector } from "react-redux";
import Task from "../Task";

/* eslint-disable react/jsx-key */
const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [specificTask, setSpecificTask] = useState("");
  const [displayTask, setDisplayTask] = useState(false);
  const [stageFilter, setStageFilter] = useState("");
  const projects = useSelector((state) => state?.projectData?.projectData);

  // const stageOptions = [
  //   { label: "All Stages", value: "" },
  //   { label: "(RFI)Request for Information", value: "RFI" },

  // ];

  const filteredTasks = useMemo(() => {
    return stageFilter
      ? tasks.filter((task) => task.stage === stageFilter)
      : tasks;
  }, [tasks, stageFilter]);

  const columns = useMemo(
    () => [
      { Header: "S.No", accessor: (_, i) => i + 1, disableSortBy: false },
      {
        Header: "Project Name",
        accessor: (row) =>
          projects?.find((project) => project.id === row?.project_id)?.name ||
          "N/A",
        disableSortBy: true,
      },
      { Header: "Task Name", accessor: "name" },
      {
        Header: "Start Date",
        accessor: "start_date",
        Cell: ({ value }) => new Date(value).toDateString(),
      },
      {
        Header: "Due Date",
        accessor: "due_date",
        Cell: ({ value }) => new Date(value).toDateString(),
      },
      {
        Header: "Duration",
        accessor: "duration",
        Cell: ({ value }) => durToHour(value),
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`px-3 py-0.5 rounded-full border ${statusColor(value)}`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Priority",
        accessor: "priority",
        Cell: ({ value }) => (
          <span className={`px-3 py-0.5 rounded-full border ${color(value)}`}>
            {setPriorityValue(value)}
          </span>
        ),
      },
      {
        Header: "View",
        accessor: "id",
        Cell: ({ row }) => {
          const task = row.original;
          const canView =
            task.status === "IN_REVIEW" || task.id === unlockableTaskId;
          return (
            <Button
              onClick={() => handleTaskView(task.id)}
              disabled={!canView}
              className={
                canView
                  ? "bg-teal-500 text-white font-semibold hover:bg-teal-600"
                  : "bg-red-500 text-white font-semibold opacity-50 cursor-not-allowed"
              }
            >
              View
            </Button>
          );
        },
        disableSortBy: true,
      },
    ],
    [projects, tasks],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredTasks }, useSortBy);

  // First, find the highest-priority unlockable task from ASSIGNED, IN_PROGRESS, or BREAK
  const unlockableStatuses = ["ASSIGNED", "IN_PROGRESS", "BREAK", "REWORK"];

 const highestPriorityTask = tasks
  .filter((task) => unlockableStatuses.includes(task.status))
  .sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority; // Higher priority first
    }
    if (new Date(a.due_date).getTime() !== new Date(b.due_date).getTime()) {
      return new Date(a.due_date) - new Date(b.due_date); // Earlier due date first
    }
    return new Date(a.created_on) - new Date(b.created_on); // Earlier created_on first
  })[0];
  const unlockableTaskId = highestPriorityTask?.id;

  const fetchTask = async () => {
    try {
      const task = await Service.getMyTask();
      setTasks(task);
    } catch (error) {
      console.error("Error in fetching task:", error);
    }
  };
  useEffect(() => {
    fetchTask();

    const handleNewTaskNotification = (data) => {
      const { title = "New Task", message = "You have a new task!" } = data;

      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, { body: message });
          }
        });
      } else {
        new Notification(title, { body: message });
      }
      // toast.success(message);
      fetchTask();
    };

    socket.on("customNotification", handleNewTaskNotification);

    return () => {
      socket.off("customNotification", handleNewTaskNotification);
    };
  }, []);

  function durToHour(params) {
    if (!params) return "N/A";
    const parts = params.split(" ");
    let days = 0;
    let timePart = params;

    if (parts.length === 2) {
      days = parseInt(parts[0], 10);
      timePart = parts[1];
    }

    const [hours, minutes] = timePart.split(":").map(Number);
    return `${days * 24 + hours}h ${minutes}m`;
  }

  function statusColor(status) {
    if (status === "IN_REVIEW")
      return "text-yellow-700 border-yellow-700 bg-yellow-100";
    return status === "IN_PROGRESS"
      ? "text-green-700 border-green-700 bg-green-100"
      : "text-red-700 border-red-700 bg-red-100";
  }

  function color(priority) {
    switch (priority) {
      case 0:
        return "bg-green-200 border-green-800 text-green-800";
      case 1:
        return "bg-yellow-200 border-yellow-800 text-yellow-800";
      case 2:
        return "bg-purple-200 border-purple-800 text-purple-800";
      case 3:
        return "bg-red-200 border-red-700 text-red-700";
      default:
        return "";
    }
  }

  function setPriorityValue(value) {
    switch (value) {
      case 0:
        return "LOW";
      case 1:
        return "MEDIUM";
      case 2:
        return "HIGH";
      case 3:
        return "CRITICAL";
      default:
        return "";
    }
  }

  function handleTaskView(taskId) {
    setSpecificTask(taskId);
    setDisplayTask(true);
  }

  return (
    <div className="mx-2 my-3 bg-white/50 main-container">
      <div className="bg-white h-[60vh] overflow-auto rounded-lg">
        <table
          {...getTableProps()}
          className="w-full border-collapse text-center text-sm"
        >
          <thead className="bg-teal-200/70">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-2 py-1 uppercase border cursor-pointer select-none"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " " : " ") : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-1 py-2 border font-semibold text-center"
                >
                  No task assigned
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="even:bg-gray-100">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="px-1 py-2 border">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {displayTask && (
        <Task
          taskId={specificTask}
          fetchTaskData={fetchTask}
          setDisplay={setDisplayTask}
        />
      )}
    </div>
  );
};

export default MyTask;
