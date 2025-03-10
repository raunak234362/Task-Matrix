/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

const TaskTab = () => {
  const tasks = useSelector((state) => state?.taskData.taskData);
  // Count the number of active projects
  const activeTaskCount = tasks.filter(
    (task) => task.status === "IN PROGRESS",
  ).length;

  // Count the number of completed projects
  const completedTaskCount = tasks.filter(
    (task) => task.status === "COMPLETE",
  ).length;

  const inReviewTaskCount = tasks.filter(
    (task) => task.status === "IN REVIEW",
  ).length;
  const assignedTaskCount = tasks.filter(
    (task) => task.status === "ASSIGNED",
  ).length;
  const breakTaskCount = tasks.filter((task) => task.status === "BREAK").length;

  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full h-full mx-5 overflow-y-hidden">
      <div className="flex items-center justify-center w-full">
        <div className="px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-green-500/70">
          Task
        </div>
      </div>
      <div className="overflow-y-hidden">
        <div className="grid grid-cols-2 gap-5 my-5 md:grid-cols-3 lg:grid-cols-6">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">Total Tasks</div>
            <div className="text-3xl font-bold">{tasks.length}</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              No. of Completed Tasks
            </div>
            <div className="text-3xl font-bold">{completedTaskCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              No. of In-Progress Tasks
            </div>
            <div className="text-3xl font-bold">{activeTaskCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              No. of Assigned Tasks
            </div>
            <div className="text-3xl font-bold">{assignedTaskCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              No. of In-Break Tasks
            </div>
            <div className="text-3xl font-bold">{breakTaskCount}</div>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              No. of In-Review Tasks
            </div>
            <div className="text-3xl font-bold">{inReviewTaskCount}</div>
          </div>
        </div>

        {/* Conditional rendering of menu */}
        <div
          className={`overflow-y-auto h-[75vh] rounded-lg bg-white md:text-lg text-sm`}
        >
          <div className=" bg-teal-100 rounded-lg md:w-full w-[90vw]">
            <nav className="px-5 text-center drop-shadow-md">
              <ul className="flex items-center gap-10 py-1 text-center justify-evenly">
                <li className="px-2">
                  <NavLink
                    to="my-task"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
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
                        ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
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
                        ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
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
                          ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
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
                          ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
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
