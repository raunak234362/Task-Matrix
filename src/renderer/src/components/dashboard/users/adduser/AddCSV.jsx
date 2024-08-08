/* eslint-disable react/no-unknown-property */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Input } from '../../../index'
import { useForm } from 'react-hook-form'
import Service from '../../../../api/configAPI'
const AddCSV = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const handleCSV = async (csvData) => {
    try {
      const data = await Service.addUserCSV(
        csvData,
      )
      console.log(data)
      alert('Successfully added users from CSV')
      return data
    } catch (error) {
      console.error('Error adding users from CSV', error)
      alert(`Error adding users from CSV: ${error.message}`)
    }
  }

  const handleSampleCSV = async () => {
    try {
      const blob = await Service.sampleCSV()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'sample.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading sample CSV', error)
      alert(`Error downloading sample CSV: ${error.message}`)
    }
  }
  return (
    <div className="rounded-lg shadow-lg shadow-black/15 p-8 mt-8">
      <form onSubmit={handleSubmit(handleCSV)}>
        <Input
          label="Upload User Through CSV file"
          name="csv_file"
          className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          type="file"
          id="file"
          accept=".csv"
          {...register('csv_file')}
        />
        <div className="flex flex-row gap-10 mt-5">
          <Button
            type="button"
            onClick={handleSampleCSV}
            className="text-base bg-gray-500 text-white"
          >
            Download Sample CSV
          </Button>
          <Button type="submit" onClick={handleCSV}>
            Upload
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddCSV
