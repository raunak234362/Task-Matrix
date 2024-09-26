/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import { Button, Header, SelectedTask } from "../../../index";

const AllTask = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const task = await Service.getAllTask();
        setTasks(task);
        setFilteredTasks(task);
        console.log("My Task: ", task);
      } catch (error) {
        console.log("Error in fetching task: ", error);
      }
    };
    fetchTask();
  }, [selectedTask]);

  useEffect(() => {
    let results = tasks.filter(task =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (priorityFilter) {
      results = results.filter(task => setPriorityValue(task.priority) === priorityFilter);
    }

    if (statusFilter) {
      results = results.filter(task => task.status === statusFilter);
    }

    // Sort results if sortConfig is set
    if (sortConfig.key) {
      results.sort((a, b) => {
        const isAsc = sortConfig.direction === 'ascending';
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return isAsc ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return isAsc ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredTasks(results);
  }, [searchTerm, tasks, priorityFilter, statusFilter, sortConfig]);

  const handleViewClick = async (taskId) => {
    console.log(taskId);
    try {
      const task = await Service.getTaskById(taskId);
      setSelectedTask(task);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const sortTasks = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    if (['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(value)) {
      setPriorityFilter(value);
      setStatusFilter('');
    } else if (['ASSIGNED', 'APPROVED', 'IN-PROGRESS'].includes(value)) {
      setStatusFilter(value);
      setPriorityFilter('');
    } else {
      sortTasks(value);
      setPriorityFilter('');
      setStatusFilter('');
    }
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

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return null;
  };

  return (
    <div>
      <Header title={"All Task"} />
      <div className="table-container w-full rounded-lg">
        <div className="py-5 shadow-xl table-container w-full rounded-lg">
          <div className="mx-5 my-5">
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Search by task name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              />
              <select
                onChange={handleSortChange}
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sort/Filter by</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="due_date">Due Date</option>
                <option value="project.name">Project Name</option>
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="CRITICAL">Critical Priority</option>
                <option value="ASSIGNED">Assigned Status</option>
                <option value="APPROVED">Approved Status</option>
                <option value="IN-PROGRESS">In-Progress Status</option>
              </select>
            </div>
            <div className="h-[70vh] overflow-y-auto">
              <table className="w-full table-auto border-collapse text-center rounded-xl">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-1 py-2 cursor-pointer" onClick={() => sortTasks('id')}>S.no {getSortIndicator('id')}</th>
                    <th className="px-1 py-2 cursor-pointer" onClick={() => sortTasks('project.name')}>Project Name {getSortIndicator('project.name')}</th>
                    <th className="px-1 py-2 cursor-pointer" onClick={() => sortTasks('name')}>Task Name {getSortIndicator('name')}</th>
                    <th className="px-1 py-2 cursor-pointer" onClick={() => sortTasks('user.name')}>Current User {getSortIndicator('user.name')}</th>
                    <th className="px-1 py-2 cursor-pointer" onClick={() => sortTasks('status')}>Status {getSortIndicator('status')}</th>
                    <th className="px-1 py-2 cursor-pointer" onClick={() => sortTasks('priority')}>Priority {getSortIndicator('priority')}</th>
                    <th className="px-1 py-2 cursor-pointer" onClick={() => sortTasks('due_date')}>Due Date {getSortIndicator('due_date')}</th>
                    <th className="px-1 py-2">Option</th>
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
                      <tr key={task.id}>
                        <td className="border px-1 py-2">{index + 1}</td>
                        <td className="border px-1 py-2">{task?.project?.name}</td>
                        <td className="border px-1 py-2">{task?.name}</td>
                        <td className="border px-1 py-2">{task?.user?.name}</td>
                        <td className="border px-1 py-2">{task?.status}</td>
                        <td className={`border px-1 py-2`}>
                          <span className={`text-sm text-center font-semibold px-3 py-0.5 mx-2 rounded-full border ${color(task?.priority)}`}>{setPriorityValue(task?.priority)}</span>
                        </td>
                        <td className="border px-1 py-2">{new Date(task?.due_date).toDateString()}</td>
                        <td className="border px-3 flex justify-center py-2">
                          <Button onClick={() => handleViewClick(task?.id)}>View</Button>
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
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AllTask;
