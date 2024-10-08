/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, CustomSelect, Input } from '../../../index'
// import Select from 'react-select'
import { useForm } from 'react-hook-form'
import Service from '../../../../api/configAPI'
import { useDispatch } from 'react-redux'
import { addTeamMember } from '../../../../store/teamSlice'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react'

const TeamView = ({ team, isOpen, onClose }) => {
  const userType = sessionStorage.getItem('userType')
  const [isEditing, setIsEditing] = useState(false)
  const [isAddMember, setAddMember] = useState(false)
  const [memberOptions, setMemberOptions] = useState([])
  const token = sessionStorage.getItem('token')
  const [isDelete, setIsDelete] = useState(false)
  const [isAlert, setIsAlert] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()

  const teamId = team?.id

  const editTeam = async () => {
    try {
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const addMembers = async (memberData) => {
    try {
      console.log(memberData)
      if (!memberData?.employee) return alert('Please Select Employee')
      const data = await Service.addTeamMember({
        ...memberData,
        teamId: team?.id,
        token: token
      })
      console.log('Member Added Successfully', data)
      alert(`${memberData?.role} Added Successfully`)
      dispatch(addTeamMember(data))
      // onClose();
      // eslint-disable-next-line prettier/prettier
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  const handleAddMember = () => {
    setAddMember((prev) => !prev)
  }

  const handleEdit = () => {
    setIsEditing((prev) => !prev)
  }

  const handleDelete = () => {
    try {
      const data = Service.deleteTeam(teamId, token)
      console.log('Team Deleted Successfully', data)
      // alert('Team Deleted Successfully')
      setIsSuccessOpen(true)
      setIsAlert(false)
      // onClose()
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const openModal = () => {
    setIsAlert(true)
  }

  const closeModal = () => {
    setIsAlert(false)
  }

  const closeSuccessModal = () => {
    onClose()
    setIsSuccessOpen(false)
  }

  const [members, setMembers] = useState({})

  useEffect(() => {
    function segerateTeam() {
      let teamMembers = {}
      team?.members?.map((member) => {
        if (member?.role !== 'MANAGER') {
          if (member?.role in teamMembers) {
            teamMembers[member?.role].push(member)
            console.log(teamMembers)
          } else {
            teamMembers[member?.role] = [member]
          }
        }
      })
      setMembers(teamMembers)
    }

    const fetchUsers = async () => {
      try {
        const uniqueMembers = new Set();
        const options = await Service.getAllUser(token);
        
        // Process the options to filter unique names
        const memberOptions = options
          ?.map((user) => {
            const name = user?.name;
            // Check for unique names
            if (name && !uniqueMembers.has(name)) {
              uniqueMembers.add(name); // Add to the set if unique
              return {
                label: name,
                value: parseInt(user?.id),
              };
            }
            return null; // Return null for duplicates
          })
          .filter(Boolean) // Remove null values from the array
          .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
    
        // Set the processed member options
        setMemberOptions(memberOptions);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    

    fetchUsers()
    segerateTeam()
  }, [])

  const handleClose = () => {
    setIsEditing((prev) => !prev)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-screen overflow-y-auto p-8 rounded-lg shadow-lg w-screen">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Team Details</h2>
          <button
            className="text-xl font-bold bg-gray-600 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className=" h-fit p-4 rounded-lg">
          <div>
            <form onSubmit={handleSubmit(editTeam)}>
              <div>
                <div className="mb-2">
                  <strong className="text-gray-700">Team Name:</strong> {team?.name}
                </div>
                <p className="mb-2">
                  <strong className="text-gray-700">Manager:</strong> {team?.created_by?.name}
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Leader:</strong> {team?.leader?.name}
                </p>
                {/* <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleEdit}
                    className={`${
                      isEditing ? "bg-blue-500" : "bg-gray-500"
                    } text-white py-2 px-4 rounded-lg hover:bg-blue-700`}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </div> */}
              </div>
              {/* {userType !== 'user' && ( */}
              <div>
                <div className="flex justify-between">
                  {/* <div className="flex">
                    <Button onClick={openModal}>Delete</Button>
                    {isAlert && (
                      <Dialog open={isAlert} handler={setIsAlert}>
                        <DialogHeader>Confirm Deletion</DialogHeader>
                        <DialogBody divider>
                          Are you sure you want to delete this item? This action cannot be undone.
                        </DialogBody>
                        <DialogFooter>
                          <Button variant="text" color="gray" onClick={closeModal} className="mr-2">
                            No
                          </Button>
                          <Button variant="gradient" color="red" onClick={handleDelete}>
                            Yes, Delete
                          </Button>
                        </DialogFooter>
                      </Dialog>
                    )}
                    <Dialog open={isSuccessOpen} handler={setIsSuccessOpen}>
                      <DialogHeader>Team Deleted</DialogHeader>
                      <DialogBody>The Team is deleted successfully!</DialogBody>
                      <DialogFooter>
                        <Button variant="gradient" color="green" onClick={closeSuccessModal}>
                          Close
                        </Button>
                      </DialogFooter>
                    </Dialog>
                  </div> */}
                </div>
              </div>
              {/* )} */}
            </form>
            <hr className=" my-12 border-2 rounded-xl" />
            <div className="grid grid-cols-2 gap-5 mt-16">
              <div className="mb-2">
                <strong className="text-gray-700 text-lg">Team Members:</strong>
                {Object?.keys(members)?.map((role) => (
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
              </div>
              <div className="my-5">
                <strong className="text-gray-700 text-lg">Add Team Member:</strong>
                <div className="h-fit">
                  <form onSubmit={handleSubmit(addMembers)}>
                    <div className="my-2">
                      <CustomSelect
                        label="Select Member: "
                        name="employee"
                        options={memberOptions}
                        {...register('employee')}
                        onChange={setValue}
                      />
                    </div>
                    <div className="my-2">
                      <CustomSelect
                        label="Select Role: "
                        name="role"
                        options={[
                          { label: 'GUEST', value: 'GUEST' },
                          { label: 'LEADER', value: 'LEADER' },
                          { label: 'MEMBER', value: 'MEMBER' },
                          { label: 'MANAGER', value: 'MANAGER' },
                          { label: 'MODELER', value: 'MODELER' },
                          { label: 'CHECKER', value: 'CHECKER' },
                          { label: 'DETAILER', value: 'DETAILER' },
                          { label: 'ERECTER', value: 'ERECTER' },
                          { label: 'ADMIN', value: 'ADMIN' }
                        ]}
                        {...register('role')}
                        onChange={setValue}
                      />
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button
                        type="submit"
                        className={`${
                          isAddMember ? 'bg-blue-500' : 'bg-gray-500'
                        } text-white py-2 px-4 rounded-lg hover:bg-blue-700`}
                      >
                        {isAddMember ? 'Save' : 'Add'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamView
