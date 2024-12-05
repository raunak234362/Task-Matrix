/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Service from '../../../api/configAPI'
import { BarViews, FabricatorCharts, Header } from '../../index'
import SegregateProject from '../../../util/SegregateProject'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addProject } from '../../../store/projectSlice'
import { addFabricator } from '../../../store/fabricatorSlice'

const Home = () => {
  const userType = sessionStorage.getItem('userType')
  const [fabricators, setFabricators] = useState([])
  const [fabricator, setFabricator] = useState(null)
  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(null)
  const [users, setUsers] = useState([])
  const [team, setTeam] = useState([])
  const [tasks, setTasks] = useState([])
  const [segregateProject, setSegregateProject] = useState({})
  const token = sessionStorage.getItem('token')
  const dispatch = useDispatch()

  const fabricatorData = useSelector((state) => state.fabricatorData.fabricatorData[0])
  // console.log('Fabricator Data: ',fabricatorData)
  const projectData = useSelector((state) => state.projectData.projectData[0])
  // console.log('Project Data: ',projectData)
  const taskData = useSelector((state) => state.taskData.taskData[0])
  // console.log('Task Data: ',taskData)
  const userData = useSelector((state) => state.userData.userData)

      // const segregatedProjects =  SegregateProject(projectData)
      // setSegregateProject(segregatedProjects)
      // console.log(segregatedProjects)

  const fetchTeam = async () => {
    try {
      const teamData = await Service.getAllTeam(token)
      setTeam(teamData)
      // console.log(teamData)
    } catch (error) {
      console.error('Error fetching team:', error)
    }
  }

useEffect(() => {
  if(projectData){
    const segregatedProjects =  SegregateProject(projectData)
    setSegregateProject(segregatedProjects)
    console.log('Segragated Project',segregatedProjects)
  }
},[projectData])

  useEffect(() => {
    fetchTeam()
  }, [token])

  return (
    <div className="">
      <Header title={'Dashboard'} />
      <div className="my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6 px-2">
          <div className="bg-gray-200 shadow-md p-2 flex flex-col items-center rounded-lg text-center text-gray-800">
            <NavLink to="all-fabricator">
              <span className="text-4xl font-bold text-gray-900">{fabricatorData?.length}</span>
              <p className="mt-2 text-xl font-semibold">Total No. of Fabricators</p>
            </NavLink>
          </div>
          <div className="bg-green-200 shadow-md p-2 flex flex-col items-center rounded-lg text-center text-gray-800">
            <NavLink to="all-project">
              <span className="text-4xl font-bold text-gray-900">{projectData?.length}</span>
              <p className="mt-2 text-xl font-semibold">Total No. of Projects</p>
            </NavLink>
          </div>
          <div className="bg-gray-200 shadow-md p-2 flex flex-col items-center rounded-lg text-center text-gray-800">
            <NavLink to="all-task">
              <span className="text-4xl font-bold text-gray-900">{taskData?.length}</span>
              <p className="mt-2 text-xl font-semibold">Total No. of Tasks</p>
            </NavLink>
          </div>
          <div className="bg-green-200 shadow-md p-2 flex flex-col items-center rounded-lg text-center text-gray-800">
            <NavLink to="all-user">
              <span className="text-4xl font-bold text-gray-900">{userData?.length}</span>
              <p className="mt-2 text-xl font-semibold">Total No. of Users</p>
            </NavLink>
          </div>
          <div className="bg-gray-200 shadow-md p-2 flex flex-col items-center rounded-lg text-center text-gray-800">
            <NavLink to="manage-team">
              <span className="text-4xl font-bold text-gray-900">{team.length}</span>
              <p className="mt-2 text-xl font-semibold">Total No. of Team</p>
            </NavLink>
          </div>
        </div>
        <div className="bg-gray-200 p-2 mt-5 rounded-lg">
          <div>
            <FabricatorCharts segregateProject={segregateProject} />
          </div>
        </div>
        <div className="grid grid-cols-[69%,30%]  gap-2">
          <div className=" bg-white shadow-lg rounded-lg p-6 ">
            <BarViews
              segregateProject={segregateProject}
              setProject={setProject}
              setFabricator={setFabricator}
            />
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 flex-grow">
            <h3 className="text-2xl font-semibold mb-4">All Projects</h3>
            <div className="overflow-x-auto h-[50vh]">
              <table className="w-full  table-auto border-collapse text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border">S.no</th>
                    <th className="px-4 py-2 border">Project Name</th>
                    <th className="px-4 py-2 border">Project Manager</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-center border">
                        No Projects Found
                      </td>
                    </tr>
                  ) : (
                    projects?.map((project, index) => (
                      <tr key={project.id}>
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{project.name}</td>
                        <td className="px-4 py-2 border">{project.manager?.name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
