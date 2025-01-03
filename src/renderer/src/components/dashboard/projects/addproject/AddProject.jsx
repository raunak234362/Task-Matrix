/* eslint-disable prettier/prettier */

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Button, Input, CustomSelect, MultiSelectCheckbox, AddTeam, Header, Toggle } from '../../../index'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addProject } from '../../../../store/projectSlice'
import Service from '../../../../api/configAPI'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react'

const AddProject = () => {
  const [fabricatorOptions, setFabricatorOptions] = useState([])
  const [managerOptions, setManagerOptions] = useState([])
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [isAlert, setIsAlert] = useState(false)

  const openModal = () => {
    setIsAlert(true)
  }

  const closeModal = () => {
    setIsAlert(false)
  }

  const closeSuccessModal = () => {
    setIsSuccessOpen(false)
  }

  const token = sessionStorage.getItem('token')
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm()

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  useEffect(() => {
    const fetchFabricators = async () => {
      try {
        const fabricators = await Service.getAllFabricator()
        console.log(fabricators)
        const options = fabricators.map((fab) => ({
          label: fab.name,
          value: fab.id
        }))
        setFabricatorOptions(options)
      } catch (error) {
        console.error('Error fetching fabricators:', error)
      }
    }
    const fetchUsers = async () => {
      try {
        const usersData = await Service.getAllUser(token)
        const options = usersData
          .filter((user) => user.is_staff === true)
          .map((user) => {
            return {
              label: user.name,
              value: user.id
            }
          })
        setManagerOptions(options)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
    fetchFabricators()
  }, [])

  useEffect(() => {
    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
      setValue('endDate', startDate);
    }
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      let duration = 0
      let currentDate = new Date(start)

      while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sundays (0) and Saturdays (6)
        duration++
      }
      currentDate.setDate(currentDate.getDate() + 1)
      }

      setValue('duration', duration > 0 ? duration : 0)
    }
  }, [startDate, endDate, setValue])

  const onSubmit = async (projectData) => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) {
        throw new Error('Token not found')
      }
      projectData.duration = parseInt(projectData.duration)
      const data = await Service.addProject({
        ...projectData,
        token: token
      })
      console.log('Response from addProject:', projectData)

      dispatch(addProject(data))
      setIsSuccessOpen(true)
      console.log('Project added:', data)
      // alert('Successfully added new Project', projectData?.name)
    } catch (error) {
      console.error('Error adding project:', error)
      console.log('Project data:', projectData)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5">
        <div className="p-5 flex flex-col justify-between gap-5">
          <div className="flex rounded-lg flex-col shadow-lg shadow-black/15 p-8">
            {/* {step === 1 && ( */}
            <>
              <div className="mt-3">
                <CustomSelect
                  label="Fabricator"
                  name="fabricator"
                  options={[
                    {
                      label: 'Select Fabricator',
                      value: ''
                    },
                    ...fabricatorOptions
                  ]}
                  className="w-full"
                  {...register('fabricator', {
                    required: 'Fabricator is required'
                  })}
                  onChange = {setValue}
                />
              </div>
              {errors.fabricator && <p className="text-red-600">{errors.fabricator.message}</p>}
              <div className="mt-5">
                <Input
                  label="Project Name: "
                  name="name"
                  placeholder="Project"
                  className="w-full"
                  {...register('name', {
                    required: 'Project Name is required'
                  })}
                />
              </div>
              {errors.name && <p className="text-red-600">{errors.name.message}</p>}
              <div className="mt-5">
                <Input
                  label="Description: "
                  name="description"
                  placeholder="Description"
                  className="w-full"
                  {...register('description', {
                    required: 'Description is required'
                  })}
                />
              </div>
              {errors.description && <p className="text-red-600">{errors.description.message}</p>}
              <div className="mt-5">
                <CustomSelect
                  label="Tools: "
                  name="tool"
                  options={[
                    {
                      label: 'Select Tools',
                      value: ''
                    },
                    { label: 'TEKLA', value: 'TEKLA' },
                    { label: 'SDS-2', value: 'SDS-2' },
                    { label: 'ESTIMATION', value: 'ESTIMATION' }
                  ]}
                  className="w-full"
                  {...register('tool', {
                    required: 'Tools is required'
                  })}
                  onChange = {setValue}
                />
              </div>
              {errors.tool && <p className="text-red-600">{errors.tool.message}</p>}
              <div>
                <div className="text-xl font-bold mt-2">Connection Design:</div>
                <div className="flex flex-row gap-10">
                  <div className="">
                    <Toggle
                      label="Main"
                      name="connectionDesign"
                      {...register('connectionDesign')}
                    />
                  </div>
                  <div className="">
                    <Toggle label="Misc" name="miscDesign" {...register('miscDesign')} />
                  </div>
                  <div className="">
                    <Toggle label="Customer" name="customer" {...register('customer')} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-24">
                <div className="mt-5 w-36">
                  <Input
                    label="Start Date:"
                    name="startDate"
                    type="date"
                    className="w-full"
                    {...register('startDate', {
                      required: 'Start Date is required'
                    })}
                  />
                  {errors.startDate && <p className="text-red-600">{errors.startDate.message}</p>}
                </div>
                <div className="mt-5 w-36">
                  <Input
                    label="Approval Date:"
                    name="endDate"
                    type="date"
                    className="w-full"
                    {...register('endDate', {
                      required: 'Approval Date  is required'
                    })}
                  />
                  {errors.endDate && <p className="text-red-600">{errors.endDate.message}</p>}
                </div>
              </div>
              <div className="mt-5 text-lg font-bold">
                Duration
              </div>
              <div className="flex flex-row items-center gap-x-3 w-fit">
                <Input
                  // label="Duration:"
                  name="duration"
                  type="number"
                  className="w-[full]"
                  placeholder="No. of Days"
                  min={1}
                  {...register('duration')}
                  onBlur={(e) => {
                    if (e.target.value < 0) e.target.value = 0
                  }}
                />
                {
                  watch('duration') && (
                    <span className='text-lg'> {(watch('duration')>1)? 'Days':'Day'}</span>
                  )
                }
              </div>

              <div className="mt-5">
                <CustomSelect
                  label="Manager"
                  name="manager"
                  options={[
                    {
                      label: 'Select Manager',
                      value: ''
                    },
                    ...managerOptions
                  ]}
                  className="w-full"
                  {...register('manager', {
                    required: 'Manager is required'
                  })}
                  onChange = {setValue}
                />
              </div>
              {errors.manager && <p className="text-red-600">{errors.manager.message}</p>}
            </>
            {/* )} */}

            {/* {step === 2 && (
              <>
               <AddTeam/>
                
              </>
            )} */}

            <div className="mt-5 w-full flex justify-between">
              <Button type="submit">Submit</Button>
              <Dialog open={isSuccessOpen} handler={setIsSuccessOpen}>
                <DialogHeader>Project Added</DialogHeader>
                <DialogBody>The Project is added successfully!</DialogBody>
                <DialogFooter>
                  <Button variant="gradient" color="green" onClick={closeSuccessModal}>
                    Close
                  </Button>
                </DialogFooter>
              </Dialog>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddProject
