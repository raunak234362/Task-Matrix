/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'

const Projects = () => {
  const tasks = useSelector((state) => state?.taskData.taskData)
console.log(tasks)
  // Count the number of active projects
  const activeTaskCount = tasks.filter((task) => task.status === 'ACTIVE').length

  // Count the number of completed projects
  const completedTaskCount = tasks.filter((task) => task.status === 'COMPLETE').length

  return (
    <div className="w-full h-[89vh] overflow-y-hidden mx-5">
      <div className="flex w-full justify-center items-center">
        <div className="text-3xl font-bold text-white bg-green-500/70 shadow-xl px-5 py-1 mt-2 rounded-lg">
          Task
        </div>
      </div>
      <div className="h-[85vh] mt-2 overflow-y-auto">
        <div className="my-5 grid md:grid-cols-4 grid-cols-2 gap-5">
          <div className="flex flex-col justify-center items-center bg-white/50 rounded-lg p-3 shadow-lg">
            <div className="font-bold text-xl text-gray-800">Total Tasks</div>
            <div className="text-3xl font-bold">{tasks.length}</div>
          </div>
          <div className="flex flex-col justify-center items-center bg-white/50 rounded-lg p-3 shadow-lg">
            <div className="font-bold text-xl text-gray-800">No. of In-Progress Tasks</div>
            <div className="text-3xl font-bold">{activeTaskCount}</div>
          </div>
          <div className="flex flex-col justify-center items-center bg-white/50 rounded-lg p-3 shadow-lg">
            <div className="font-bold text-xl text-gray-800">No. of Completed Tasks</div>
            <div className="text-3xl font-bold">{completedTaskCount}</div>
          </div>
          <div className="flex flex-col justify-center items-center bg-white/50 rounded-lg p-3 shadow-lg">
            <div className="font-bold text-xl text-gray-800">No. of In-Review Tasks</div>
            <div className="text-3xl font-bold">{completedTaskCount}</div>
          </div>
        </div>

        {/* Conditional rendering of menu */}
        <div className={`rounded-lg bg-white md:text-lg text-sm`}>
          <div className="overflow-auto bg-teal-100 rounded-lg md:w-full w-[90vw]">
            <nav className="px-5 drop-shadow-md text-center">
              <ul className="flex items-center justify-evenly gap-10 py-1 text-center">
                <li className="px-2">
                  <NavLink
                    to="add-task"
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold'
                        : 'hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white'
                    }
                  >
                    Add Task
                  </NavLink>
                </li>
                <li className="px-2">
                  <NavLink
                    to="all-task"
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold'
                        : 'hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white'
                    }
                  >
                    All Task
                  </NavLink>
                </li>
                <li className="px-2">
                  <NavLink
                    to="all-projects"
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold'
                        : 'hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white'
                    }
                  >
                    My Task
                  </NavLink>
                </li>
                <li className="px-2">
                  <NavLink
                    to="all-projects"
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold'
                        : 'hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white'
                    }
                  >
                    Assignee List
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Projects