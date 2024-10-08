/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Button, GhantChart, Input, CustomSelect } from '../../../index' // Ensure GanttChart is imported correctly
import Service from '../../../../api/configAPI'
import { useForm } from 'react-hook-form'
import { BASE_URL } from '../../../../config/constant'
import SegregateTeam from '../../../../util/SegragateTeam'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react'

const Project = ({ project, isOpen, onClose, setProject }) => {
  const [members, setMembers] = useState({})
  const [teamTask, setTeamTask] = useState([])
  const userType = sessionStorage.getItem('userType')
  const token = sessionStorage.getItem('token')
  const [teamOption, setTeamOption] = useState([])
  const [taskDetail, setTaskDetail] = useState()
  const [isEditing, setIsEditing] = useState(false)
  const { register, handleSubmit, setValue } = useForm()
  const [isAlert, setIsAlert] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const openModal = () => {
    setIsAlert(true)
  }

  const closeModal = () => {
    setIsAlert(false)
  }

  useEffect(() => {
    function segregateTeam() {
      let teamMembers = {}
      let memb = []
      project?.team?.members?.forEach((member) => {
        memb.push({
          employee: member?.employee,
          date: project?.endDate,
          role: member?.role
        })
        if (member?.role !== 'MANAGER' && member?.role !== 'LEADER') {
          if (member?.role in teamMembers) {
            teamMembers[member?.role].push(member)
          } else {
            teamMembers[member?.role] = [member]
          }
        }
      })
      setMembers(teamMembers)
      setTeamTask(memb)
    }

    const fetchTeams = async () => {
      try {
        const teamData = await Service.getAllTeam(token)
        const options = teamData.map((team) => ({
          label: team?.name,
          value: team?.id
        }))
        setTeamOption(options)
      } catch (error) {
        console.error('Error fetching teams:', error)
      }
    }

    fetchTeams()
    segregateTeam()
  }, [project])

  useEffect(() => {
    async function fetchTasks() {
      const data1 = await SegregateTeam(teamTask)
      setTaskDetail(data1)
    }
    fetchTasks()
  }, [teamTask])

  const handleEditClick = () => {
    setIsEditing(true)
    setValue('description', project.description || '')
    setValue('startDate', project.startDate || '')
    setValue('endDate', project.endDate || '')
    setValue('tool', project.tool || '')
    setValue('team', project?.team?.id || '')
    setValue('status', project.status || '')
    setValue('stage', project.stage || '')
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleDelete = () => {
    try {
      Service.DeleteProject(project?.id)
      alert('Successfully Deleted')
    } catch (error) {
      console.log(error)
    }

    onClose()
  }

  useEffect(() => {
    if (project) {
      setValue('description', project.description || '')
      setValue('startDate', project.startDate || '')
      setValue('endDate', project.endDate || '')
      setValue('tool', project.tool || '')
      setValue('team', project?.team?.name || '')
      setValue('status', project.status || '')
      setValue('stage', project.stage || '')
    }
  }, [project, setValue])

  const onSubmit = async (data) => {
    const updatedData = {
      description: data.description || project.description,
      startDate: data.startDate || project.startDate,
      endDate: data.endDate || project.endDate,
      tool: data.tool || project.tool,
      team: data.team || project.team?.id,
      status: data.status || project.status,
      stage: data.stage || project.stage
    }

    try {
      const response = await Service.editProject(project?.id, updatedData)
      setProject(response)
      setIsEditing(false)
      setIsSuccessOpen(true)
      // alert('Team updated Successfully')
      // onClose();
    } catch (error) {
      alert('Something went wrong')
      console.log(error)
    }
  }

  const closeSuccessModal = () => {
    setIsSuccessOpen(false)
  }

  if (!isOpen) return null

  const startDate = new Date(project?.startDate)
  const endDate = new Date(project?.endDate)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-screen overflow-x-auto p-8 rounded-lg shadow-lg w-screen ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Project Details</h2>
          <button
            className="text-xl font-bold bg-gray-600 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div>
          <GhantChart taskData={taskDetail} />
        </div>

        <div className="h-fit overflow-y-auto p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="my-3">
                  <strong className="text-gray-700">Project Name:</strong>

                  <div>{project?.name}</div>
                </div>
                <div className="my-3">
                  {isEditing ? (
                    <Input
                      label="Description"
                      placeholder="Description"
                      size="lg"
                      color="green"
                      {...register('description')}
                      className="mt-1"
                    />
                  ) : (
                    <div>
                      <strong className="text-gray-700">Description: </strong>
                      {project?.description}
                    </div>
                  )}
                </div>
                <div className="my-3">
                  {isEditing ? (
                    <Input
                      label="Start Date"
                      placeholder="Start Date"
                      color="green"
                      size="lg"
                      type="date"
                      {...register('startDate')}
                      className="mt-1"
                    />
                  ) : (
                    <div>
                      <strong className="text-gray-700">Start Date: </strong>
                      {startDate?.toDateString()}
                    </div>
                  )}
                </div>
                <div className="my-3">
                  {isEditing ? (
                    <Input
                      label="Approval Date"
                      placeholder="Approval Date"
                      color="green"
                      size="lg"
                      type="date"
                      {...register('endDate')}
                      className="mt-1"
                    />
                  ) : (
                    <div>
                      <strong className="text-gray-700">Approval Date: </strong>
                      {endDate?.toDateString()}
                    </div>
                  )}
                </div>

                <p className="my-3">
                  <strong className="text-gray-700">Tools:</strong> {project?.tool}
                </p>
                <p className="my-3">
                  <strong className="text-gray-700">Connection Design:</strong>{' '}
                  {project?.connectionDesign ? 'REQUIRED' : 'Not Required'}
                </p>
                <p className="my-3">
                  <strong className="text-gray-700">Misc Design:</strong>{' '}
                  {project?.miscDesign ? 'REQUIRED' : 'Not Required'}
                </p>
                <p className="my-3">
                  <strong className="text-gray-700">Customer:</strong>{' '}
                  {project?.customer ? 'REQUIRED' : 'Not Required'}
                </p>
                <div>
                  {isEditing ? (
                    <CustomSelect
                      name="team"
                      label="Team"
                      placeholder="Team"
                      size="lg"
                      color="green"
                      options={[...teamOption]}
                      value={project?.team?.name}
                      const
                      console={console.log(project?.team?.name)}
                      {...register('team')}
                      onChange={setValue}
                    />
                  ) : (
                    <div>
                      <strong className="text-gray-700">Team: </strong>
                      {project?.team?.name}
                    </div>
                  )}
                </div>
                <div className="my-3">
                  {isEditing ? (
                    <CustomSelect
                      name="status"
                      label="Status"
                      placeholder="Status"
                      size="lg"
                      color="green"
                      options={[
                        { label: 'ACTIVE', value: 'ACTIVE' },
                        { label: 'ON-HOLD', value: 'ON-HOLD' },
                        { label: 'INACTIVE', value: 'INACTIVE' },
                        { label: 'DELAY', value: 'DELAY' },
                        { label: 'REOPEN', value: 'REOPEN' },
                        { label: 'COMPLETE', value: 'COMPLETE' },
                        { label: 'SUBMIT', value: 'SUBMIT' },
                        { label: 'SUSPEND', value: 'SUSPEND' },
                        { label: 'CANCEL', value: 'CANCEL' }
                      ]}
                      defaultValue={project?.status}
                      {...register('status')}
                      onChange={setValue}
                    />
                  ) : (
                    <div>
                      <strong className="text-gray-700">Status: </strong>
                      {project?.status}
                    </div>
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <CustomSelect
                      name="stage"
                      label="Stage"
                      placeholder="Stage"
                      size="lg"
                      color="green"
                      options={[
                        { label: 'RFI', value: 'RFI' },
                        { label: 'IFA', value: 'IFA' },
                        { label: 'BFA', value: 'BFA' },
                        { label: 'BFA-Markup', value: 'BFA-M' },
                        { label: 'RIFA', value: 'RIFA' },
                        { label: 'RBFA', value: 'RBFA' },
                        { label: 'IFC', value: 'IFC' },
                        { label: 'BFC', value: 'BFC' },
                        { label: 'RIFC', value: 'RIFC' },
                        { label: 'REV', value: 'REV' },
                        { label: 'CO#', value: 'CO#' }
                      ]}
                      defaultValue={project?.stage}
                      {...register('stage')}
                      onChange={setValue}
                    />
                  ) : (
                    <div>
                      <strong className="text-gray-700">Stage: </strong>
                      {project?.stage}
                    </div>
                  )}
                </div>
              </div>
              {userType !== 'user' && (
                <div>
                  {isEditing ? (
                    <div className="flex justify-between">
                      <div className="flex">
                        <Button type="submit">Save</Button>
                        <Dialog open={isSuccessOpen} handler={setIsSuccessOpen}>
                          <DialogHeader>Project Updated</DialogHeader>
                          <DialogBody>The Project was updated successfully!</DialogBody>
                          <DialogFooter>
                            <Button variant="gradient" color="green" onClick={closeSuccessModal}>
                              Close
                            </Button>
                          </DialogFooter>
                        </Dialog>
                      </div>
                      <div className='flex'>
                        <Button onClick={handleCancel}>Cancel</Button>
                      </div>
                      <div className="flex">
                        <Button onClick={openModal}>Delete</Button>
                        {isAlert && (
                          <Dialog open={isAlert} handler={setIsAlert}>
                            <DialogHeader>Confirm Deletion</DialogHeader>
                            <DialogBody divider>
                              Are you sure you want to delete this item? This action cannot be
                              undone.
                            </DialogBody>
                            <DialogFooter>
                              <Button
                                variant="text"
                                color="gray"
                                onClick={closeModal}
                                className="mr-2"
                              >
                                No
                              </Button>
                              <Button variant="gradient" color="red" onClick={handleDelete}>
                                Yes, Delete
                              </Button>
                            </DialogFooter>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Button onClick={handleSubmit(handleEditClick)}>Update</Button>
                    </div>
                  )}
                </div>
              )}
            </form>
            <div>
              {userType !== 'user' && (
                <div>
                  <p className="my-3">
                    <strong className="text-gray-700">Fabricator Name:</strong>{' '}
                    {project?.fabricator?.name}
                  </p>
                  <p className="my-3">
                    <strong className="text-gray-700">Fabricator Shop Standard:</strong>{' '}
                    <a
                      href={`${BASE_URL}${project?.fabricator?.design}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                    >
                      View standard
                    </a>
                  </p>
                </div>
              )}

              <div>
                <div className="text-xl font-bold text-gray-800">Team Members:</div>
                <h3 className="text-sm font-bold text-gray-800">Manager</h3>
                <li>{project?.manager?.name}</li>

                <h3 className="text-sm font-bold text-gray-800">Leader</h3>
                <li>{project?.leader?.name}</li>

                {Object.keys(members).map((role) => (
                  <div key={role}>
                    <h3 className="text-sm font-bold text-gray-800">{role}</h3>
                    <ol className="list-decimal list-inside ml-4">
                      {members[role]?.map((member) => (
                        <li key={member?.id} className="mt-1">
                          {member?.employee?.name}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
                {/* {userType === 'admin' || userType === 'manager' ? (
                  <div className="flex mt-4">
                    <div>
                      <div className="text-xl font-bold text-gray-800">Update Project Report:</div>
                      <hr className="my-2" />
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Select
                          label="Team"
                          name="team"
                          className="text-base"
                          options={[
                            {
                              label: 'Select Team',
                              value: ''
                            },
                            ...teamOption
                          ]}
                          defaultValue={project?.team}
                          {...register('team')}
                        />
                        <Select
                          label="Status"
                          name="status"
                          className="text-base"
                          options={[
                            { label: 'ACTIVE', value: 'ACTIVE' },
                            { label: 'ON-HOLD', value: 'ON-HOLD' },
                            { label: 'INACTIVE', value: 'INACTIVE' },
                            { label: 'DELAY', value: 'DELAY' },
                            { label: 'REOPEN', value: 'REOPEN' },
                            { label: 'COMPLETE', value: 'COMPLETE' },
                            { label: 'SUBMIT', value: 'SUBMIT' },
                            { label: 'SUSPEND', value: 'SUSPEND' },
                            { label: 'CANCEL', value: 'CANCEL' }
                          ]}
                          defaultValue={project?.status}
                          {...register('status')}
                        />
                        <Select
                          label="Stage"
                          name="stage"
                          className="text-base"
                          options={[
                            { label: 'RFI', value: 'RFI' },
                            { label: 'IFA', value: 'IFA' },
                            { label: 'BFA', value: 'BFA' },
                            { label: 'BFA-Markup', value: 'BFA-M' },
                            { label: 'RIFA', value: 'RIFA' },
                            { label: 'RBFA', value: 'RBFA' },
                            { label: 'IFC', value: 'IFC' },
                            { label: 'BFC', value: 'BFC' },
                            { label: 'RIFC', value: 'RIFC' },
                            { label: 'REV', value: 'REV' },
                            { label: 'CO#', value: 'CO#' }
                          ]}
                          defaultValue={project?.stage}
                          {...register('stage')}
                        />

                        <Button
                          type="submit"
                          className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                          Save
                        </Button>
                      </form>
                    </div>
                  </div>
                ) : null} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Project
