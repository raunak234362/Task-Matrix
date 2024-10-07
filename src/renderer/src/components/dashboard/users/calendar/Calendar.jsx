/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday
} from 'date-fns'
import Service from '../../../../api/configAPI'
import { Header, Input, Select } from '../../../index'
import { useForm } from 'react-hook-form'

const colStartClasses = [
  '', // Sunday (no extra classes)
  '', // Monday
  'col-start-2', // Tuesday
  'col-start-3', // Wednesday
  'col-start-4', // Thursday
  'col-start-5', // Friday
  'col-start-6' // Saturday
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Calendar() {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  let [listTask, setListTask] = useState([])
  let [level, setLevel] = useState('')
  let [user, setUser] = useState('')
  // let [users, setUsers] = useState([])
  let [sortedUsers, setSortedUsers] = useState([])
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
  const token = sessionStorage.getItem('token')
  const userType = sessionStorage.getItem('userType')
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm()

  const userData = watch('user')
  console.log(userData)

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth)
  })

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function isWeekOff(day) {
    const info = new Date(day).getDay()
    return info === 0 || info === 6
  }

  async function getTasks(dates) {
    const data = await Service.fetchCalendar(dates, userData)
    console.log(data);
    if (data) {
      setListTask(data)
      return data
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await Service.getAllUser(token)
        // setUsers(usersData)
        setSortedUsers(usersData) // initialize sortedUsers
        console.log(usersData)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [token])

  useEffect(() => {
    async function fetchData() {
      let info
      if (level === '') {
        info = await getTasks(selectedDay)
      } else {
        const data = await getTasks(selectedDay)
        setListTask(() => data?.filter((item) => item.priority === level))
      }
    }
    fetchData()
  }, [level, selectedDay, user])

  return (
    <div className="min-h-screen">
      <Header title={'Calendar'} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={previousMonth}
                className="flex items-center justify-center p-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" aria-hidden="true" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
              <button
                type="button"
                onClick={nextMonth}
                className="flex items-center justify-center p-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-700">
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div className="text-red-500">S</div>
              <div className="text-red-500">S</div>
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(dayIdx === 0 && colStartClasses[getDay(day)], 'py-1.5')}
                >
                  <button
                    type="button"
                    disabled={isWeekOff(day)}
                    onClick={() => !isWeekOff(day) && setSelectedDay(day)}
                    className={classNames(
                      isEqual(day, selectedDay) && 'bg-blue-500 text-white',
                      !isEqual(day, selectedDay) && isToday(day) && 'bg-green-200 text-green-800',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        'bg-white text-gray-900',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        'bg-gray-100 text-gray-400',
                      isWeekOff(day) && 'text-red-500',
                      'flex items-center justify-center h-12 w-full rounded-full transition duration-150 ease-in-out'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <section className="mt-12 bg-white shadow-lg rounded-lg p-6">
            <div className="flex flex-row gap-5 mb-6">
              {/* <Input
                type="text"
                placeholder="Search user..."
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              /> */}
              {userType !== 'user' && (
                <Select
                label='Select User'
                options={[
                  { value: '', label: 'Select user' },
                  ...sortedUsers
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((u) => ({ value: u.username, label: u.name }))
                ]}
                  {...register('user')}
                  onChange={setValue}
                  placeholder="Select user"
                />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Task Scheduled for{' '}
              <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                {format(selectedDay, 'MMM dd, yyyy')}
              </time>
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <PriorityButton level={0} currentLevel={level} setLevel={setLevel} />
              <PriorityButton level={1} currentLevel={level} setLevel={setLevel} />
              <PriorityButton level={2} currentLevel={level} setLevel={setLevel} />
              <PriorityButton level={3} currentLevel={level} setLevel={setLevel} />
            </div>
            <ol className="space-y-2">
              {listTask?.length > 0 ? (
                listTask.map((task) => <Task task={task} key={task?.id} />)
              ) : (
                <p className="text-gray-500">No Tasks for {new Date(selectedDay).toDateString()}</p>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}

function PriorityButton({ level, currentLevel, setLevel }) {
  const priorityColors = [
    { bg: 'bg-green-200', border: 'border-green-800', text: 'text-green-800' },
    { bg: 'bg-yellow-200', border: 'border-yellow-800', text: 'text-yellow-800' },
    { bg: 'bg-purple-200', border: 'border-purple-800', text: 'text-purple-800' },
    { bg: 'bg-red-200', border: 'border-red-700', text: 'text-red-700' }
  ]

  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => setLevel((prev) => (prev === level ? '' : level))}
    >
      <span
        className={`w-5 h-5 border-2 ${priorityColors[level].bg} ${priorityColors[level].border} ${priorityColors[level].text} rounded-full`}
      ></span>
      <span className={`ml-2 ${priorityColors[level].text}`}>
        {currentLevel === level
          ? 'All'
          : ['Low Priority', 'Medium Priority', 'High Priority', 'Critical Priority'][level]}
      </span>
    </div>
  )
}

function Task({ task }) {
  const priorityColors = [
    { bg: 'bg-green-200', border: 'border-green-800', text: 'text-green-800' },
    { bg: 'bg-yellow-200', border: 'border-yellow-800', text: 'text-yellow-800' },
    { bg: 'bg-purple-200', border: 'border-purple-800', text: 'text-purple-800' },
    { bg: 'bg-red-200', border: 'border-red-700', text: 'text-red-700' }
  ]

  return (
    <li
      className={`border-2 p-4 rounded-lg ${priorityColors[task.priority].bg} ${
        priorityColors[task.priority].border
      } ${priorityColors[task.priority].text}`}
    >
      <div className="flex justify-between items-center font-bold">
        <span>
          Project: <span className="font-medium">{task.project.name}</span>
        </span>
        <span>
          Task: <span className="font-medium">{task.name}</span>
        </span>
      </div>
      <div className="flex justify-between items-center font-bold">
        <span>
          Status: <span className="font-medium">{task.status}</span>
        </span>
        <span>
          Priority:{' '}
          <span className="font-medium">
            {['Low', 'Medium', 'High', 'Critical'][task.priority]}
          </span>
        </span>
      </div>
      <div className="font-medium">
        <span>
          <strong>Deadline:</strong> {new Date(task.due_date).toDateString()}
        </span>
      </div>
    </li>
  )
}

export default Calendar
