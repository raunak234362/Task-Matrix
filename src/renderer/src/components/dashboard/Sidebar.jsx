/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { IoMdPeople, IoMdCheckmarkCircle } from 'react-icons/io'
import { MdDashboard } from 'react-icons/md'
import { BsSuitcaseLgFill } from 'react-icons/bs'
import { FaLayerGroup } from 'react-icons/fa'

const Sidebar = ({ isSubMenuOpen, setIsSubMenuOpen }) => {
  const [activeMenu, setActiveMenu] = useState('')
  const [activeSubMenu, setActiveSubMenu] = useState('')
  const userType = sessionStorage.getItem('userType')

  const handleClick = (menu) => {
    const newActiveMenu = activeMenu === menu ? '' : menu
    setActiveMenu(newActiveMenu)
    setIsSubMenuOpen(newActiveMenu !== '')
  }

  const handleSubMenuClick = (subMenu) => {
    setActiveSubMenu(subMenu)
  }

  return (
    <div className="bg-gray-800 text-white left-0 top-0 fixed w-16 h-screen flex flex-col">
      <nav className="w-full flex flex-wrap px-auto justify-center">
        <ul className="flex flex-col">
          {userType !== 'user' && (
            <li>
              <button
                onClick={() => handleClick('dashboard')}
                className={`flex items-center w-full py-5 px-2 relative ${
                  activeMenu === 'dashboard' ? 'bg-gray-700' : ''
                }`}
              >
                <MdDashboard className="text-3xl" />
                {activeMenu === 'dashboard' && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
                )}
              </button>
              {activeMenu === 'dashboard' && (
                <div className="absolute top-0 w-60 h-screen bg-slate-700 ml-12">
                  <ul className="pl-6 flex flex-col gap-5 py-5">
                    <li>
                      <Link
                        to="/dashboard"
                        onClick={() => handleSubMenuClick('dashboard')}
                        className={`block py-2 ${
                          activeSubMenu === 'dashboard'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          )}

          <li>
            <button
              onClick={() => handleClick('user')}
              className={`flex items-center w-full py-5 px-2 relative ${
                activeMenu === 'user' ? 'bg-gray-700' : ''
              }`}
            >
              <IoMdPeople className="text-4xl" />
              {activeMenu === 'user' && (
                <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
              )}
            </button>
            {activeMenu === 'user' && (
              <div className="absolute top-0 w-60 h-screen bg-slate-700 ml-12">
                {userType === 'admin' && (
                  <ul className="pl-6 flex flex-col gap-5 py-5">
                    <li>
                      <Link
                        to="/dashboard/my-profile"
                        onClick={() => handleSubMenuClick('my-profile')}
                        className={`block py-2 ${
                          activeSubMenu === 'my-profile'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/add-user"
                        onClick={() => handleSubMenuClick('add-user')}
                        className={`block py-2 ${
                          activeSubMenu === 'add-user'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Add User
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/all-user"
                        onClick={() => handleSubMenuClick('all-user')}
                        className={`block py-2 ${
                          activeSubMenu === 'all-user'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        All User
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/calendar"
                        onClick={() => handleSubMenuClick('calendar')}
                        className={`block py-2 ${
                          activeSubMenu === 'calendar'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Calendar
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/gaant"
                        onClick={() => handleSubMenuClick('gaant')}
                        className={`block py-2 ${
                          activeSubMenu === 'gaant'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Gaant Chart
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/task-record"
                        onClick={() => handleSubMenuClick('task-record')}
                        className={`block py-2 ${
                          activeSubMenu === 'task-record'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        My Task Records
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/users-task-record"
                        onClick={() => handleSubMenuClick('users-task-record')}
                        className={`block py-2 ${
                          activeSubMenu === 'users-task-record'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Task Records
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        to="/dashboard/notification"
                        onClick={() => handleSubMenuClick("notification")}
                        className={`block py-2 ${
                          activeSubMenu === "notification"
                            ? "bg-white text-gray-900 pl-5 font-bold"
                            : ""
                        }`}
                      >
                        Notification
                      </Link>
                    </li> */}
                  </ul>
                )}
                {userType === 'manager' && (
                  <ul className="pl-6 flex flex-col gap-5 py-5">
                    <li>
                      <Link
                        to="/dashboard/my-profile"
                        onClick={() => handleSubMenuClick('my-profile')}
                        className={`block py-2 ${
                          activeSubMenu === 'my-profile'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/all-user"
                        onClick={() => handleSubMenuClick('all-user')}
                        className={`block py-2 ${
                          activeSubMenu === 'all-user'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        All User
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/calendar"
                        onClick={() => handleSubMenuClick('calendar')}
                        className={`block py-2 ${
                          activeSubMenu === 'calendar'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Calendar
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/task-record"
                        onClick={() => handleSubMenuClick('task-record')}
                        className={`block py-2 ${
                          activeSubMenu === 'task-record'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        My Task Records
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/users-task-record"
                        onClick={() => handleSubMenuClick('users-task-record')}
                        className={`block py-2 ${
                          activeSubMenu === 'users-task-record'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Task Records
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        to="/dashboard/notification"
                        onClick={() => handleSubMenuClick("notification")}
                        className={`block py-2 ${
                          activeSubMenu === "notification"
                            ? "bg-white text-gray-900 pl-5 font-bold"
                            : ""
                        }`}
                      >
                        Notification
                      </Link>
                    </li> */}
                  </ul>
                )}
                {userType === 'user' && (
                  <ul className="pl-6 flex flex-col gap-5 py-5">
                    <li>
                      <Link
                        to="/dashboard/my-profile"
                        onClick={() => handleSubMenuClick('my-profile')}
                        className={`block py-2 ${
                          activeSubMenu === 'my-profile'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/calendar"
                        onClick={() => handleSubMenuClick('calendar')}
                        className={`block py-2 ${
                          activeSubMenu === 'calendar'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Calendar
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/task-record"
                        onClick={() => handleSubMenuClick('task-record')}
                        className={`block py-2 ${
                          activeSubMenu === 'task-record'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Task Records
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        to="/dashboard/notification"
                        onClick={() => handleSubMenuClick("notification")}
                        className={`block py-2 ${
                          activeSubMenu === "notification"
                            ? "bg-white text-gray-900 pl-5 font-bold"
                            : ""
                        }`}
                      >
                        Notification
                      </Link>
                    </li> */}
                  </ul>
                )}
              </div>
            )}
          </li>
          {(userType === 'admin' || userType === 'manager') && (
            <li>
              <button
                onClick={() => handleClick('fabricator')}
                className={`flex items-center w-full py-5 px-2 relative ${
                  activeMenu === 'fabricator' ? 'bg-gray-700' : ''
                }`}
              >
                <FaLayerGroup className="text-3xl" />
                {activeMenu === 'fabricator' && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
                )}
              </button>
              {activeMenu === 'fabricator' && (
                <div className="absolute top-0 w-60 h-screen bg-slate-700 ml-12">
                  {userType === 'admin' && (
                    <ul className="pl-6 flex flex-col gap-5 py-5">
                      <li>
                        <Link
                          to="/dashboard/add-fabricator"
                          onClick={() => handleSubMenuClick('add-fabricator')}
                          className={`block py-2 ${
                            activeSubMenu === 'add-fabricator'
                              ? 'bg-white text-gray-900 pl-5 font-bold'
                              : ''
                          }`}
                        >
                          Add Fabricator
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/all-fabricator"
                          onClick={() => handleSubMenuClick('all-fabricator')}
                          className={`block py-2 ${
                            activeSubMenu === 'all-fabricator'
                              ? 'bg-white text-gray-900 pl-5 font-bold'
                              : ''
                          }`}
                        >
                          All Fabricators
                        </Link>
                      </li>
                    </ul>
                  )}
                  {userType === 'manager' && (
                    <ul className="pl-6 flex flex-col gap-5 py-5">
                      <li>
                        <Link
                          to="/dashboard/all-fabricator"
                          onClick={() => handleSubMenuClick('all-fabricator')}
                          className={`block py-2 ${
                            activeSubMenu === 'all-fabricator'
                              ? 'bg-white text-gray-900 pl-5 font-bold'
                              : ''
                          }`}
                        >
                          All Fabricators
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </li>
          )}
          <li>
            <button
              onClick={() => handleClick('project')}
              className={`flex items-center w-full py-7 px-2 relative ${
                activeMenu === 'project' ? 'bg-gray-700' : ''
              }`}
            >
              <BsSuitcaseLgFill className="text-3xl" />
              {activeMenu === 'project' && (
                <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
              )}
            </button>
            {activeMenu === 'project' && (
              <div className="absolute top-0 w-60 h-screen bg-slate-700 ml-12">
                {userType === 'admin' && (
                  <ul className="pl-6 flex flex-col gap-5 py-5">
                    <li>
                      <Link
                        to="/dashboard/add-project"
                        onClick={() => handleSubMenuClick('add-project')}
                        className={`block py-2 ${
                          activeSubMenu === 'add-project'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Add Project
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/all-project"
                        onClick={() => handleSubMenuClick('all-project')}
                        className={`block py-2 ${
                          activeSubMenu === 'all-project'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        All Project
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/add-team"
                        onClick={() => handleSubMenuClick('add-team')}
                        className={`block py-2 ${
                          activeSubMenu === 'add-team'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Add Team
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/manage-team"
                        onClick={() => handleSubMenuClick('manage-team')}
                        className={`block py-2 ${
                          activeSubMenu === 'manage-team'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Manage Team
                      </Link>
                    </li>
                  </ul>
                )}
                {userType === 'manager' && (
                  <ul className="pl-6 flex flex-col gap-5 py-5">
                    <li>
                      <Link
                        to="/dashboard/add-team"
                        onClick={() => handleSubMenuClick('add-team')}
                        className={`block py-2 ${
                          activeSubMenu === 'add-team'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Add Team
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/manage-team"
                        onClick={() => handleSubMenuClick('manage-team')}
                        className={`block py-2 ${
                          activeSubMenu === 'manage-team'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Manage Team
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/all-project"
                        onClick={() => handleSubMenuClick('all-project')}
                        className={`block py-2 ${
                          activeSubMenu === 'all-project'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        All Project
                      </Link>
                    </li>
                  </ul>
                )}
                {userType === 'user' && (
                  <ul className="pl-6 flex flex-col gap-5 py-5">
                    <li>
                      <Link
                        to="/dashboard/all-project"
                        onClick={() => handleSubMenuClick('all-project')}
                        className={`block py-2 ${
                          activeSubMenu === 'all-project'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        All Project
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </li>
          <li>
            <button
              onClick={() => handleClick('task')}
              className={`flex items-center w-full py-6 px-2 relative ${
                activeMenu === 'task' ? 'bg-gray-700' : ''
              }`}
            >
              <IoMdCheckmarkCircle className="text-4xl" />
              {activeMenu === 'task' && (
                <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
              )}
            </button>
            {activeMenu === 'task' && (
              <div className="absolute top-0 w-60 h-screen bg-slate-700 ml-12">
                {(userType === 'admin' || userType === 'manager') && (
                  <ul className="pl-6 flex flex-col gap-5 py-5">
                    <li>
                      <Link
                        to="/dashboard/my-task"
                        onClick={() => handleSubMenuClick('my-task')}
                        className={`block py-2 ${
                          activeSubMenu === 'my-task'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        My Tasks
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/add-task"
                        onClick={() => handleSubMenuClick('add-task')}
                        className={`block py-2 ${
                          activeSubMenu === 'add-task'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Add Task
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/approve-assignee"
                        onClick={() => handleSubMenuClick('approve-assignee')}
                        className={`block py-2 ${
                          activeSubMenu === 'approve-assignee'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        Approve Assignee
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/all-task"
                        onClick={() => handleSubMenuClick('all-task')}
                        className={`block py-2 ${
                          activeSubMenu === 'all-task'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        All Task
                      </Link>
                    </li>
                  </ul>
                )}
                {userType === 'user' && (
                  <ul className="pl-6 flex flex-col gap-5 py-5">
                    <li>
                      <Link
                        to="/dashboard/my-task"
                        onClick={() => handleSubMenuClick('my-task')}
                        className={`block py-2 ${
                          activeSubMenu === 'my-task'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        My Tasks
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/all-task"
                        onClick={() => handleSubMenuClick('all-task')}
                        className={`block py-2 ${
                          activeSubMenu === 'all-task'
                            ? 'bg-white text-gray-900 pl-5 font-bold'
                            : ''
                        }`}
                      >
                        All Task
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
