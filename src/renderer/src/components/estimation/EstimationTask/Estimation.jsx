/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from "react";
import Service from "../../../api/configAPI";
import { useSortBy, useTable } from "react-table";
import Button from "../../fields/Button";
import GetEstimation from "../GetEstimation/GetEstimation";

const Estimation = () => {
  const [estimationTasks, setEstimationTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState(null); // Add error state for user feedback
  const [specificTask, setSpecificTask] = useState("");
  const [displayTask, setDisplayTask] = useState(false);
  // Fetch tasks on mount
  const fetchEstimationTask = async () => {
    try {
      const response = await Service.allEstimationTasks();
      console.log("Fetched data:", response);
      // Ensure response is an array; fallback to empty array if not
      setEstimationTasks(Array.isArray(response) ? response : []);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Fetch error:", error);
      setEstimationTasks([]); // Fallback to empty array
      setError("Failed to fetch tasks. Please try again later.");
    }
  };

  useEffect(() => {
    fetchEstimationTask();
  }, []);

  // Memoize filtered and sorted tasks
  const filteredEstimationTasks = useMemo(() => {
    // Ensure estimationTasks is an array
    const tasks = Array.isArray(estimationTasks) ? estimationTasks : [];

    // Filter tasks by status
    const filtered = statusFilter
      ? tasks.filter((task) => task.status === statusFilter)
      : tasks;

    // Sort tasks by created_on date (descending, newest first)
    return filtered.sort((a, b) => {
      const dateA = a.created_on ? new Date(a.created_on) : new Date(0);
      const dateB = b.created_on ? new Date(b.created_on) : new Date(0);
      return dateB - dateA; // Descending order
    });
  }, [estimationTasks, statusFilter]);

  // Define table columns
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        id: "serial",
        Cell: ({ row }) => row.index + 1,
        disableSortBy: true,
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ value, row }) => value || `Task ${row.index + 1}`,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => value?.substring(0, 60) || "No description",
      },
      {
        Header: "Created On",
        accessor: "startDate",
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : "N/A",
        sortType: "datetime",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => value || "Unknown",
      },
      {
        Header: "Assigned Hours",
        accessor: "duration",
        Cell: ({ value, row }) =>
          value
            ? (row.original.parseDurationToMinutes?.(value) / 60).toFixed(2)
            : "0.00",
      },
      {
        Header: "Working Hours",
        accessor: "workingHourTask",
        Cell: ({ value }) =>
          value
            ? value
                .reduce((total, hour) => total + (hour.duration / 60 || 0), 0)
                .toFixed(2)
            : "0.00",
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
              // disabled={!canView}
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
        // disableSortBy: true,
      },
    ],
    [],
  );

  // Initialize react-table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: filteredEstimationTasks,
        getRowId: (row, index) => row.id || `row-${index}`,
      },
      useSortBy,
    );

  const unlockableStatuses = ["ASSIGNED", "IN_PROGRESS", "BREAK"];

  const highestPriorityTask = estimationTasks
    .filter((task) => unlockableStatuses.includes(task.status))[0];

  const unlockableTaskId = highestPriorityTask?.id;

  function handleTaskView(taskId) {
    setSpecificTask(taskId);
    setDisplayTask(true);
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETE">Complete</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="UNKNOWN">Unknown</option>
          </select>
        </div>
        <table
          {...getTableProps()}
          className="w-full border-collapse text-center text-sm"
        >
          <thead className="bg-teal-200/70">
            {headerGroups.map((headerGroup, hgIdx) => (
              <tr key={hgIdx} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, colIdx) => (
                  <th
                    key={colIdx}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-2 py-1 uppercase border cursor-pointer select-none"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ↓"
                          : " ↑"
                        : ""}
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
                  No tasks assigned
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="even:bg-gray-100"
                    key={row.id}
                  >
                    {row.cells.map((cell, cellIdx) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-1 py-2 border"
                        key={cellIdx}
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
      {displayTask && (
        <GetEstimation task={specificTask} setDisplay={setDisplayTask} />
      )}
    </>
  );
};

export default Estimation;
