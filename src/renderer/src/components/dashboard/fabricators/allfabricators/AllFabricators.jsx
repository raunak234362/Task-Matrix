/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import Service from '../../../../api/configAPI'
import { Header, Button, ManageFabricator } from '../../../index'

const AllFabricators = () => {
  const [fabricators, setFabricators] = useState([])
  const [selectedFabricator, setSelectedFabricator] = useState(null)
  const [filteredFab, setFilteredFab] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc') // New state for sort order

  const token = sessionStorage.getItem('token')

  const fetchFabricators = async () => {
    try {
      const fabricatorsData = await Service.getAllFabricator(token)
      setFabricators(fabricatorsData)
    } catch (error) {
      console.error('Error fetching fabricators:', error)
    }
  }

  useEffect(() => {
    fetchFabricators()
  }, [])

  useEffect(() => {
    const results = fabricators.filter((fab) =>
      fab.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredFab(results)
  }, [searchTerm, fabricators])

  const handleViewClick = async (fabricatorId) => {
    try {
      const fabricator = await Service.getFabricator(fabricatorId)
      setSelectedFabricator(fabricator)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching project details:', error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFabricator(null)
  }

  // Function to handle sorting
  const handleSort = (field) => {
    const sortedFabricators = [...filteredFab].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[field] > b[field] ? 1 : -1
      }
      return a[field] < b[field] ? 1 : -1
    })
    setFilteredFab(sortedFabricators)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc') // Toggle sort order
  }

  return (
    <div className='px-5'>
      <div className="flex justify-between mt-4">
        <input
          type="text"
          placeholder="Search by Fabricator name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="h-[70vh] overflow-y-auto">
        <table className="w-full table-auto border-collapse text-center rounded-xl">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.no
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Fabricator Name
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('connections')}
              >
                No. of Contact Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Option
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFab?.map((fabricator, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-200/50'}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{fabricator?.name}</td>
                <td className="px-20 py-4 whitespace-nowrap">{fabricator?.connections}</td>
                <td className="py-4 mx-auto whitespace-nowrap">
                  <Button
                    onClick={() => {
                      handleViewClick(fabricator?.id)
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedFabricator && (
        <ManageFabricator
          fabricator={selectedFabricator}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default AllFabricators
