/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Service from '../../../../api/configAPI'
import Header from '../../Header'
import { Input, CustomSelect } from '../../../index'
import UsersTask from './UsersTask'
import { useForm } from 'react-hook-form'

const UsersTaskRecord = () => {
  const [record, setRecord] = useState([])
  // const [user, setUser] = useState('')
  const [searchUser, setSearchUser] = useState([])
  const [sortedUser, setSortedUser] = useState([])
  const [listTask, setListTask] = useState([])
  const [selectedTask, setSelectedTask] = useState(null) // For the selected task
  const [showModal, setShowModal] = useState(false) // Modal state
  const token = sessionStorage.getItem('token')
  const userType = sessionStorage.getItem('userType')
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm()

  const user = watch('user')
  console.log(user)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const taskRecordUser = await Service.getAllUser(token)
        setSearchUser(taskRecordUser)
        setSortedUser(taskRecordUser)
        // console.log(taskRecordUser)
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

    if (user) {
      fetchTask()
    }
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

    if (parts.length === 2) {
      days = parseInt(parts[0], 10)
      timePart = parts[1]
    }

    const [hours, minutes] = timePart.split(':').map(Number)
    const totalHours = days * 24 + hours
    return `${totalHours}h ${minutes}m`
  }

  function secToHour(params) {
    if (!params && params !== 0) return 'N/A'
    const hours = Math.floor(params / 3600)
    const minutes = Math.floor((params % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  function compare(duration, time) {
    const durationInSeconds = convertToSeconds(duration)
    return durationInSeconds >= time
  }

  function convertToSeconds(duration) {
    if (!duration) return 0

    const parts = duration.split(' ')
    let days = 0
    let timePart = duration

    if (parts.length === 2) {
      days = parseInt(parts[0], 10)
      timePart = parts[1]
    }

    const [hours, minutes, seconds] = timePart.split(':').map(Number)
    const totalSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60 + (seconds || 0)
    return totalSeconds
  }

  const handleRowClick = (task) => {
    setSelectedTask(task) // Set the clicked task
    setShowModal(true) // Open the modal
  }

  const closeModal = () => {
    setSelectedTask(null)
    setShowModal(false) // Close the modal
  }

  return (
    <div>
      {userType !== 'user' && (
        <div className="flex w-1/2 flex-row gap-5 mt-5">
          {/* <Input
            type="text"
            label="Enter WBT-ID"
            placeholder="Enter WBT-ID..."
            {...register('user')}
            onChange={setValue}
          /> */}
          <CustomSelect
            label="Select user"
            options={[
              { value: '', label: 'Select user' },
              ...sortedUser
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((u) => ({ value: u.username, label: u.name }))
            ]}
            // onChange={(e) => setUser(e.target.value)}
            {...register('user')}
            placeholder="Select user"
            onChange={setValue}
          />
        </div>
      )}
      <div className="h-[70vh] overflow-y-auto">
        <table className="w-full table-auto border-collapse text-center rounded-xl">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr>
              <th className="px-2 py-3 text-left font-medium text-gray-500 uppercase tracking-wider min-w-[50px]">
                S.no
              </th>
              <th className="px-2 py-3 text-left font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Project
              </th>
              <th className="px-2 py-3 text-left font-medium text-gray-500 uppercase tracking-wider min-w-[180px] break-words">
                Task Title
              </th>
              <th className="px-2 py-3 text-left font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Start Date
              </th>
              <th className="px-2 py-3 text-left font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Due Date
              </th>
              <th className="px-2 py-3 text-left font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Time Allotted
              </th>
              <th className="px-2 py-3 text-left font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Time Taken
              </th>
              <th className="px-2 py-3 text-left font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Task Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y text-left divide-gray-200 font-medium">
            {record?.map((rec, index) => (
              <tr
                key={rec?.id}
                className={index % 2 === 0 ? 'bg-white cursor-pointer' : 'bg-gray-200/50 cursor-pointer'}
                onClick={() => handleRowClick(rec)}
              >
                <td className="px-1 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-2 py-4 whitespace-nowrap">{rec?.task?.project?.name || 'N/A'}</td>
                <td className="px-2 py-4 whitespace-nowrap break-words">
                  {rec?.task?.name || 'N/A'}
                </td>
                <td className="px-2 py-4 whitespace-nowrap">
                  {rec?.task?.created_on
                    ? new Date(rec.task.created_on).toISOString().slice(0, 10)
                    : 'N/A'}
                </td>
                <td className="px-2 py-4 whitespace-nowrap">{rec?.task?.due_date || 'N/A'}</td>
                <td className="px-2 py-4 whitespace-nowrap">{durToHour(rec?.task?.duration)}</td>
                <td
                  className={`px-6 py-4 whitespace-nowrap ${
                    compare(rec?.task?.duration, rec?.time_taken)
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {secToHour(rec?.time_taken)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{rec?.task?.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to show selected task details */}
      {showModal && <UsersTask task={selectedTask} onClose={closeModal} />}
    </div>
  )
}

export default UsersTaskRecord
