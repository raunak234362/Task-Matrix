/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, Input, Select } from '../../../index'
import Service from '../../../../api/configAPI'
import { useForm } from 'react-hook-form'

const SelectedTask = ({ task, isOpen, onClose, setTasks }) => {
  const [isEditing, setIsEditing] = useState(false)

  const [newComment, setNewComment] = useState('')
  const userType = sessionStorage.getItem('userType')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  if (!isOpen) return null

  const handleEditClick = (e) => {
    e.preventDefault()
    setIsEditing(true)
  }
  const handleSaveClick = () => {
    setIsEditing(false)
  }

  function durToHour(params) {
    const [hours, minutes] = params.split(":");
    return `${hours}h ${minutes}m`;
  }

  const addComment = async (commentData) => {
    try {
      const response = await Service.addComment(
        task?.id,
        commentData?.comment,
        commentData?.file,
      )
      console.log('Comment Response: ', response)
      alert('Comment Added Successfully')
    } catch (error) {
      console.error('Error in adding comment: ', error)
    }
  }

  const onSubmit = async (taskData) => {
    try {
      const response = await Service.editTask(task?.id, taskData)
      console.log(response)
      setTasks(response)
      alert('Task Updated Successfully')
      onClose()
    } catch (error) {
      console.log('Error in updating task: ', error)
      throw error
    }
  }

  function color(priority) {
    switch (priority) {
      case 0:
        return 'bg-green-200 border-green-800 text-green-800'

      case 1:
        return 'bg-yellow-200 border-yellow-800 text-yellow-800'

      case 2:
        return 'bg-purple-200 border-purple-800 text-purple-800'

      case 3:
        return 'bg-red-200 border-red-700 text-red-700'

      default:
        break
    }
  }

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

  const getTaskById = new Date(task?.due_date)
  const endDate = new Date(task?.endDate)

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white  p-8 rounded-lg shadow-lg w-[80vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Task Details</h2>
        <button
          className="text-xl font-bold bg-gray-600 text-white px-5 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
        </div>

        <div className="h-[80vh]  overflow-y-auto p-4 rounded-lg">
          <div className="grid grid-cols-[60%_40%] gap-x-5 divide-x-2 px-1">
            <div>
              <p className="mb-2">
                <strong className="text-gray-700">Task Name:</strong>{' '}
                {task?.name}
              </p>
              <p className="mb-2">
                <strong className="text-gray-700">Description:</strong>{' '}
                {task?.description}
              </p>
              <p className="mb-2">
                <strong className="text-gray-700">Current User:</strong>{' '}
                {task?.user?.name}
              </p>

              <p className="mb-2">
                <strong className="text-gray-700">Due Date:</strong>{' '}
                {getTaskById?.toDateString()}
              </p>
              <p className="mb-2">
                <strong className="text-gray-700">Duration:</strong>{' '}
                {durToHour(task?.duration)}
              </p>
              <div className="flex flex-row justify-between">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <p className="mb-2 flex flex-row">
                      <strong className="text-gray-700">Status: </strong>{' '}
                      <div className="w-full">
                        {userType !== 'user' && isEditing === true ? (
                          <Select
                            name="status"
                            className="text-base"
                            options={[
                              { label: 'ASSIGNED', value: 'ASSIGNED' },
                              { label: 'IN-PROGRESS', value: 'IN-PROGRESS' },
                              { label: 'ON-HOLD', value: 'ON-HOLD' },
                              { label: 'BREAK', value: 'BREAK' },
                              { label: 'IN-REVIEW', value: 'IN-REVIEW' },
                              { label: 'COMPLETE', value: 'COMPLETE' },
                              { label: 'APPROVED', value: 'APPROVED' },
                            ]}
                            defaultValue={task?.status}
                            {...register('status')}
                          />
                        ) : (
                          <div>{task?.status}</div>
                        )}
                      </div>
                    </p>
                    <div className="flex items-center py-2">
                      <span className="font-bold text-gray-800">Priority:</span>{' '}
                      {isEditing === true ? (
                        <div className="w-full">
                          <Select
                            name="priority"
                            className="text-base"
                            options={[
                              { label: 'LOW', value: 0 },
                              { label: 'MEDIUM', value: 1 },
                              { label: 'HIGH', value: 2 },
                              { label: 'CRITICAL', value: 3 },
                            ]}
                            defaultValue={task?.priority}
                            {...register('priority')}
                          />
                        </div>
                      ) : (
                        <span
                          className={`text-sm text-center font-semibold px-3 py-0.5 mx-2 rounded-full border ${color(
                            task?.priority,
                          )}`}
                        >
                          {setPriorityValue(task?.priority)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {isEditing ? (
                      <Button type="submit">Save</Button>
                    ) : (
                      <Button onClick={handleEditClick}>Update</Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-col justify-between pl-4 gap-y-5">
              {/* <div>
                <div className="text-xl font-bold text-gray-900">
                  Fabricator Detail:
                </div>

                <hr className="m-2" />
                <p className="mb-2">
                  <strong className="text-gray-700">Fabricator Name:</strong>{" "}
                  {task?.fabricator?.name}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">
                    Fabricator Contact Country:
                  </strong>{" "}
                  {task?.fabricator?.country}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">
                    Fabricator Contact State:
                  </strong>{" "}
                  {task?.fabricator?.state}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">
                    Fabricator Contact City:
                  </strong>{" "}
                  {task?.fabricator?.city}
                </p>
              </div> */}
              <div>
                <div className="text-xl font-bold text-gray-900">
                  Project Detail:
                </div>
                <hr className="m-2" />
                <p className="mb-2">
                  <strong className="text-gray-700">Project Name:</strong>{' '}
                  {task?.project?.name}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">
                    Project Description:
                  </strong>{' '}
                  {task?.project?.description}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Project Manager:</strong>{' '}
                  {task?.project?.manager?.name}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Project Stage:</strong>{' '}
                  {task?.project?.stage}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Project Status:</strong>{' '}
                  {task?.project?.status}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center mx-auto  shadow-xl gap-5 rounded-lg  w-[90%] p-5 mt-5 bg-gray-50">
            <div className="font-bold text-gray-800 text-2xl">Comments:</div>
            <div className="flex flex-row w-full">
              <div className="w-full">
                <form onSubmit={handleSubmit(addComment)}>
                  <div className="flex flex-row w-full">
                    <div className="w-full">
                      <Input
                        type="text"
                        className="w-3/4 h-32"
                        placeholder="Add Comment"
                        {...register('comment')}
                      />
                      <Input
                        label="Upload file/document"
                        name="file"
                        className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                        type="file"
                        id="file"
                        accept=".pdf, .doc, image/*"
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
              </div>
            </div>
            {task?.comments?.length > 0 && (
              <div className=" shadow-xl bg-slate-200/50 rounded-lg p-5">
                <div className="space-y-4">
                  {task?.comments?.map((comment, index) => (
                    <div
                      className="bg-white p-4 rounded-lg shadow-md"
                      key={index}
                    >
                      <div className="flex items-center mb-2">
                        <span className="font-bold text-gray-800">
                          {comment?.user?.name}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          {new Date(comment?.created_on).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
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
        </div>
      </div>
    </div>
  )
}

export default SelectedTask
