/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Button, Header, Input } from '../../../index'
import { useForm } from 'react-hook-form'
import Service from '../../../../api/configAPI'

const ManageFabricator = ({ fabricator, isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [newInput, setNewInput] = useState({
    name: '',
    designation: '',
    phone: '',
    email: '',
  })
  const [addNew, setAddNew] = useState(false)
  const userType = sessionStorage.getItem('userType')

  function handleAddNewContact() {
    setAddNew((prev) => !prev)
  }

  const handleDeleteFabricator = (id) => {
    const data = Service.deleteFabricator(id)
    // console.log(data);
  }

  const handleAddContact = () => {
    setAddNew((prev) => !prev)
    fabricator?.connections?.push(newInput)
    const data = Service.addConnection(fabricator?.id, newInput)
    setNewInput({
      name: '',
      designation: '',
      phone: '',
      email: '',
    })
    console.log(data)
  }

  const [contractName, setContractName] = useState('')
  const [contract, setContractFile] = useState(null)

  const handleContractChange = (e) => {
    const file = e.target.files[0]
    setContractName(file?.name)
    setContractFile(file)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Fabricator Details
          </h2>
          <button
            className="text-xl font-bold bg-gray-600 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex flex-row justify-between">
          <div>
            <div>
              <strong>Fabricator Name:</strong> {fabricator.name}
            </div>
            <div>
              <strong>Country:</strong> {fabricator.country}
            </div>
            <div>
              <strong>State:</strong> {fabricator.state}
            </div>
            <div>
              <strong>City:</strong> {fabricator.city}
            </div>
            <div>
              <strong>Zipcode:</strong> {fabricator.zipCode}
            </div>
          </div>
          {userType === 'admin' && (
            <div>
              <Button className="" onClick={handleDeleteFabricator}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="mt-5">
          <div className="text-xl font-bold">Contact Details</div>
          <table className=" min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.no
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fabricator?.connections?.map((connection, index) => (
                <tr key={index}>
                  <td className="px-2 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {connection?.name}
                  </td>

                  <td className="px-2 py-4 whitespace-nowrap">
                    {connection?.designation}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {connection?.phone}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {connection?.email}
                  </td>
                </tr>
              ))}
              {addNew && (
                <tr>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {fabricator?.connections?.length + 1}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <Input
                      placeholder="Name"
                      value={newInput.name}
                      required={true}
                      onChange={(e) => {
                        setNewInput({
                          ...newInput,
                          name: e.target.value,
                        })
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <Input
                      placeholder="Designation"
                      value={newInput.designation}
                      required={true}
                      onChange={(e) => {
                        setNewInput({
                          ...newInput,
                          designation: e.target.value,
                        })
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <Input
                      placeholder="Phone Number"
                      value={newInput.phone}
                      required={true}
                      onChange={(e) => {
                        setNewInput({
                          ...newInput,
                          phone: e.target.value,
                        })
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <Input
                      placeholder="Email"
                      value={newInput.email}
                      required={true}
                      onChange={(e) => {
                        setNewInput({
                          ...newInput,
                          email: e.target.value,
                        })
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Button onClick={addNew ? handleAddContact : handleAddNewContact}>
            {addNew ? 'Save' : 'New'}
          </Button>
        </div>

        {/* Add details */}
        {/* <div>
          <div className="mt-5 w-full">
            <label htmlFor="contract">Upload Standard Design</label>
            <input
              className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 peer"
              type="file"
              id="contract"
              accept=".pdf, image/*"
              onChange={handleContractChange}
            />
            {contractName && (
              <div className="mt-2">
                <p>Standard Design: {contractName}</p>
              </div>
            )}
            {errors.contract && <p>{errors.contract.message}</p>}
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default ManageFabricator
