/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Header, Input, Select } from '../../../index'
import Service from '../../../../api/configAPI'
import { setTaskData } from '../../../../store/taskSlice'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

const AddTask = () => {
  const [projectOptions, setPtojectOptions] = useState([])
  const [project, setProject] = useState({})
  const [parentTaskOptions, setParentTaskOptions] = useState([])
  const [assignedUser, setAssignedUser] = useState([])
  const token = sessionStorage.getItem('token')
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  // FETCH task related to project
  // Fetch project details
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await Service.getAllProject()
        const options = projects
          .filter((project) => project.team != null)
          .map((project) => ({
            label: `${project.name} - ${project.fabricator.name}`,
            value: project.id
          }))
        setPtojectOptions(options)
        console.log(projects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }
    fetchProjects()
  }, [])

  const handleProjectChange = async (projectId) => {
    try {
      const project = await Service.getProject(projectId)
      setProject(project)
      const assigned = project?.team?.members?.map((member) => ({
        label: `${member?.role} - ${member?.employee?.name}`,
        value: member?.employee?.id
      }))
      setAssignedUser(assigned)
    } catch (error) {
      console.error('Error fetching project details:', error)
    }
  }

  const handleParentTasks = async (projectId) => {
    try {
      const parentTasks = await Service.getParentTasks(projectId)
      const options = parentTasks?.map((task) => ({
        label: task?.name,
        value: task?.id
      }))
      setParentTaskOptions(options)
    } catch (error) {
      console.error('Error fetching parent tasks:', error)
    }
  }

  const onSubmit = async (taskData) => {
    try {
      const token = sessionStorage.getItem('token')
      console.log(taskData.project)
      if (!token) {
        throw new Error('Token not found')
      }
      const data = await Service.addTask({
        ...taskData,
        token: token
      })
      console.log('Response from task:', taskData)

      dispatch(setTaskData(data))
      console.log('Task added:', data)
      alert('Successfully added new Task', taskData?.name)
    } catch (error) {
      console.error('Error adding task:', error)
      console.log('Project data:', taskData)
    }
  }

  return (
    <div>
      <div>
        <Header title={'Add Task'} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5">
        <div className="p-5 flex flex-col justify-between gap-5">
          <div className="flex rounded-lg flex-col shadow-lg shadow-black/15 p-8">
            <div className="mt-5">
              <Select
                label="Project:"
                placeholder="Project"
                name="project"
                className="w-full"
                options={[
                  {
                    label: 'Select Project',
                    value: ''
                  },
                  ...projectOptions
                ]}
                onChange={async (e) => {
                  await handleParentTasks(e.target.value)
                  await handleProjectChange(e.target.value)
                  register('project', { required: 'Select a project', value: e.target.value })
                }}
              />
              {errors.project && <p className="text-red-600">{errors.project.message}</p>}
            </div>
            <div className="mt-5">
              <Select
                label="Parent Task: "
                name="parent"
                placeholder="Parent Task"
                className="w-full"
                options={[
                  {
                    label: 'Select Parent Task',
                    value: ''
                  },
                  ...parentTaskOptions
                ]}
                {...register('parent')}
              />
            </div>
            <div className="mt-5">
              <Input
                name="name"
                label="Task Name: "
                placeholder="Task Name"
                className="w-full"
                {...register('name', { required: 'Task Name is required' })}
              />
              {errors.name && <p className="text-red-600">{errors.name.message}</p>}
            </div>
            <div className="mt-5">
              <Select
                label="Priority:"
                name="priority"
                options={[
                  { label: 'LOW', value: 0 },
                  { label: 'MEDIUM', value: 1 },
                  { label: 'HIGH', value: 2 },
                  { label: 'Critical', value: 3 }
                ]}
                className="w-full"
                {...register('priority', { required: 'Priority is required' })}
              />
              {errors.priority && <p className="text-red-600">{errors.priority.message}</p>}
            </div>
            <div className="mt-5">
              <Select
                label="Status:"
                name="status"
                options={[
                  { label: 'ASSIGNED', value: 'ASSINGED' },
                  { label: 'IN PROGRESS', value: 'IN-PROGRESS' },
                  { label: 'ON HOLD', value: 'ON-HOLD' },
                  { label: 'BREAK', value: 'BREAK' },
                  { label: 'IN REVIEW', value: 'IN-REVIEW' },
                  { label: 'COMPLETED', value: 'COMPLETE' },
                  { label: 'APPROVED', value: 'APPROVED' }
                ]}
                className="w-full"
                {...register('status', { required: 'Status is required' })}
              />
              {errors.status && <p className="text-red-600">{errors.status.message}</p>}
            </div>
            <div className="mt-5 w-36">
              <Input
                label="Due Date:"
                name="due_date"
                type="date"
                className="w-full"
                {...register('due_date', { required: 'Due Date is required' })}
              />
              {errors.due_date && <p className="text-red-600">{errors.due_date.message}</p>}
            </div>
            <div className="mt-5">
              <div className="text-lg font-bold">Duration:</div>
              <div className="flex flex-row gap-5 w-1/5">
                <div>
                  <Input
                    type="number"
                    name="hour"
                    placeholder="HH"
                    className="w-full"
                    {...register('hour', { required: 'Hours is required in Duration' })}
                  />
                  {errors.hour && <p className="text-red-600">{errors.hour.message}</p>}
                </div>
                <div>
                  <Input
                    type="number"
                    name="min"
                    placeholder="MM"
                    className="w-full"
                    {...register('min', { required: 'Minutes is required in Duration' })}
                  />
                  {errors.min && <p className="text-red-600">{errors.min.message}</p>}
                </div>
              </div>
            </div>
            <div className="mt-5">
              <Select
                label="Assign User:"
                name="user"
                options={[{ label: 'Select User', value: '' }, ...assignedUser]}
                className="w-full"
                {...register('user', { required: 'Assigning User is required' })}
              />
              {errors.user && <p className="text-red-600">{errors.user.message}</p>}
            </div>
            <div className="mt-5">
              <Input
                type="textarea"
                label="Description: "
                name="description"
                placeholder="Description"
                className="w-full"
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && <p className="text-red-600">{errors.description.message}</p>}
            </div>
            <div className="mt-5 w-full">
              <Button type="submit">Add Task</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddTask
