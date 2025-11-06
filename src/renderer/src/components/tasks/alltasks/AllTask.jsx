/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
import React, { useMemo, useEffect, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useSelector } from "react-redux";
import SelectedTask from "./SelectedTask";
import Button from "../../fields/Button";
import Service from "../../../api/configAPI";
import DateFilter from "../../../util/DateFilter";
import { CustomSelect, Input } from "../..";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AllTask = () => {
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
    user: "", // ✅ added missing user filter key
  });

  const handleSearch = (e) => setSearchQuery(e.target.value);

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
      case "COMPLETE_OTHER":
        return "bg-brown-200 border-brown-500 text-brown-800";
      case "VALIDATE_COMPLETE":
        return "bg-lime-200 border-lime-500 text-lime-800";
      case "USER_FAULT":
        return "bg-red-200 border-red-500 text-red-600";
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

  console.log(tasks, "=-=-=-=-=-=-");
  // ✅ Filtering logic
  // ✅ Filtering logic
  useEffect(() => {
    let filtered = [...tasks];

    if (filters.project) {
      filtered = filtered.filter((task) => {
        const project = projects.find((p) => p.id === task.project_id);
        return project?.name === filters.project;
      });
    }

    if (filters.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    // date filter (updated to include specificDate)
    if (dateFilter.type !== "all") {
      filtered = filtered.filter((task) => {
        const dueDate = new Date(task.due_date);
        if (dateFilter.type === "month") {
          return (
            dueDate.getFullYear() === dateFilter.year &&
            dueDate.getMonth() === dateFilter.month
          );
        }
        if (dateFilter.type === "year")
          return dueDate.getFullYear() === dateFilter.year;
        if (dateFilter.type === "week")
          return (
            dueDate >= dateFilter.weekStart && dueDate <= dateFilter.weekEnd
          );
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
        if (dateFilter.type === "specificDate") {
          const specific = new Date(dateFilter.date);
          // only match the day, month, year
          return (
            dueDate.getFullYear() === specific.getFullYear() &&
            dueDate.getMonth() === specific.getMonth() &&
            dueDate.getDate() === specific.getDate()
          );
        }
        return true;
      });
    }

    // ✅ search + user filter fixed
    if (searchQuery.trim() || filters.user) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((task) => {
        const taskName = (task.name || "").toLowerCase();
        const user = userData?.find((u) => u.id === task.user_id);
        const fullName = user
          ? [user.f_name, user.m_name, user.l_name]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
          : "";

        const matchBySearch =
          !query || taskName.includes(query) || fullName.includes(query);
        const matchByUser =
          !filters.user ||
          task.user_id?.toString() === filters.user?.toString();

        return matchBySearch && matchByUser;
      });
    }

    setTaskFilter(filtered);
  }, [tasks, dateFilter, searchQuery, filters, userData, projects]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewClick = async (taskId) => {
    try {
      const task = await Service.getTaskById(taskId);
      setSelectedTask(task);
      setTaskID(taskId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskID(null);
  };

  // ✅ Table setup (moved after hook so we can access pageIndex/pageSize)
  const data = useMemo(() => taskFilter, [taskFilter]);
  const columns = useMemo(
    () => [
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
        Cell: ({ value }) => {
          const displayStatus =
            value === "COMPLETE_OTHER" ? "Completed(T.I.)" : value;
          return (
            <span
              className={`px-2 py-1 rounded-full border flex-nowrap ${statusColor(value)}`}
            >
              {displayStatus}
            </span>
          );
        },
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
          return `${parseInt(h)} h ${parseInt(m)} min`;
        },
      },
      {
        Header: "Taken Hours",
        accessor: "taken_hours",
        Cell: ({ row }) => {
          const task = row.original;
          const taken = task?.workingHourTask?.find(
            (rec) => rec.task_id === task.id,
          )?.duration;
          if (!taken) return "N/A";
          const total = parseInt(taken, 10);
          const h = Math.floor(total / 60);
          const m = total % 60;
          return `${h} h ${m} min`;
        },
      },
    ],
    [],
  );

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
      initialState: { pageIndex: 0, pageSize: 25 },
    },
    useSortBy,
    usePagination,
  );

  const exportReport = () => {
    if (!taskFilter || taskFilter.length === 0) {
      alert("No tasks found for the selected date or filters.");
      return;
    }

    const exportData = taskFilter.map((task) => {
      const user = task.user || {};
      const fullName =
        [user.f_name, user.m_name, user.l_name].filter(Boolean).join(" ") ||
        "N/A";

      // Convert "4:0:00" → hours and minutes
      let allocatedHours = "N/A";
      if (task.duration) {
        const [h = "0", m = "0"] = task.duration.split(":");
        allocatedHours = `${parseInt(h)} h ${parseInt(m)} min`;
      }

      // Convert workingHourTask[0].duration (in minutes) → hours/minutes
      let takenHours = "N/A";
      if (
        task.workingHourTask?.length > 0 &&
        task.workingHourTask[0].duration
      ) {
        const total = parseInt(task.workingHourTask[0].duration, 10);
        const h = Math.floor(total / 60);
        const m = total % 60;
        takenHours = `${h} h ${m} min`;
      }

      // ✅ Extract only the `.data` field from taskcomment
      const commentData = Array.isArray(task.taskcomment)
        ? task.taskcomment
            .map((c) =>
              typeof c === "object" && c.data ? c.data.trim() : null,
            )
            .filter(Boolean)
        : [];

      // Also include any simple comments array if present
      const otherComments = Array.isArray(task.comments)
        ? task.comments.filter(Boolean)
        : [];

      // Combine both
      const allComments = [...commentData, ...otherComments];

      const commentsText =
        allComments.length > 0 ? allComments.join("\n") : "No Comments";

      return {
        "Task Name": task.name || "N/A",
        "User Name": fullName,
        "Project Name": task.project?.name || "N/A",
        Status: task.status || "N/A",
        "Due Date": new Date(task.due_date).toLocaleDateString(),
        "Allocated Hours": allocatedHours,
        "Taken Hours": takenHours,
        Comments: commentsText,
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Task Report");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `Task_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  return (
    <div className="h-fit bg-white/70 rounded-lg shadow-md overflow-y-auto">
      <div className="p-4 my-2 space-y-2">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 w-full">
          <div className="flex gap-4 w-full z-40">
            {/* SEARCH BOX */}
            <div className="w-full md:w-64">
              <Input
                type="text"
                label="Search Task"
                placeholder="Type task name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            {/* ✅ CustomSelect for User */}
            <CustomSelect
              label="Select User"
              name="user"
              placeholder="Filter by User"
              options={[
                { label: "All Users", value: "" },
                ...(userData?.map((user) => ({
                  label: [user.f_name, user.m_name, user.l_name]
                    .filter(Boolean)
                    .join(" "),
                  value: user.id?.toString(),
                })) || []),
              ]}
              onChange={(_, value) => {
                setFilters((prev) => ({ ...prev, user: value || "" }));
              }}
            />
            <CustomSelect
              label="Select Project"
              name="project"
              placeholder="Filter by Project"
              options={[
                { label: "All Projects", value: "" },
                ...(projects?.map((proj) => ({
                  label: proj.name,
                  value: proj.name,
                })) || []),
              ]}
              value={filters.project}
              onChange={(_, value) => {
                setFilters((prev) => ({ ...prev, project: value || "" }));
              }}
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="border p-2 rounded-lg w-full bg-white border-gray-500"
            >
              <option value="">All Status</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="BREAK">BREAK</option>
              <option value="IN_REVIEW">IN REVIEW</option>
              <option value="VALIDATE_COMPLETE">VALIDATE & COMPLETED</option>
              <option value="USER_FAULT">USER FAULT</option>
              <option value="COMPLETE_OTHER">
                COMPLETED (TECHNICAL ISSUE)
              </option>
              <option value="COMPLETE">COMPLETED</option>
            </select>
          </div>
          <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
        </div>

        {/* ✅ Table */}
        <div className="overflow-x-auto h-[80vh] border rounded-md">
          <table
            {...getTableProps()}
            className="min-w-full text-sm text-center border"
          >
            <thead className="sticky top-0 z-10 bg-teal-200">
              {headerGroups.map((headerGroup, headerGroupIdx) => (
                <tr
                  key={headerGroup.id || headerGroupIdx}
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {/* Add S.No header manually */}
                  <th className="px-4 py-2 font-semibold border whitespace-nowrap">
                    S.No
                  </th>

                  {headerGroup.headers.map((column, colIdx) => (
                    <th
                      key={column.id || colIdx}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-2 py-1 font-semibold border whitespace-nowrap"
                    >
                      {column.render("Header")}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ↓"
                          : " ↑"
                        : ""}
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
                page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      key={row.id}
                      {...row.getRowProps()}
                      className="hover:bg-teal-100"
                      onClick={() => handleViewClick(row.original.id)}
                    >
                      <td className="px-2 py-2 border">{index + 1}</td>
                      {row.cells.map((cell) => (
                        <td
                          key={cell.id}
                          {...cell.getCellProps()}
                          className="px-2 py-2 text-sm border"
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
        <Button
          onClick={exportReport}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Report
        </Button>
        <div className="flex justify-between items-center mt-1 px-4">
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
            {[25, 50, 75, 100].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
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
