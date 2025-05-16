/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { BarViews, FabricatorCharts } from "../../index"
import SegregateProject from "../../../util/SegregateProject"
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Users, Briefcase, CheckSquare, UserPlus } from "lucide-react"

const Home = () => {
  const userType = sessionStorage.getItem("userType")
  const [team, setTeam] = useState([])
  const [segregateProject, setSegregateProject] = useState({})
  const [activeTab, setActiveTab] = useState("overview")
  const token = sessionStorage.getItem("token")

  const dispatch = useDispatch()

  const projects = useSelector((state) => state?.projectData?.projectData)
  const tasks = useSelector((state) => state?.taskData?.taskData)
  const users = useSelector((state) => state?.userData?.staffData)
  const fabricators = useSelector((state) => state?.fabricatorData?.fabricatorData)
  const teams = useSelector((state) => state?.projectData?.teamData)

  useEffect(() => {
    const segregateProject = async () => {
      const segregatedProjects = await SegregateProject(projects)
      setSegregateProject(segregatedProjects)
    }
    segregateProject()
  }, [projects])

  // Calculate project statistics
  const completedProjects =
    projects?.filter((project) => project.status === "COMPLETE" || project.status === "complete").length || 0

  const inProgressProjects =
    projects?.filter((project) => project.status === "IN_PROGRESS" || project.status === "in_progress").length || 0

  const completedTasks = tasks?.filter((task) => task.status === "COMPLETE" || task.status === "complete").length || 0

  const inProgressTasks =
    tasks?.filter((task) => task.status === "IN_PROGRESS" || task.status === "in_progress").length || 0

  // Get recent projects (last 5)
  const recentProjects = [...(projects || [])]
    .sort((a, b) => {
      return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)
    })
    .slice(0, 5)

  // Get upcoming deadlines (next 5 tasks)
  const upcomingDeadlines = [...(tasks || [])]
    .filter((task) => task.status !== "COMPLETE" && task.status !== "complete" && task.status !== "IN_REVIEW" && task.status !== "in_review" && task.status !== "ONHOLD")
    .sort((a, b) => {
      return new Date(a.due_date) - new Date(b.due_date)
    })
    .slice(0, 15)

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate completion percentage for projects
  const projectCompletionPercentage = projects?.length ? Math.round((completedProjects / projects.length) * 100) : 0

  // Calculate completion percentage for tasks
  const taskCompletionPercentage = tasks?.length ? Math.round((completedTasks / tasks.length) * 100) : 0

  return (
    <div className="w-full h-[89vh] rounded-lg overflow-y-auto">
      <div className="w-full mx-auto">
        {/* Dashboard Header */}
        <div className="relative bg-gradient-to-r from-teal-500 to-teal-700 p-6 shadow-md">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-teal-100">
              Welcome back,{" "}
              {userType === "admin" ? "Administrator" : userType === "project-manager" ? "Project Manager" : "Team Member"}
            </p>

            {/* Dashboard Tabs */}
            <div className="flex mt-6 space-x-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === "overview" ? "bg-white text-teal-700" : "bg-teal-600 text-white hover:bg-teal-500"
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === "projects" ? "bg-white text-teal-700" : "bg-teal-600 text-white hover:bg-teal-500"
                  }`}
              >
                Projects
              </button>

            </div>
          </div>
        </div>

        <div className=" mx-2  py-6">
          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <NavLink to="/admin/project/all-project" className="transform transition-transform hover:scale-105">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Total Projects</p>
                          <h2 className="text-3xl font-bold text-gray-800">{projects?.length || 0}</h2>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {completedProjects} completed · {inProgressProjects} in progress
                            </span>
                          </div>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Briefcase className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                      <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${projectCompletionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </NavLink>

                <NavLink to="/admin/task/all-task" className="transform transition-transform hover:scale-105">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-green-500">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Total Tasks</p>
                          <h2 className="text-3xl font-bold text-gray-800">{tasks?.length || 0}</h2>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {completedTasks} completed · {inProgressTasks} in progress
                            </span>
                          </div>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <CheckSquare className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                      <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${taskCompletionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </NavLink>

                {(userType === "manager" || userType === "admin") && (
                  // <NavLink to="/admin/user/all-user" className="transform transition-transform hover:scale-105">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-purple-500">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Team Members</p>
                          <h2 className="text-3xl font-bold text-gray-800">{users?.length || 0}</h2>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-500">Active team members</span>
                          </div>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-purple-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  // </NavLink>
                )}

                {(userType === "project-manager" || userType === "admin") && (
                  // <NavLink to="/admin/project/manage-team" className="transform transition-transform hover:scale-105">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-amber-500">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Teams</p>
                          <h2 className="text-3xl font-bold text-gray-800">{teams?.length || 0}</h2>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-500">Active project teams</span>
                          </div>
                        </div>
                        <div className="bg-amber-100 p-3 rounded-full">
                          <UserPlus className="h-6 w-6 text-amber-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  // </NavLink>
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Projects */}
                <div className="bg-white rounded-lg shadow-md lg:col-span-1">
                  <div className="p-5 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Recent Projects</h3>
                      <NavLink to="/admin/project/all-project" className="text-sm text-teal-600 hover:text-teal-800">
                        View All
                      </NavLink>
                    </div>
                  </div>
                  <div className="p-5">
                    {recentProjects.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No projects found</p>
                    ) : (
                      <ul className="divide-y">
                        {recentProjects.map((project) => (
                          <li key={project.id} className="py-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-800">{project.name}</h4>
                                <p className="text-sm text-gray-500">
                                  Manager: {project.manager?.f_name || "Unassigned"}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${project.status === "COMPLETED" || project.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : project.status === "IN PROGRESS" || project.status === "in progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {project.status || "N/A"}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-lg shadow-md lg:col-span-2">
                  <div className="p-5 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h3>
                      <NavLink to="/admin/task/all-task" className="text-sm text-teal-600 hover:text-teal-800">
                        View All Tasks
                      </NavLink>
                    </div>
                  </div>
                  <div className="p-5">
                    {upcomingDeadlines.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
                    ) : (
                      <div className="overflow-x-auto h-[33vh] overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Task
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Assigned To
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {upcomingDeadlines.map((task) => (
                              <tr key={task.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{task.name}</div>
                                  <div className="text-xs text-gray-500">{task.project?.name || "N/A"}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{task.user?.f_name || "Unassigned"}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div
                                    className={`text-sm ${new Date(task.due_date) < new Date() ? "text-red-600 font-medium" : "text-gray-900"
                                      }`}
                                  >
                                    {formatDate(task.due_date)}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${task.status === "COMPLETED" || task.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : task.status === "IN PROGRESS" || task.status === "in progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : task.status === "IN REVIEW" || task.status === "in review"
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                  >
                                    {task.status || "N/A"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="bg-white rounded-lg shadow-md p-5 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Analytics</h3>
                <div className="h-full">
                  <FabricatorCharts segregateProject={segregateProject} />
                </div>
              </div>
            </>
          )}

          {/* Projects Tab Content */}
          {activeTab === "projects" && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 border-b">
                <h3 className="text-lg font-semibold text-gray-800">All Projects</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manager
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tasks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No projects found
                        </td>
                      </tr>
                    ) : (
                      projects?.map((project) => {
                        { console.log(project) }
                        const projectTasks = tasks?.filter((task) => task.project_id === project.id) || []
                        const completedProjectTasks = projectTasks.filter(
                          (task) => task.status === "COMPLETE" || task.status === "complete",
                        ).length

                        return (
                          <tr key={project.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{project.manager?.f_name || "Unassigned"}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${project.status === "COMPLETE" || project.status === "COMPLETE"
                                  ? "bg-green-100 text-green-800"
                                  : project.status === "IN PROGRESS" || project.status === "IN PROGRESS"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {project.status || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(project.startDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(project.endDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-900 mr-2">
                                  {completedProjectTasks}/{projectTasks.length}
                                </span>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{
                                      width: `${projectTasks.length ? (completedProjectTasks / projectTasks.length) * 100 : 0}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Home

