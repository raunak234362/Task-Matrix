/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, ProjectPie, Project, Header, BarView } from '../../../index'
import Service from '../../../../api/configAPI'
import SegregateProject from '../../../../util/SegregateProject'
import { TableView } from './TableView'

const Allprojects = () => {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [fabricator, setFabricator] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const userType = sessionStorage.getItem('userType')
  const [segregateProject, setSegreateProject] = useState()
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await Service.getAllProject()
        setProjects(projects)
        setFilteredProjects(projects)
        setSegreateProject(await SegregateProject(projects))
        console.log(projects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }
    fetchProjects()
  }, [selectedProject])

  useEffect(() => {
    const results = projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProjects(results)
  }, [searchTerm, projects])

  const handleViewClick = async (projectId) => {
    try {
      const project = await Service.getProject(projectId)
      setSelectedProject(project)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching project details:', error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  const sortProjects = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })

    const sortedProjects = [...filteredProjects].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1
      }
      return 0
    })
    setFilteredProjects(sortedProjects)
  }

  const handleSortChange = (event) => {
    sortProjects(event.target.value)
  }

  return (
    <div>
      <Header title={'All Project'} />

      {userType !== 'user' && segregateProject && (
        <div className="flex-grow bg-white shadow-lg rounded-lg p-6">
          <BarView
            segregateProject={segregateProject}
            setProject={setProjects}
            setFabricator={setFabricator}
          />
        </div>
      )}

      <div className="table-container w-full my-5 rounded-lg">
        <div className="h-[57vh] overflow-y-hidden shadow-xl table-container w-full rounded-lg">
          <h3 className="text-xl flex font-bold uppercase rounded-lg bg-slate-400 text-white px-5 py-1 justify-center items-center">
            All Projects {fabricator && <span className="text-white"> - {fabricator}</span>}
          </h3>

          <div className="mx-5 my-5 h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Search by project name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              />
              <select onChange={handleSortChange} className="p-2 border border-gray-300 rounded-lg">
                <option value="">Sort by</option>
                <option value="name">Name</option>
                <option value="startDate">Start Date</option>
              </select>
            </div>
            <div className="h-[40vh] overflow-y-auto">
              <table className="w-full table-auto border-collapse text-center rounded-xl top-0">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-1 py-2">S.no</th>
                    <th className="px-1 py-2">Project Name</th>
                    <th className="px-1 py-2">Project Manager</th>
                    <th className="px-1 py-2">Start Date</th>
                    <th className="px-3 py-2">Approval Date</th>
                    <th className="px-3 py-2">Detail</th>
                  </tr>
                </thead>
                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr className="bg-white">
                        <td colSpan="7" className="text-center">
                          No Projects Found
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((project, index) => (
                        <tr key={project.id}>
                          <td className="border px-1 py-2">{index + 1}</td>
                          <td className="border px-1 py-2">{project?.name}</td>
                          <td className="border px-1 py-2">{project?.manager?.name}</td>
                          <td className="border px-1 py-2">
                            {new Date(project?.startDate).toDateString()}
                          </td>
                          <td className="border px-3 py-2">
                            {new Date(project?.endDate).toDateString()}
                          </td>
                          <td className="border px-3 py-2">
                            <div className="flex justify-center">
                              <Button onClick={() => handleViewClick(project.id)}>View</Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>

      {selectedProject && (
        <Project
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          setProject={setSelectedProject}
        />
      )}
    </div>
  )
}

export default Allprojects
