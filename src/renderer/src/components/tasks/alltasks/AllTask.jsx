/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
import React, { useMemo, useEffect, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import SelectedTask from "./SelectedTask";
import DateFilter from "../../projects/projectStatus/DateFilter";
import Button from "../../fields/Button";
import Service from "../../../api/configAPI";

const AllTask = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.taskData.taskData);
  const projects = useSelector((state) => state.projectData.projectData);
  const userData = useSelector((state) => state.userData.staffData);
  const userType = useSelector((state) => state.userData?.userType);
  const [taskID, setTaskID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState();
  const [taskFilter, setTaskFilter] = useState(tasks);
  const [dateFilter, setDateFilter] = useState({ type: "all" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    project: "",
    status: "",
  });

  const handleSearch = (e) => setSearchQuery(e.target.value);

  useEffect(() => {
    let filtered = [...tasks];

    // Apply project filter
    if (filters.project) {
      filtered = filtered.filter((task) => {
        const project = projects.find((p) => p.id === task.project_id);
        return project?.name === filters.project;
      });
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    // Apply date filter
    if (dateFilter.type !== "all") {
      filtered = filtered.filter((task) => {
        const dueDate = new Date(task.due_date);

        if (dateFilter.type === "month") {
          return (
            dueDate.getFullYear() === dateFilter.year &&
            dueDate.getMonth() === dateFilter.month
          );
        }

        if (dateFilter.type === "year") {
          return dueDate.getFullYear() === dateFilter.year;
        }

        if (dateFilter.type === "week") {
          return (
            dueDate.getTime() >= dateFilter.weekStart &&
            dueDate.getTime() <= dateFilter.weekEnd
          );
        }

        if (dateFilter.type === "range") {
          const year = dateFilter.year ?? new Date().getFullYear();
          const start = new Date(year, dateFilter.startMonth, 1);
          const end = new Date(year, dateFilter.endMonth + 1, 0, 23, 59, 59);
          return dueDate >= start && dueDate <= end;
        }

        if (dateFilter.type === "dateRange") {
          const start = new Date(dateFilter.startDate);
          const end = new Date(dateFilter.endDate);
          return dueDate >= start && dueDate <= end;
        }

        return true;
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((task) => {
        const taskName = task.name?.toLowerCase() || "";
        const user = userData?.find((u) => u.id === task.user_id);
        const fullName = user
          ? [user.f_name, user.m_name, user.l_name]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
          : "";
        return taskName.includes(query) || fullName.includes(query);
      });
    }

    setTaskFilter(filtered);
  }, [
    tasks,
    dateFilter,
    searchQuery,
    filters.project,
    filters.status,
    userData,
    projects,
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  function statusColor(status) {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-yellow-200 border-yellow-800 text-yellow-800";
      case "ASSIGNED":
        return "bg-orange-200 border-orange-800 text-orange-800";
      case "BREAK":
        return "bg-red-200 border-red-500 text-red-500";
      case "IN_REVIEW":
        return "bg-blue-200 border-blue-600 text-blue-500";
      case "COMPLETE":
        return "bg-green-200 border-green-500 text-green-800";
      default:
        return "text-gray-700";
    }
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

  const handleViewClick = async (taskId) => {
    try {
      const task = await Service.getTaskById(taskId);
      setSelectedTask(task);
      setTaskID(taskId);
      setIsModalOpen(true);
    } catch (error) {
      alert.error("Error fetching task details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskID(null);
  };

  const data = useMemo(() => taskFilter, [taskFilter]);
  const columns = useMemo(() => {
    const cols = [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "sno",
      },
      {
        Header: "Project",
        accessor: (row) =>
          (typeof row.project === "string" ? row.project : row.project?.name) ||
          "N/A",
        id: "project",
      },
      {
        Header: "Task Name",
        accessor: "name",
      },
      {
        Header: "Assigned To",
        accessor: (row) =>
          [row?.user?.f_name, row?.user?.m_name, row?.user?.l_name]
            .filter(Boolean)
            .join(" ") || "N/A",
        id: "assignedTo",
      },
      {
        Header: "Project Manager",
        accessor: (row) => {
          if (typeof row.manager === "string") {
            return row.manager;
          } else if (row.manager && typeof row.manager === "object") {
            return [row.manager.f_name, row.manager.m_name, row.manager.l_name]
              .filter(Boolean)
              .join(" ");
          } else if (
            row.project?.manager &&
            typeof row.project.manager === "object"
          ) {
            return [
              row.project.manager.f_name,
              row.project.manager.m_name,
              row.project.manager.l_name,
            ]
              .filter(Boolean)
              .join(" ");
          }
          return "N/A";
        },
        id: "projectManager",
        Cell: ({ value }) => (
          <span className="px-2 py-1 text-gray-800">{value || "N/A"}</span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 rounded-full border ${statusColor(value)}`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Priority",
        accessor: "priority",
        Cell: ({ value }) => (
          <span className={`px-2 py-1 rounded-full border ${color(value)}`}>
            {setPriorityValue(value)}
          </span>
        ),
      },
      {
        Header: "Due Date",
        accessor: "due_date",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Allocated Hours",
        accessor: "duration",
        Cell: ({ value }) => {
          if (!value) return "N/A";
          const [h = "0", m = "0"] = value.split(":");
          const hours = parseInt(h, 10);
          const mins = parseInt(m, 10);
          return `${hours} h ${mins} min`;
        },
      },
      {
        Header: "Taken Hours",
        accessor: "taken_hours",
        Cell: ({ row }) => {
          const task = row.original;
          const takenDuration = task?.workingHourTask?.find(
            (rec) => rec.task_id === task.id,
          )?.duration;
          if (!takenDuration || isNaN(Number(takenDuration))) return "N/A";
          const totalMinutes = parseInt(takenDuration, 10);
          const hours = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          return `${hours} h ${mins} min`;
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <Button onClick={() => handleViewClick(row.original.id)}>View</Button>
        ),
      },
    ];

    return cols;
  }, [userType]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 15 },
    },
    useSortBy,
    usePagination,
  );

  return (
    <div className="h-[80vh] bg-white/70 rounded-lg shadow-md overflow-y-auto">
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 w-full">
          <div className="flex gap-4 w-full">
            <input
              type="text"
              placeholder="🔍 Task or Username"
              className="border p-2 rounded-lg w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
            <select
              name="project"
              value={filters.project}
              onChange={handleFilterChange}
              className="border p-2 rounded-lg w-full"
            >
              <option value="">All Projects</option>
              {projects?.map((proj) => (
                <option key={proj.id} value={proj.name}>
                  {proj.name}
                </option>
              ))}
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="border p-2 rounded-lg w-full"
            >
              <option value="">All Status</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="BREAK">BREAK</option>
              <option value="IN_REVIEW">IN REVIEW</option>
              <option value="COMPLETE">COMPLETED</option>
            </select>
          </div>
          <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
        </div>

        <div className="overflow-x-auto rounded-md border">
          <table
            {...getTableProps()}
            className="min-w-full text-sm text-center border"
          >
            <thead className="sticky top-0 bg-teal-200 z-10">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-4 py-2 font-semibold border whitespace-nowrap"
                    >
                      {column.render("Header")}
                      <span className="ml-1">
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-4 text-center border"
                  >
                    No Tasks Found
                  </td>
                </tr>
              ) : (
                page.map((row) => {
                  prepareRow(row);
                  const task = row.original;
                  let allocatedMinutes = 0;
                  if (task.duration) {
                    const [h = "0", m = "0"] = task.duration.split(":");
                    allocatedMinutes = parseInt(h) * 60 + parseInt(m);
                  }
                  const takenDuration = task?.workingHourTask?.find(
                    (rec) => rec.task_id === task.id,
                  )?.duration;
                  const takenMinutes = takenDuration
                    ? parseInt(takenDuration, 10)
                    : 0;
                  const highlightRow = takenMinutes - allocatedMinutes >= 15;

                  return (
                    <tr
                      {...row.getRowProps()}
                      className={`hover:bg-teal-100 ${
                        highlightRow ? "bg-red-100" : ""
                      }`}
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-4 py-2 border border-black/50"
                        >
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
      </div>

      <div className="flex justify-between items-center mt-4 px-4">
        <div className="space-x-1">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {"<"}
          </button>
          <span className="text-sm">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <strong>{pageOptions.length}</strong>
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border p-1 rounded"
        >
          {[15, 30, 45, 60].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {selectedTask && (
        <SelectedTask
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          taskDetail={selectedTask}
          taskId={taskID}
        />
      )}
    </div>
  );
};

export default AllTask;
