/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Service from '../../../../api/configAPI'
import Header from '../../Header'
import { Input, Select } from '../../../index'

const TaskRecord = () => {
  const [record, setRecord] = useState([])
  const [user, setUser] = useState('')
  const [searchUser, setSearchUser] = useState([])
  const [sortedUser, setSortedUser] = useState([])
  const [listTask, setListTask] = useState([])
  const token = sessionStorage.getItem('token')
  const userType = sessionStorage.getItem('userType')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const taskRecordUser = await Service.getAllUser(token)
        setSearchUser(taskRecordUser)
        setSortedUser(taskRecordUser)
        console.log(taskRecordUser)
      } catch (error) {
        console.log('Error fetching Task Record of the User:', error)
      }
    }

    fetchUser()
  }, [token])

  useEffect(() => {
    const fetchTask = async () => {
      console.log(user)
      try {
        const UserTask = await Service.taskRecord(user)
        console.log('user Task:--------', UserTask)
        setListTask(UserTask)
        setRecord(UserTask)
      } catch (error) {
        console.log('Error fetching user task', error)
      }
    }

    fetchTask()
  }, [user])

  useEffect(() => {
    const filterTasks = () => {
      let filteredTasks = listTask

      if (userType !== 'user') {
        if (user) {
          filteredTasks = filteredTasks.filter((task) => task.user.username === user)
        }
      }

      setRecord(filteredTasks)
    }
    filterTasks()
  }, [user, listTask, userType])

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

  function secToHour(params) {
    const hours = Math.floor(params / 3600)
    const minutes = Math.floor((params % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  function compare(duration, time) {
    const durationInSeconds = convertToSeconds(duration)
    return durationInSeconds >= time
  }

  function convertToSeconds(duration) {
    const [hours, minutes, seconds] = duration.split(':')
    const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
    return totalSeconds
  }

  return (
    <div>
      <Header title={'My Task Record'} />
      {/* {userType !== 'user' && (
        <div className="flex w-1/2 flex-row gap-5 mt-5">
          <Input
            type="text"
            placeholder="Search user..."
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="px-2 border border-gray-300 rounded-lg"
          />
          <Select
            options={[
              { value: '', label: 'Select user' },
              ...sortedUser.map((u) => ({ value: u.username, label: u.name }))
            ]}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Select user"
          />
        </div>
      )} */}
      <div className="h-[70vh] overflow-y-auto">
        <table className="w-full mt-10 table-auto border-collapse text-center rounded-xl">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                S.no
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Task Title
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Time Alloted
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Time Taken
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Task Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-left font-medium">
            {record?.map((rec, index) => (
              <tr key={rec?.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-200/50'}>
                {console.log('usertask&&&&&&&&&&&&&&', record)}
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{rec?.task?.project?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{rec?.task?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{durToHour(rec?.task?.duration)}</td>
                <td
                  className={`px-6 py-4 whitespace-nowrap ${
                    compare(rec?.task?.duration, rec?.time_taken)
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {secToHour(rec?.time_taken)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{rec?.task?.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TaskRecord
