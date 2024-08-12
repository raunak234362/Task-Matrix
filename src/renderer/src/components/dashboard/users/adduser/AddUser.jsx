/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { AddCSV, Button, Header, Input, Select } from '../../../index'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { setUserData } from '../../../../store/userSlice'
import Service from '../../../../api/configAPI'

const AddUser = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const [csvFile, setCsvFile] = useState(null)

  const onSubmit = async (userData) => {
    try {
      const data = await Service.addUser(userData)
      dispatch(setUserData(data))
      alert('Successfully added new user')
    } catch (error) {
      console.error('Error adding user', error)
      alert(`Error adding user: ${error.message}`)
    }
  }

  

  return (
    <div>
      <div>
        <Header title={'Add User'} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5">
        <div className="flex flex-col justify-between gap-5 w-full">
          <div className="rounded-lg flex-col shadow-lg shadow-black/15 p-8">
            <div className="flex flex-row w-full gap-5">
              <div className="flex flex-col w-full">
                <div className="mt-5">
                  <Input
                    label="Employee Username: "
                    placeholder="Enter Employee Username"
                    name="username"
                    className="w-full"
                    {...register('username', {
                      required: 'Employee Username is required',
                    })}
                  />
                </div>
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}
              </div>
            </div>
            <div className="mt-5">
              <Input
                label="Full Name: "
                placeholder="Enter Employee Full Name"
                name="name"
                className="w-full"
                {...register('name', {
                  required: 'Full Name is required',
                })}
              />
            </div>
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            <div className="mt-3">
              <Input
                label="Email: "
                placeholder="Enter Employee Email"
                type="email"
                name="email"
                className="w-full"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            <div className="mt-3">
              <Select
                label="Permission Access"
                name="accessPermission"
                options={[
                  { label: 'Admin', value: 'admin' },
                  { label: 'Manager', value: 'manager' },
                  { label: 'User', value: 'user' },
                ]}
                {...register('accessPermission', {
                  required: 'Access permission is required',
                })}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('is_superuser', value === 'admin')
                  setValue('is_staff', value !== 'user')
                }}
              />
              {errors.accessPermission && <p className="text-red-500">{errors.accessPermission.message}</p>}
              <div className="mt-3">
                <Input
                  label="Password: "
                  placeholder="Enter Password"
                  type="password"
                  name="password"
                  className="w-full"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div className="mt-5 w-full">
              <Button type="submit">Add User</Button>
            </div>
          </div>
          
        </div>
      </form>
              <AddCSV/>
     
    </div>
  )
}

export default AddUser
