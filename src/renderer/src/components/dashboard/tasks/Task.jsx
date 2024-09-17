/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import Service from '../../../api/configAPI'
import { Button, Input, Select } from '../../index'
import { useForm } from 'react-hook-form'

const Task = ({ taskId, setDisplay }) => {
  const [tasks, setTasks] = useState()
  const userType = sessionStorage.getItem('userType')
  const username = sessionStorage.getItem('username')
  const [teamMember, setTeamMember] = useState([])
  const [color, setColor] = useState('')
  const [showProjectDetail, setShowProjectDetail] = useState(false)
  const [showFabricatorDetail, setShowFabricatorDetail] = useState(false)
  const [assignedTo, setAssignedTo] = useState('')
  const { register, handleSubmit } = useForm()
  const [record, setRecord] = useState({})

  useEffect(() => {
    const fetchTask = async () => {
      try {
        console.log(taskId)
        const task = await Service.getTaskById(taskId)
        setTasks(task)
        // console.log('My Task: ', task)
      } catch (error) {
        console.log('Error in fetching task: ', error)
      }
    }

    fetchTask()
  }, [])

  function handleClose() {
    setDisplay(false)
  }

  useEffect(() => {
    const handleProjectChange = async () => {
      try {
        const assigned = tasks?.project?.team?.members?.map((member) => ({
          label: `${member?.role} - ${member?.employee?.name}`,
          value: member?.employee?.id
        }))
        setTeamMember(assigned)
      } catch (error) {
        console.error('Error fetching team details:', error)
      }
    }

    handleProjectChange()
  }, [tasks])

  useEffect(() => {
    switch (tasks?.priority) {
      case 0:
        setColor('bg-green-200 border-green-800 text-green-800')
        break
      case 1:
        setColor('bg-yellow-200 border-yellow-800 text-yellow-800')
        break

      case 2:
        setColor('bg-purple-200 border-purple-800 text-purple-800')
        break

      case 3:
        setColor('bg-red-200 border-red-700 text-red-700')
        break

      default:
        break
    }
  }, [tasks])

  function setPriorityValue(value) {
    switch (value) {
      case 0:
        return 'LOW'

      case 1:
        return 'MEDIUM'

      case 2:
        return 'HIGH'

      case 3:
        return 'CRITICAL'

      default:
        break
    }
  }
  const due_date = new Date(tasks?.due_date)
  const created_on = new Date(tasks?.created_on)
  const endDate = new Date(tasks?.project?.endDate)

  const toggleProjectDetail = () => {
    setShowProjectDetail(!showProjectDetail)
  }

  const toggleFabricatorDetail = () => {
    setShowFabricatorDetail(!showFabricatorDetail)
  }

  function handleAccept() {
    Service.acceptTask(tasks?.id)
      .then((res) => {
        console.log('Accepted Task: ', res)
        if (window.confirm('Task Accepted \n\nDo you wish to start now?')) {
          handleStart(res?.id)
        }
      })
      .catch((err) => {
        console.log('Error in accepting task: ', err)
      })
  }

  function handleStart(id = tasks?.record) {
    Service.startTask(id)
      .then((res) => {
        alert('Tasked Started')
        console.log('Started Task: ', res)
      })
      .catch((err) => {
        console.log('Error in starting task: ', err)
      })
  }

  function handlePause() {
    Service.pauseTask(tasks?.record)
      .then((res) => {
        alert('Tasked Paused')
        console.log('Paused Task: ', res)
      })
      .catch((err) => {
        console.log('Error in pausing task: ', err)
      })
  }

  function handleResume() {
    const fetchResume = Service.resumeTask(tasks?.record)
      .then((res) => {
        setRecord(fetchResume)
        alert('Tasked Resumed')
        console.log('Resumed Task: ', res)
      })
      .catch((err) => {
        console.log('Error in resuming task: ', err)
      })
  }

  console.log(record)

  function handleEnd() {
    Service.endTask(tasks?.record)
      .then((res) => {
        alert('Tasked Ended')
        console.log('Ended Task: ', res)
      })
      .catch((err) => {
        console.log('Error in ending task: ', err)
      })
  }

  function handleAddAssigne() {
    Service.addAssigne(tasks?.id, assignedTo)
      .then((res) => {
        console.log('Assigned Task: ', res)
        alert('Task Assigned Successfully')
      })
      .catch((err) => {
        console.log('Error in assigning task: ', err)
      })
  }

  const onSubmit = async (commentData) => {
    try {
      // console.log("Comment: ", comment);
      // console.log(tasks?.id)
      const response = await Service.addComment(tasks?.id, commentData?.comment, commentData?.file)
      console.log('Comment Response: ', response)
      alert('Comment Added Successfully')
    } catch (error) {
      console.error('Error in adding comment: ', error)
    }
  }

  // const fetchTaskRecord = async (id) => {
  //   try {
  //     const taskRecord = await Service.resumeTaskDetail(id);
  //     setRecord(taskRecord);
  //     console.log('Task Record:', taskRecord);
  //   } catch (error) {
  //     console.error('Failed to fetch task record:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (taskId) {
  //     fetchTaskRecord(taskId);
  //   }
  // }, [taskId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 h-[85vh] overflow-hidden ">
        <div className="flex justify-between mb-5">
          <div className="text-2xl">
            <span className="font-bold text-gray-800">Task Name:</span> {tasks?.name}
          </div>
          <button
            className="text-xl font-bold bg-gray-600 text-white px-5 rounded-lg"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        <div className="main-container h-[80vh] overflow-y-auto ">
          <div className="m-2 p-5 shadow-lg rounded-lg  bg-white">
            {taskId ? (
              <>
                <div className="flex flex-row justify-between"></div>
                <hr className="mb-5 border-2 rounded-lg" />

                <div className="space-y-4">
                  {/* Task Detail */}
                  <div className="">
                    <span className="font-bold text-gray-800 w-40">Task Description:</span>{' '}
                    <span className=" flex flex-wrap w-full text-lg">{tasks?.description}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-bold text-gray-800 w-40">Assigned Date:</span>{' '}
                    <span className="text-lg">{created_on?.toDateString()}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-bold text-gray-800 w-40">Due Date:</span>{' '}
                    <span className="text-lg">{due_date?.toDateString()}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-bold text-gray-800 w-40">Duration:</span>{' '}
                    <span className="text-lg">{tasks?.duration}</span>
                  </div>
                  <div className="flex items-center py-2">
                    <span className="font-bold text-gray-800 w-40">Status:</span>{' '}
                    <span className="text-lg">
                      {tasks?.status === 'IN-PROGRESS' && (
                        <span className="bg-green-100 text-green-400 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-green-400">
                          In-Progress
                        </span>
                      )}
                      {tasks?.status === 'ON-HOLD' && (
                        <span className="bg-yellow-100 text-yellow-700 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-yellow-700">
                          On-Hold
                        </span>
                      )}
                      {tasks?.status === 'BREAK' && (
                        <span className="bg-red-100 text-red-600 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-red-600">
                          Break
                        </span>
                      )}
                      {tasks?.status === 'IN-REVIEW' && (
                        <span className="bg-orange-100 text-orange-600 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-orange-600">
                          In-Review
                        </span>
                      )}
                      {tasks?.status === 'Completed' && (
                        <span className="bg-green-100 text-green-800 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-green-800">
                          Completed
                        </span>
                      )}
                      {tasks?.status === 'APPROVED' && (
                        <span className="bg-purple-100 text-purple-600 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-purple-600">
                          Approved
                        </span>
                      )}
                      {tasks?.status === 'ASSINGED' && (
                        <span className="bg-pink-100 text-pink-500 text-sm text-center font-medium me-2 px-3 py-2 rounded-full border border-pink-500">
                          Assigned
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center py-2">
                    <span className="font-bold text-gray-800 w-40">Priority:</span>{' '}
                    <span
                      className={`text-sm text-center font-semibold px-3 py-2 rounded-full border ${color}`}
                    >
                      {setPriorityValue(tasks?.priority)}
                    </span>
                  </div>
                  <div className="flex flex-row mt-2 items-center">
                    <span className="font-bold text-gray-800 w-40">Task Actions:</span>

                    {tasks?.status === 'ASSIGNED' || tasks?.status === 'ON-HOLD' ? (
                      <>
                        <Button
                          className="bg-green-500 flex justify-center font-semibold items-center rounded-full w-28 hover:bg-green-800"
                          onClick={tasks?.status === 'ON-HOLD' ? handleStart : handleAccept}
                        >
                          {tasks?.status === 'ON-HOLD' ? 'Start' : 'Accept'}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-row justify-center items-center gap-x-5">
                          {/* Show Pause button if the task is running */}
                          {tasks?.status === 'IN-PROGRESS' && (
                            <Button
                              className="bg-yellow-500 flex justify-center font-semibold items-center rounded-full w-28 hover:bg-yellow-700"
                              onClick={handlePause}
                            >
                              Pause
                            </Button>
                          )}

                          {/* Show Resume button if the task is paused */}
                          {tasks?.status === 'BREAK' && (
                            <Button
                              className="bg-green-500 flex justify-center font-semibold items-center rounded-full w-28 hover:bg-green-700"
                              onClick={handleResume}
                            >
                              Resume
                            </Button>
                          )}

                          {/* Always show End button */}
                          <Button
                            className="bg-red-500 flex justify-center font-semibold items-center rounded-full w-28 hover:bg-red-800"
                            onClick={handleEnd}
                          >
                            End
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="shadow-xl rounded-lg w-full p-5 bg-gray-50">
                    <div className="font-bold text-gray-800 mb-4">People Assigned:</div>
                    <div className="flex items-center">
                      <table className="min-w-full bg-white">
                        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                          <tr>
                            <th className="py-3 px-6 text-left">S.No</th>
                            <th className="py-3 px-6 text-left">Assigned By</th>
                            <th className="py-3 px-6 text-left">Assigned To</th>
                            <th className="py-3 px-6 text-left">Assigned On</th>
                            <th className="py-3 px-6 text-left">Approved By</th>
                            <th className="py-3 px-6 text-left">Approved On</th>
                            {(userType === 'admin' ||
                              username === tasks?.project?.manager?.username) && (
                              <th className="py-3 px-6 text-left">Action</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-medium">
                          {tasks?.assigned?.map((task, index) => (
                            <tr
                              key={task.id}
                              className="border-b border-gray-200 hover:bg-gray-100"
                            >
                              <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>

                              <td className="py-3 px-6 text-left">{task?.assigned_by?.name}</td>
                              <td className="py-3 px-6 text-left">{task?.assigned_to?.name}</td>
                              <td className="py-3 px-6 text-left">
                                {new Date(task?.assigned_on).toDateString()}
                              </td>
                              <td className="py-3 px-6 text-left">
                                {task?.approved_by?.name || (
                                  <span className="text-red-500">Yet Not Approved</span>
                                )}
                              </td>
                              <td className="py-3 px-6 text-left">
                                {task?.approved_on ? (
                                  new Date(task?.approved_on).toDateString()
                                ) : (
                                  <span className="text-red-500">Yet Not Approved</span>
                                )}
                              </td>
                              {(userType === 'admin' ||
                                username === tasks?.project?.manager?.username) && (
                                <td className="py-3 px-6 text-left">
                                  <Button
                                    className={`${
                                      task?.approved_on
                                        ? 'bg-gray-300 text-gray-700'
                                        : 'bg-green-300 text-green-900'
                                    } px-2 py-0.5 rounded-full`}
                                    disabled={task?.approved_on}
                                  >
                                    {task?.approved_on ? 'Approved' : 'Approve'}
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* select Assignee */}
                  <div className="flex flex-row  shadow-xl gap-5 rounded-lg w-full p-5 mt-5 bg-gray-50">
                    <div>
                      <Select
                        label="Select Assignee"
                        options={teamMember}
                        className=" w-80 h-10"
                        onChange={(e) => {
                          if (e.target.value === '') {
                            setAssignedTo('')
                          } else {
                            setAssignedTo(e.target.value)
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        className="bg-teal-600 py-1 font-bold hover:bg-teal-900"
                        onClick={handleAddAssigne}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* comment */}

                  <br />

                  <div className="grid grid-cols-2 gap-5">
                    {/* Project */}
                    <div>
                      <div className="text-xl flex gap-2 items-center">
                        <span className="font-bold text-gray-800">Project Detail:</span>{' '}
                        <span
                          className="cursor-pointer text-blue-600"
                          onClick={toggleProjectDetail}
                        >
                          {tasks?.project?.name}
                        </span>
                      </div>
                      {showProjectDetail && (
                        <div className="space-y-4 ml-8">
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">Project Leader:</span>{' '}
                            <span>{tasks?.project?.leader?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">Project Manager:</span>{' '}
                            <span>{tasks?.project?.manager?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">Project Team:</span>{' '}
                            <span>{tasks?.project?.team?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">
                              Project Description:
                            </span>{' '}
                            <span>{tasks?.project?.description}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">Project Stage:</span>{' '}
                            <span>{tasks?.project?.stage}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">Project Status:</span>{' '}
                            <span>{tasks?.project?.status}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800 w-40">
                              Project Approval Date:
                            </span>{' '}
                            <span>{endDate?.toDateString()}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fabricator */}
                    {userType === 'admin' || userType === 'manager' ? (
                      <div>
                        <div className="text-xl flex items-center gap-2">
                          <span className="font-bold text-gray-800">Fabricator Detail:</span>{' '}
                          <span
                            className="cursor-pointer text-blue-600"
                            onClick={toggleFabricatorDetail}
                          >
                            {tasks?.fabricator?.name}
                          </span>
                        </div>
                        {showFabricatorDetail && (
                          <div className="space-y-4 ml-8">
                            <div className="flex items-center">
                              <span className="font-bold text-gray-800 w-40">Country:</span>{' '}
                              <span>{tasks?.fabricator?.country}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-bold text-gray-800 w-40">State:</span>{' '}
                              <span>{tasks?.fabricator?.state}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-bold text-gray-800 w-40">City:</span>{' '}
                              <span>{tasks?.fabricator?.city}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-bold text-gray-800 w-40">Zipcode:</span>{' '}
                              <span>{tasks?.fabricator?.zipCode}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col  shadow-xl gap-5 rounded-lg w-full p-5 mt-5 bg-gray-50">
                  <div className="font-bold text-gray-800 text-2xl">Comments:</div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-row w-full">
                      <div className="w-full">
                        <Input
                          type="textarea"
                          className="w-3/4 h-20"
                          placeholder="Add Comment"
                          // value={newComment}
                          // onChange={(e) => setNewComment(e.target.value)}
                          {...register('comment')}
                        />
                        <Input
                          label="Upload file/document"
                          name="file"
                          className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                          type="file"
                          id="file"
                          accept=".pdf, image/*"
                          // onChange={handleContractChange}
                          // onClick={handleContractChange}

                          {...register('file')}
                        />
                        <Button
                          className="bg-teal-500 py-0.5 hover:bg-teal-800 font-semibold"
                          type="submit"
                        >
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </form>
                  {tasks?.comments?.length > 0 && (
                    <div className=" shadow-xl bg-slate-200/50 rounded-lg p-5">
                      <div className="space-y-4">
                        {tasks?.comments?.map((comment, index) => (
                          <div className="bg-white p-4 rounded-lg shadow-md" key={index}>
                            <div className="flex items-center mb-2">
                              <span className="font-bold text-gray-800">{comment?.user?.name}</span>
                              <span className="text-gray-500 text-sm ml-2">
                                {new Date(comment?.created_on).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="text-gray-600">
                              <div>{comment?.data} </div>
                              {comment?.file && (
                                <div>
                                  <a
                                    href={comment?.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    View File
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div>
                <h1 className="text-2xl flex font-bold uppercase bg-slate-500 text-white py-10 justify-center items-center">
                  No Task
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Task
