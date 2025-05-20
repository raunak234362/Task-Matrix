/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

import { toast } from "react-toastify";
import socket from "../../../../socket";
import Button from "../../../fields/Button";
import { useTable } from "react-table";
import { useEffect, useMemo, useState } from "react";
import Service from "../../../../api/configAPI";
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
      ? tasks.filter(task => task.stage === stageFilter)
      : tasks;
  }, [tasks, stageFilter]);

  const columns = useMemo(() => [
    { Header: "S.No", accessor: (_, i) => i + 1 },
    {
      Header: "Project Name",
      accessor: row =>
        projects?.find((project) => project.id === row?.project_id)?.name || "N/A",
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
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <span className={`px-3 py-0.5 rounded-full border ${statusColor(value)}`}>
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
        const canView = unlockableTaskId === row.original.id;
        return canView ? (
          <Button onClick={() => handleTaskView(row.original.id)}>View</Button>
        ) : (
          <Button className="bg-red-500 text-white font-semibold" disabled>
            View
          </Button>
        );
      },
    },
  ], [projects, tasks]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: filteredTasks });

  const highestPriorityTask = tasks
    .sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(a.due_date) - new Date(b.due_date);
    })[0];

  const unlockableTaskId = highestPriorityTask?.id;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const task = await Service.getMyTask();
        setTasks(task);
      } catch (error) {
        console.error("Error in fetching task:", error);
      }
    };

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

      toast.success(message);
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
    return status === "IN_PROGRESS" ? "text-green-700" : "text-red-700";
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
      case 0: return "LOW";
      case 1: return "MEDIUM";
      case 2: return "HIGH";
      case 3: return "CRITICAL";
      default: return "";
    }
  }

  function handleTaskView(taskId) {
    setSpecificTask(taskId);
    setDisplayTask(true);
  }

  return (
    <div className="mx-2 my-3 main-container">
      <div className="bg-white h-[60vh] overflow-auto rounded-lg">
        <table {...getTableProps()} className="w-full border-collapse text-center text-sm">
          <thead className="bg-teal-200/70">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="px-2 py-1 uppercase border">
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-1 py-2 border font-semibold text-center">
                  No task assigned
                </td>
              </tr>
            ) : (
              rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="even:bg-gray-100">
                    {row.cells.map(cell => (
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

      {displayTask && <Task taskId={specificTask} setDisplay={setDisplayTask} />}
    </div>
  );
};

export default MyTask;
