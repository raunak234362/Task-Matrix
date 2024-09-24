/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { addDays, format, differenceInDays, parseISO, isValid } from 'date-fns';

const GanttChart = ({ taskData }) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('All');
  const [scrollLeft, setScrollLeft] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    const taskDetails = taskData || [];
    setData(taskDetails);
  }, [taskData]);

  // Helper function to validate dates
  const isValidDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
      return false;
    }
    const date = parseISO(dateString);
    return isValid(date);
  };

  // Ensure the project has valid start and end dates
  const dateData = data.map((task) => {
    if (!isValidDate(task?.tasks[0]?.created_on) || !isValidDate(task?.tasks[0]?.due_date)) {
      return 'Invalid Date';
    }

    const projectDuration = differenceInDays(new Date(task?.tasks[0]?.due_date), new Date(task?.tasks[0]?.created_on)) + 1;
    const daysArray = Array.from({ length: projectDuration }, (_, i) =>
      addDays(parseISO(task?.tasks[0]?.created_on), i)
    );

    return {
      projectDuration,
      daysArray,
    };
  });

  // Filtering team members based on selected role
  const filteredTeam =
    filter === 'All'
      ? data.map((task) => task || [])
      : data.flatMap((task) => (task.team || []).filter((member) => member?.role === filter));

  useEffect(() => {
    const handleScroll = () => {
      if (chartRef.current) {
        setScrollLeft(chartRef.current.scrollLeft);
      }
    };

    const chartElement = chartRef.current;
    if (chartElement) {
      chartElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chartElement) {
        chartElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const renderGanttChart = () => {
    return (
      <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <div className="absolute left-0 top-0 bottom-0 w-48 bg-gray-200 z-10">
          <div className="h-8"></div>
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className="h-10 flex items-center px-2 font-medium text-sm text-gray-700 truncate bg-gray-200 border-b"
            >
              {member.name} ({member.role})
            </div>
          ))}
        </div>
        <div className="overflow-x-auto" ref={chartRef}>
          <div className="min-w-max pl-48">
            {/* Date Row */}
            <div className="flex h-8 bg-gray-300">
              {dateData[0]?.daysArray?.map((day, index) => (
                <div
                  key={index}
                  className="w-8 mt-2 flex-shrink-0 text-center text-xs text-gray-600"
                >
                  {format(day, 'dd')}
                </div>
              ))}
            </div>

            {/* Team Members' Tasks */}
            {filteredTeam.map((member) => (
              <div key={member.id} className="flex mt-2 h-10">
                <div className="w-48 flex-shrink-0"></div>
                <div className="flex-grow relative">
                  {member.tasks.map((task) => {
                    if (!isValidDate(task?.created_on) || !isValidDate(task?.due_date)) {
                      return null; // Skip tasks with invalid dates
                    }

                    const taskStart = Math.max(
                      differenceInDays(parseISO(task?.created_on), parseISO(data[0]?.tasks[0]?.created_on)),
                      0
                    );
                    const taskDuration =
                      differenceInDays(parseISO(task?.due_date), parseISO(task.created_on)) + 1;

                    return (
                      <div
                        key={task.id}
                        className="absolute h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs text-white font-medium transform transition-transform duration-300 ease-in-out hover:scale-105"
                        style={{
                          left: `${(taskStart / dateData[0].projectDuration) * 100}%`,
                          width: `${(taskDuration / dateData[0].projectDuration) * 100}%`,
                        }}
                        title={`${task.name} (${format(parseISO(task.created_on), 'MMM dd')} - ${format(parseISO(task.due_date), 'MMM dd')})`}
                      >
                        <span className="truncate px-2">{task.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">
          Project Duration: 
          {isValidDate(data[0]?.tasks[0]?.created_on) && isValidDate(data[0]?.tasks[0]?.due_date)
            ? `${format(parseISO(data[0]?.tasks[0]?.created_on), 'yyyy-MM-dd')} - ${format(parseISO(data[0]?.tasks[0]?.due_date), 'yyyy-MM-dd')}`
            : "Invalid Dates"}
        </div>
        <div className="relative inline-block text-left">
          <select
            className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Modeler">Modeler</option>
            <option value="Erector">Erector</option>
            <option value="Checker">Checker</option>
            <option value="Detailer">Detailer</option>
          </select>
        </div>
      </div>
      {renderGanttChart()}
    </div>
  );
};

export default GanttChart;
