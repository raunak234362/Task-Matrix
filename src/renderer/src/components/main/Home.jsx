/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState, useMemo } from "react"
import SegregateProject from "../../util/SegregateProject"
import { useDispatch, useSelector } from "react-redux"
import { Briefcase, CheckSquare, Users, UserPlus } from "lucide-react"
import { FabricatorCharts } from "../index"

const Home = () => {
  const userType = sessionStorage.getItem("userType")
  const [segregateProject, setSegregateProject] = useState({})
  const [activeTab] = useState("overview")
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)

  const dispatch = useDispatch()
  const projects = useSelector((state) => state?.projectData?.projectData || [])
  const tasks = useSelector((state) => state?.taskData?.taskData || [])
  const users = useSelector((state) => state?.userData?.staffData || [])
  const fabricators = useSelector((state) => state?.fabricatorData?.fabricatorData || [])
  const teams = useSelector((state) => state?.projectData?.teamData || [])

  // Fetch and segregate projects
  useEffect(() => {
    const fetchSegregatedProjects = async () => {
      try {
        setIsLoadingProjects(true)
        const segregatedProjects = await SegregateProject(projects)
        setSegregateProject(segregatedProjects)
      } catch (error) {
        console.error("Error segregating projects:", error)
      } finally {
        setIsLoadingProjects(false)
      }
    }
    if (projects?.length) {
      fetchSegregatedProjects()
    }
  }, [projects])

  // Memoized calculations for performance
  const completedProjects = useMemo(
    () => projects.filter((project) => project?.status?.toUpperCase() === "COMPLETE")?.length || 0,
    [projects]
  )

  const inProgressProjects = useMemo(
    () => projects.filter((project) => project?.status?.toUpperCase() === "IN_PROGRESS")?.length || 0,
    [projects]
  )

  const completedTasks = useMemo(
    () => tasks.filter((task) => task?.status?.toUpperCase() === "COMPLETE")?.length || 0,
    [tasks]
  )

  const inProgressTasks = useMemo(
    () => tasks.filter((task) => task?.status?.toUpperCase() === "IN_PROGRESS")?.length || 0,
    [tasks]
  )

  const projectCompletionPercentage = useMemo(
    () => (projects?.length ? Math.round((completedProjects / projects.length) * 100) : 0),
    [completedProjects, projects]
  )

  const taskCompletionPercentage = useMemo(
    () => (tasks?.length ? Math.round((completedTasks / tasks.length) * 100) : 0),
    [completedTasks, tasks]
  )

  // Memoized recent projects (last 5)
  const recentProjects = useMemo(
    () =>
      [...projects]
        .filter((project) => project && project.name) // Ensure project and name exist
        .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
        .slice(0, 5),
    [projects]
  )

  // Memoized upcoming deadlines (next 15 tasks)
  const upcomingDeadlines = useMemo(
    () =>
      [...tasks]
        .filter(
          (task) =>
            task &&
            task.status &&
            !["COMPLETE", "IN_REVIEW", "ONHOLD"].includes(task.status.toUpperCase())
        )
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 15),
    [tasks]
  )

  // Format date utility
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString))) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="w-full h-screen rounded-lg overflow-y-auto">
      <div className="w-full mx-auto">
        {/* Dashboard Header */}
        <div className="relative bg-gradient-to-r from-teal-500 to-teal-700 py-2 shadow-md">
          <div className="w-full px-4 mx-auto">
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-teal-100">
              Welcome back,{" "}
              {userType === "admin"
                ? "Administrator"
                : userType === "project-manager"
                ? "Project Manager"
                : "Team Member"}
            </p>
          </div>
        </div>

        <div className="mx-2 py-2">
          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
                <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500 transform transition-transform hover:scale-105">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Projects</p>
                        <h2 className="text-3xl font-bold text-gray-800">{projects.length}</h2>
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

                <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-green-500 transform transition-transform hover:scale-105">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Tasks</p>
                        <h2 className="text-3xl font-bold text-gray-800">{tasks.length}</h2>
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

                {(userType === "manager" || userType === "admin") && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-purple-500 transform transition-transform hover:scale-105">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Team Members</p>
                          <h2 className="text-3xl font-bold text-gray-800">{users.length}</h2>
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
                )}

                {(userType === "project-manager" || userType === "admin") && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-amber-500 transform transition-transform hover:scale-105">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">Teams</p>
                          <h2 className="text-3xl font-bold text-gray-800">{teams.length}</h2>
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
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Projects */}
                <div className="bg-white rounded-lg shadow-md lg:col-span-1">
                  <div className="p-5 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Projects</h3>
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
                                className={`px-2 py-1 text-xs rounded-full ${
                                  project.status?.toUpperCase() === "COMPLETE"
                                    ? "bg-green-100 text-green-800"
                                    : project.status?.toUpperCase() === "IN_PROGRESS"
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
                    <h3 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h3>
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
                                  <div className="text-sm font-medium text-gray-900">{task.name || "N/A"}</div>
                                  <div className="text-xs text-gray-500">{task.project?.name || "N/A"}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{task.user?.f_name || "Unassigned"}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div
                                    className={`text-sm ${
                                      task.due_date && new Date(task.due_date) < new Date()
                                        ? "text-red-600 font-medium"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {formatDate(task.due_date)}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      task.status?.toUpperCase() === "COMPLETE"
                                        ? "bg-green-100 text-green-800"
                                        : task.status?.toUpperCase() === "IN_PROGRESS"
                                        ? "bg-blue-100 text-blue-800"
                                        : task.status?.toUpperCase() === "IN_REVIEW"
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
                  {isLoadingProjects ? (
                    <p className="text-gray-500 text-center">Loading project analytics...</p>
                  ) : (
                    <FabricatorCharts segregateProject={segregateProject} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home