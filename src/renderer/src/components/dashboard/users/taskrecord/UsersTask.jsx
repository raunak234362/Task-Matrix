/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React from 'react'

const UsersTask = ({ task, onClose }) => {
  console.log(task)
  if (!task) return <p>Select a task to view details.</p>

  function durToHour(params) {
    if (!params) return 'N/A'

    const parts = params.split(' ')
    let days = 0
    let timePart = params

    // If duration contains days part, it will have two parts
    if (parts.length === 2) {
      days = parseInt(parts[0], 10) // extract days
      timePart = parts[1] // extract the time part
    }

    // Time part is in format HH:MM:SS
    const [hours, minutes, seconds] = timePart.split(':').map(Number)

    const totalHours = days * 24 + hours // Convert days to hours and add them
    return `${totalHours}h ${minutes}m`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[65vh] overflow-x-auto p-5 rounded-lg shadow-lg w-[40vw] ">
      <div className="flex justify-between my-5 bg-teal-200/50 p-2 rounded-lg">
          <h2 className="text-2xl font-bold">User's Task</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex flex-row gap-28">
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Task Title:</h2>
              <p>{task?.task?.name || 'N/A'}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-md font-medium">Task Description:</h3>
              <p>{task?.task?.description || 'No description provided'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium">Start Date:</h3>
              <p>
                {task?.task?.created_on
                  ? new Date(task?.task?.created_on).toISOString().slice(0, 10)
                  : 'N/A'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium">Due Date:</h3>
              <p>{task?.task?.due_date || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium">Time Allotted:</h3>
              <p>{durToHour(task?.task?.duration) ? `${durToHour(task.task?.duration)}` : 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium">Time Taken:</h3>
              <p>
                {task?.time_taken
                  ? `${Math.floor(task.time_taken / 3600)}h ${Math.floor(
                      (task.time_taken % 3600) / 60
                    )}m`
                  : 'N/A'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium">Task Status:</h3>
              <p>{task?.task?.status || 'N/A'}</p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold">Project:</h3>
              <p>{task?.task?.project?.name || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium">Project Decription:</h3>
              <p>{task?.task?.project?.description || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium">Project Manager:</h3>
              <p>{task?.task?.project?.manager?.name || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium">Project Leader:</h3>
              <p>{task?.task?.project?.leader?.name || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium">Project Tool:</h3>
              <p>{task?.task?.project?.tool || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersTask
