/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import Service from '../../../../api/configAPI';
import GanttChart from '../../charts/GhantChart';
import GaantChartt from '../../charts/GaantChartt';
import Header from '../../Header';

const GaantChart = () => {
  const [users, setUsers] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [filterRole, setFilterRole] = useState('All'); // New state for filtering by role
  const [sortOption, setSortOption] = useState('name'); // New state for sorting
  const token = sessionStorage.getItem('token');

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const userData = await Service.getAllUser(token); // Assume you have a Service method to fetch all users
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []);

  // Fetch tasks for each user and segregate the team
  useEffect(() => {
    async function fetchTasksForUsers() {
      const userTaskDetails = await Promise.all(
        users.map(async (user) => {
          const tasks = await Service.fetchCalendar2(new Date().toISOString(), user.username); // Fetch tasks by user
          return {
            ...user,
            tasks, // Add tasks for this user
          };
        })
      );
      setTaskDetails(userTaskDetails); // Set all task details with user data
    }

    if (users.length > 0) {
      fetchTasksForUsers();
    }
  }, [users]);

  // Filter users by role
  const filteredTaskDetails = filterRole === 'All' 
    ? taskDetails 
    : taskDetails.filter((user) => user.role === filterRole);

  // Sort users based on selected option
  const sortedTaskDetails = [...filteredTaskDetails].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'role') {
      return a.role.localeCompare(b.role);
    } else if (sortOption === 'startDate') {
      return new Date(a.tasks[0]?.created_on) - new Date(b.tasks[0]?.created_on);
    } else if (sortOption === 'endDate') {
      return new Date(a.tasks[0]?.due_date) - new Date(b.tasks[0]?.due_date);
    }
    return 0;
  });

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6"></h1>

      {/* Filters and Sorting */}
      <div className="flex items-center justify-between mb-6">
        {/* Filter by Role */}
       
        {/* Sorting */}
        <div className="flex items-center">
          <label className="mr-2 font-medium">Sort by:</label>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="startDate">Task Start Date</option>
          </select>
        </div>
      </div>

      {/* Gantt Chart */}
      <GaantChartt taskData={sortedTaskDetails} />
    </div>
  );
};

export default GaantChart;
