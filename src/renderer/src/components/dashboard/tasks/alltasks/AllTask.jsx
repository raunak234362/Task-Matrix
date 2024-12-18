/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import { Button, Header, SelectedTask } from "../../../index";
import { useDispatch, useSelector } from "react-redux";
import { showTask, showTaskByID } from "../../../../store/taskSlice";

const AllTask = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state?.taskData?.taskData);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  console.log(tasks);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleFabricatorFilter = (e) => {
    setProjectFilter(e.target.value);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredTasks = sortedTasks.filter((project) => {
    return (
      project?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) &&
      (statusFilter === "" || project.status === statusFilter) &&
      (projectFilter === "" || project.project.name === projectFilter)
    );
  });

  const uniqueProject = [
    ...new Set(tasks?.map((project) => project?.project?.name)),
  ];

  const handleViewClick = async (taskId) => {
    try {
      const task = await Service.getTaskById(taskId);
      console.log("Task Details:", task);
      // dispatch(showTaskByID(task));
      setSelectedTask(task);
      setTaskID(task.id);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskID(null);
  };

  const color = (priority) => {
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
        break;
    }
  };

  const setPriorityValue = (value) => {
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
        break;
    }
  };

  return (
    <div>
      <div className="table-container h-[80vh] w-full rounded-lg">
        <div className=" shadow-xl table-container w-full rounded-lg">
          <div className="mx-5 my-3">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by task name..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-4 py-2 border rounded-md w-full md:w-1/4"
              />
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="px-4 py-2 border rounded-md w-full md:w-1/4"
              >
                <option value="">All Status</option>
                <option value="ASSINGED">ASSIGNED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON-HOLD">ON-HOLD</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="DELAY">DELAY</option>
                <option value="COMPLETE">COMPLETED</option>
              </select>
              <select
                value={projectFilter}
                onChange={handleFabricatorFilter}
                className="px-4 py-2 border rounded-md w-full md:w-1/4"
              >
                <option value="">All Projects</option>
                {uniqueProject?.map((fabricator) => (
                  <option key={fabricator} value={fabricator}>
                    {fabricator}
                  </option>
                ))}
              </select>
            </div>
            <div className=" py-5 bg-white h-[58vh] overflow-auto rounded-lg">
              <table className="md:w-full w-[90vw] border-collapse text-center md:text-lg text-xs rounded-xl">
                <thead>
                  <tr className="bg-teal-200/70">
                    <th
                      className="px-2 py-1 text-left cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      S.no{" "}
                      {sortConfig.key === "id" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th
                      className="px-2 py-1 text-left cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Project Name{" "}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th
                      className="px-2 py-1 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Task Name{" "}
                      {sortConfig.key === "name " &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th className="px-2 py-1 cursor-default">Assigned User </th>
                    <th
                      className="px-2 py-1 cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status{" "}
                      {sortConfig.key === "status" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th
                      className="px-2 py-1 cursor-pointer"
                      onClick={() => handleSort("priority")}
                    >
                      Priority{" "}
                      {sortConfig.key === "priority" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th
                      className="px-2 py-1 cursor-pointer"
                      onClick={() => handleSort("due_date")}
                    >
                      Task Due Date{" "}
                      {sortConfig.key === "due_date" &&
                        (sortConfig.direction === "ascending" ? "" : "")}
                    </th>
                    <th className="px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr className="bg-white">
                      <td colSpan="8" className="text-center">
                        No Task Found
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task, index) => (
                      <tr
                        key={task.id}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-gray-200/50"
                        }
                      >
                        <td className="border px-1 py-2">{index + 1}</td>
                        <td className="border px-1 py-2">
                          {task?.project?.name}
                        </td>
                        <td className="border px-1 py-2">{task?.name}</td>
                        <td className="border px-1 py-2">{task?.user?.name}</td>
                        <td className="border px-1 py-2">{task?.status}</td>
                        <td className={`border px-1 py-2`}>
                          <span
                            className={`text-sm text-center font-semibold px-3 py-0.5 mx-2 rounded-full border ${color(
                              task?.priority,
                            )}`}
                          >
                            {setPriorityValue(task?.priority)}
                          </span>
                        </td>
                        <td className="border px-1 py-2">
                          {new Date(task?.due_date).toDateString()}
                        </td>
                        <td className="border px-1 flex justify-center py-2">
                          <Button onClick={() => handleViewClick(task?.id)}>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {selectedTask && (
        <SelectedTask
          taskDetail={selectedTask}
          taskID={taskID}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          setTasks={tasks}
        />
      )}
    </div>
  );
};

export default AllTask;
