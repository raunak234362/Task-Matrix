/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { NavLink, useNavigate } from "react-router-dom";
import LOGO from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import Service from "../../api/configAPI";
import { useEffect, useState } from "react";
import { Button } from "../index";
// import { logout as logoutAction } from "../../../store/userSlice";
// import AuthService from "../../../frappeConfig/AuthService";
const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = sessionStorage.getItem("token");
  const [currentUser, setCurrentUser] = useState();

  const fetchUserData = async () => {
    const userData = await Service.getCurrentUser(token);
    setCurrentUser(userData[0]);
  };

  const fetchLogout = async () => {
    try {
      // const response = await AuthService.logout(token);
      sessionStorage.removeItem("userType");
      sessionStorage.removeItem("token");
      // dispatch(logoutAction());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  // Sidebar.js
  // const fetchLogout = async () => {
  //   try {

  //     const response = await AuthService.logout(token);
  //     dispatch(logoutAction());
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  useEffect(() => {
    fetchUserData();
  }, []);

  const userType = sessionStorage.getItem("userType");
  return (
    <div className="flex flex-col justify-between md:h-[88vh] h-[88vh] w-64 bg-white/70 md:border-4 text-black md:rounded-xl rounded-lg">
      <nav className="p-5">
        <ul className="flex flex-col gap-5">
          {userType !== "human-resource" ? (
            <li>
              <NavLink
                to="home"
                className={({ isActive }) =>
                  isActive
                    ? "flex justify-center items-center text-white bg-teal-400 rounded-md w-full  delay-150"
                    : "text-black hover:text-white hover:flex hover:justify-center hover:items-center hover:bg-teal-200  rounded-md"
                }
              >
                <div>Dashboard</div>
              </NavLink>
            </li>
          ) : null}
          {/* {userType === "admin" ? (
              <li>
                <NavLink
                  to="fabricator"
                  className={({ isActive }) =>
                    isActive
                      ? "flex justify-center items-center text-white bg-teal-400 rounded-md w-full  delay-150"
                      : "text-black hover:text-white hover:flex hover:justify-center hover:items-center hover:bg-teal-200  rounded-md"
                  }
                >
                  <div>Fabricator</div>
                </NavLink>
              </li>
             
          ) : null} */}
          {userType !== "human-resource" ? (
            <li>
              <NavLink
                to="project/all-project"
                className={({ isActive }) =>
                  isActive
                    ? "flex justify-center items-center text-white bg-teal-400 rounded-md w-full  delay-150"
                    : "text-black hover:text-white hover:flex hover:justify-center hover:items-center hover:bg-teal-200  rounded-md"
                }
              >
                <div>Project</div>
              </NavLink>
            </li>
          ) : null}

          <li>
            <NavLink
              to="task/all-task"
              className={({ isActive }) =>
                isActive
                  ? "flex justify-center items-center text-white bg-teal-400 rounded-md w-full  delay-150"
                  : "text-black hover:text-white hover:flex hover:justify-center hover:items-center hover:bg-teal-200  rounded-md"
              }
            >
              <div>Task</div>
            </NavLink>
          </li>
          {/* {(userType === "manager" || userType === "admin") ? (
            <li>
              <NavLink
                to="user"
                className={({ isActive }) =>
                  isActive
                    ? "flex justify-center items-center text-white bg-teal-400 rounded-md w-full delay-150"
                    : "text-black hover:text-white hover:flex hover:justify-center hover:items-center hover:bg-teal-200  rounded-md"
                }
              >
                <div>Ghant Chart</div>
              </NavLink>
            </li>
          ) : null} */}

          <li className="w-full">
            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive
                  ? "flex justify-center items-center text-white bg-teal-400 rounded-md w-full  delay-150 transition-all ease-in-out"
                  : "text-black hover:text-white hover:flex hover:justify-center hover:items-center hover:bg-teal-200  rounded-md"
              }
            >
              <div>Profile</div>
            </NavLink>
          </li>
          <li></li>
        </ul>
      </nav>
      <div className="mb-5 md:flex md:justify-right">
        {/* <Button className="w-full mx-4 bg-teal-400" onClick={fetchLogout}>
          Logout
        </Button> */}
        <div className="block text-lg text-black md:hidden">
          {currentUser?.username}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
