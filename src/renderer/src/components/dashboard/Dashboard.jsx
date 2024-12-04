/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
// src/components/AdminLayout.js
import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import {
  Sidebar,
  Home,
  AddUser,
  AddProject,
  AddTask,
  Calendar,
  AddFabricator,
  ManageTeam,
  TaskRecord,
  MyTask,
  MyProfile,
  AllFabricators,
  Allprojects,
  AllUser,
  AddTeam,
  AllTask,
  ApproveAssignee,
  UsersTaskRecord,
  Header,
  GaantChart
} from '../index'
import Service from '../../api/configAPI'
import { useDispatch, useSelector } from 'react-redux'
import { addFabricator } from '../../store/fabricatorSlice'
import { addProject } from '../../store/projectSlice'
import SegregateProject from '../../util/SegregateProject'
import { addTask } from '../../store/userSlice'

const Dashboard = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

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

  const fabricatorData = useSelector((state) => state.fabricatorData.fabricatorData)
  console.log("Fabricator data: ",fabricatorData)
  const projectData = useSelector((state) => state.projectData.projectData[0])
  // console.log("Project data: ",projectData)
  const taskData = useSelector((state) => state.taskData)
  // console.log("Task data: ",taskData)

  const fetchFabricators = async () => {
    try {
      const fabricatorsData = await Service.getAllFabricator(token``)
      // setFabricator(fabricatorsData)
      dispatch(addFabricator(fabricatorsData))
    } catch (error) {
      console.error('Error fetching fabricators:', error)
    }
  }
  const fetchProjects = async () => {
    try {
      const projectsData = await Service.getAllProject(token)
      dispatch(addProject(projectsData))
      const segregatedProjects = await SegregateProject(projectsData)
      setSegregateProject(segregatedProjects)
      // console.log(segregatedProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }
  const fetchTeam = async () => {
    try {
      const teamData = await Service.getAllTeam(token)
      setTeam(teamData)
      // console.log(teamData)
    } catch (error) {
      console.error('Error fetching team:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const usersData = await Service.getAllUser(token)
      setUsers(usersData)
      // console.log(usersData);
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchTasks = async () => {
    try {
      const tasksData = await Service.getAllTask(token)
      // setTasks(tasksData)
      dispatch(addTask(tasksData))
      // console.log(tasksData)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }
  useEffect(() => {
    fetchTeam()
    fetchTasks()
    fetchUsers()
    fetchProjects()
    fetchFabricators()
  }, [token])

  return (
    <div className="flex min-h-screen">
      <div className={`${isSubMenuOpen ? 'w-16' : 'w-20'} h-screen flex-shrink-0`}>
        <Sidebar isSubMenuOpen={isSubMenuOpen} setIsSubMenuOpen={setIsSubMenuOpen} />
      </div>
      <div
        className={`flex-1 overflow-y-auto p-2 transition-all duration-300 ${
          isSubMenuOpen ? 'ml-60' : ''
        }`}
      >
        <div className="rounded-lg h-auto pt-2 pb-20 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/all-user" element={<AllUser />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/gaant" element={<GaantChart />} />
            <Route path="/add-project" element={<AddProject />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/all-project" element={<Allprojects />} />
            <Route path="/add-fabricator" element={<AddFabricator />} />
            <Route path="/all-fabricator" element={<AllFabricators />} />
            <Route path="/manage-team" element={<ManageTeam />} />
            <Route path="/add-team" element={<AddTeam />} />
            <Route path="/task-record" element={<TaskRecord />} />
            <Route path="/users-task-record" element={<UsersTaskRecord />} />
            <Route path="/my-task" element={<MyTask />} />
            <Route path="/all-task" element={<AllTask />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/approve-assignee" element={<ApproveAssignee />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
