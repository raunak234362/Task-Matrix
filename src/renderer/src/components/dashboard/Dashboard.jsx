/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
// src/components/AdminLayout.js
import React, { useState } from 'react'
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

const Dashboard = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

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
