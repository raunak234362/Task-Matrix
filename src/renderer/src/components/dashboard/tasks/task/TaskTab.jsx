/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { LayoutList, ListChecks, MonitorPause } from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

const TaskTab = () => {

  const tasks = useSelector((state) => state?.taskData.taskData);
  // Count the number of active projects
  const activeTaskCount = tasks.filter(
    (task) => task.status === "IN_PROGRESS",
  ).length;

  // Count the number of completed projects
  const completedTaskCount = tasks.filter(
    (task) => task.status === "COMPLETE",
  ).length;

  const inReviewTaskCount = tasks.filter(
    (task) => task.status === "IN_REVIEW",
  ).length;
  const assignedTaskCount = tasks.filter(
    (task) => task.status === "ASSIGNED",
  ).length;
  const breakTaskCount = tasks.filter((task) => task.status === "BREAK").length;

  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full h-[89vh] overflow-y-auto ">
      <div className="flex items-center justify-center w-full">
        <div className="px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-teal-500/70">
          Task
        </div>
      </div>
      <div className="overflow-y-hidden mx-2">
        <div className="grid grid-cols-2 gap-5 my-5 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-green-500">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Task</p>
                  <h2 className="text-2xl font-bold text-gray-800">{tasks?.length || 0}</h2>
                  <div className="items-center mt-1 gap-5">
                    <span className="text-sm text-green-500">Completed task</span>
                    <div className="text-xl text-green-500 font-bold">{completedTaskCount}</div>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  {/* <Users  /> */}
                  <ListChecks className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-amber-500">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Assigned Tasks</p>
                  <h2 className="text-2xl font-bold text-gray-800">{assignedTaskCount || 0}</h2>
                  <div className="items-center mt-1 gap-5">
                    <span className="text-sm text-amber-500">In Progress tasks</span>
                    <div className="text-xl text-amber-500 font-bold">{completedTaskCount}</div>
                  </div>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  {/* <Users  /> */}
                  <LayoutList className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">In-Review Tasks</p>
                  <h2 className="text-2xl font-bold text-gray-800">{inReviewTaskCount || 0}</h2>
                  <div className="items-center mt-2 gap-5">
                    <span className="text-sm text-orange-500">In Break tasks</span>
                    <div className="text-xl text-orange-500 font-bold">{breakTaskCount}</div>
                  </div>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  {/* <Users  /> */}
                  <MonitorPause className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conditional rendering of menu */}
        <div
          className={`h-full rounded-lg  md:text-lg text-sm`}
        >
          <div className=" bg-white border-l-4 border-b-2 border-teal-300 rounded-md md:w-full w-[90vw]">
            <nav className="px-5 text-center drop-shadow-md">
              <ul className="flex items-center gap-10 py-1 text-center justify-evenly">
                <li className="px-2">
                  <NavLink
                    to="my-task"
                    className={({ isActive }) =>
                      isActive
                        ? " border-2 border-teal-400 bg-teal-100 drop-shadow-lg flex px-5 py-1 rounded-lg text-teal-600 font-medium"
                        : "hover:bg-teal-200 hover:border-2 hover:border-teal-400 rounded-lg flex px-5 py-1 hover:text-white"
                    }
                  >
                    My Task
                  </NavLink>
                </li>
                <li className="px-2">
                  <NavLink
                    to="all-task"
                    className={({ isActive }) =>
                      isActive
                        ? " border-2 border-teal-400 bg-teal-100 drop-shadow-lg flex px-5 py-1 rounded-lg text-teal-600 font-medium"
                        : "hover:bg-teal-200 hover:border-2 hover:border-teal-400 rounded-lg flex px-5 py-1 hover:text-white"
                    }
                  >
                    All Task
                  </NavLink>
                </li>
                <li className="px-2">
                  <NavLink
                    to="myTask-record"
                    className={({ isActive }) =>
                      isActive
                        ? " border-2 border-teal-400 bg-teal-100 drop-shadow-lg flex px-5 py-1 rounded-lg text-teal-600 font-medium"
                        : "hover:bg-teal-200 hover:border-2 hover:border-teal-400 rounded-lg flex px-5 py-1 hover:text-white"
                    }
                  >
                    My Task Record
                  </NavLink>
                </li>
                {userType === "project-manager" ||
                  userType === "admin" ||
                  userType === "department-manager" ? (
                  <li className="px-2">
                    <NavLink
                      to="add-task"
                      className={({ isActive }) =>
                        isActive
                          ? " border-2 border-teal-400 bg-teal-100 drop-shadow-lg flex px-5 py-1 rounded-lg text-teal-600 font-medium"
                          : "hover:bg-teal-200 hover:border-2 hover:border-teal-400 rounded-lg flex px-5 py-1 hover:text-white"
                      }
                    >
                      Add Task
                    </NavLink>
                  </li>
                ) : null}
                {userType === "manager" || userType === "admin" ? (
                  <li className="px-2">
                    <NavLink
                      to="approve-assignee"
                      className={({ isActive }) =>
                        isActive
                          ? " border-2 border-teal-400 bg-teal-100 drop-shadow-lg flex px-5 py-1 rounded-lg text-teal-600 font-medium"
                          : "hover:bg-teal-200 hover:border-2 hover:border-teal-400 rounded-lg flex px-5 py-1 hover:text-white"
                      }
                    >
                      Assignee List
                    </NavLink>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TaskTab;
