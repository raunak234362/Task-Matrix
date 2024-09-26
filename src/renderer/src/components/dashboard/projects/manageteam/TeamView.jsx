/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, Input, Select } from '../../../index'
import { useForm } from 'react-hook-form'
import Service from '../../../../api/configAPI'
import { useDispatch } from 'react-redux'
import { addTeamMember } from '../../../../store/teamSlice'

const TeamView = ({ team, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isAddMember, setAddMember] = useState(false)
  const [memberOptions, setMemberOptions] = useState([])
  const token = sessionStorage.getItem('token')
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

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

  const [members, setMembers] = useState({})

  useEffect(() => {
    function segerateTeam() {
      let teamMembers = {}
      team?.members?.map((member) => {
        if (member?.role !== 'MANAGER' && member?.role !== 'LEADER') {
          if (member?.role in teamMembers) {
            teamMembers[member?.role].push(member)
          } else {
            teamMembers[member?.role] = [member]
          }
        }
      })
      setMembers(teamMembers)
    }

    const fetchUsers = async () => {
      try {
        const usersData = await Service.getAllUser(token)
        // console.log(team?.members);
        console.log(usersData)
        const options = usersData.map((user) => {
          return {
            label: user?.name,
            value: parseInt(user?.id)
          }
        })
        setMemberOptions(options)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
    segerateTeam()
  }, [])

  const handleClose = () => {
    setIsEditing((prev) => !prev)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white max-h-[60vh] overflow-y-auto p-8 rounded-lg shadow-lg w-11/12 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Team Details</h2>
          <button
            className="text-xl font-bold bg-gray-600 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="h-fit overflow-y-auto p-4 rounded-lg">
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
            </form>
            <hr className=" my-5 border-2 rounded-xl" />
            <div className="grid grid-cols-2 gap-5 mt-5">
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
              <div>
                <strong className="text-gray-700 text-lg">Add Team Member:</strong>
                <form onSubmit={handleSubmit(addMembers)}>
                  <div>
                    <Select
                      label="Select Member: "
                      name="employee"
                      options={memberOptions}
                      className=" rounded-lg focus:border-black"
                      {...register('employee')}
                    />
                    <Select
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
  )
}

export default TeamView
