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
import { CustomSelect } from "../..";

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

    // date filter (same as yours)
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
        Header: "Status",
        accessor: "status",
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
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <Button onClick={() => handleViewClick(row.original.id)}>View</Button>
        ),
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
      initialState: { pageIndex: 0, pageSize: 15 },
    },
    useSortBy,
    usePagination,
  );

  return (
    <div className="h-fit bg-white/70 rounded-lg shadow-md overflow-y-auto">
      <div className="p-4 my-2 space-y-2">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 w-full">
          <div className="flex gap-4 w-full z-40">
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
            <select
              name="project"
              value={filters.project}
              onChange={handleFilterChange}
              className="border p-2 rounded-lg w-full"
            >
              <option value="">All Projects</option>
              {projects?.map((proj) => (
                <option key={proj.id} value={proj.name}>
                  {proj?.name}
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
              <option value="VALIDATE_COMPLETE">VALIDATE & COMPLETED</option>
              <option value="COMPLETE_OTHER">
                COMPLETED (TECHNICAL ISSUE)
              </option>
              <option value="COMPLETE">COMPLETED</option>
            </select>
          </div>
          <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
        </div>

        {/* ✅ Table */}
        <div className="overflow-x-auto h-[90vh] border rounded-md">
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
                      className="px-4 py-2 font-semibold border whitespace-nowrap"
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
                    >
                      <td className="px-4 py-2 border">{index + 1}</td>
                      {row.cells.map((cell) => (
                        <td
                          key={cell.id}
                          {...cell.getCellProps()}
                          className="px-4 py-2 border"
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
