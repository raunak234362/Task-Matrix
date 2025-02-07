/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

const UserTab = () => {
  const users = useSelector((state) => state?.userData?.staffData);
  // Count the number of active projects

  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full h-[89vh] overflow-y-hidden mx-5">
      <div className="flex w-full justify-center items-center">
        <div className="text-3xl font-bold text-white bg-green-500/70 shadow-xl px-5 py-1 mt-2 rounded-lg">
          User
        </div>
      </div>
      <div className="h-[85vh] mt-2 overflow-y-auto">
        {/* {userType === "admin" && "manager" ? (
          <div className="my-5 grid md:grid-cols-4 grid-cols-2 gap-5">
            <div className="flex flex-col justify-center items-center bg-white/50 rounded-lg p-3 shadow-lg">
              <div className="font-bold text-xl text-gray-800">All User</div>
              <div className="text-3xl font-bold">{users?.length}</div>
            </div>
          </div>
        ) : null} */}

        {/* Conditional rendering of menu */}
        <div className={`rounded-lg bg-white md:text-lg text-sm`}>
          <div className="overflow-auto bg-teal-100 rounded-lg md:w-full w-[90vw]">
            <nav className="px-5 drop-shadow-md text-center">
              <ul className="flex items-center justify-evenly gap-10 py-1 text-center">
                {/* <li className="px-2">
                  <NavLink
                    to="all-user"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    All User
                  </NavLink>
                </li> */}
                {(userType === "manager" || userType=== "admin") ? (
                  <li className="px-2">
                    <NavLink
                      to="user-task-record"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      User&apos;s Task Record
                    </NavLink>
                  </li>
                ) : null}
                {/* {userType === "admin" ? (
                  <li className="px-2">
                    <NavLink
                      to="add-user"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      Add User
                    </NavLink>
                  </li>
                ) : null} */}

                <li className="px-2">
                  <NavLink
                    to="calendar"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    Calendar
                  </NavLink>
                </li>
                {(userType === "manager" || userType=== "admin") ? (
                  <li className="px-2">
                    <NavLink
                      to="gaant-chart"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      Gaant Chart
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

export default UserTab;
