/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { NavLink, useNavigate } from "react-router-dom";
import LOGO from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import Service from "../../api/configAPI";
import { useEffect, useState } from "react";
import { Button } from "../index";
import { toast } from "react-toastify";
import { RefreshCw } from "lucide-react";
// import { logout as logoutAction } from "../../../store/userSlice";
// import AuthService from "../../../frappeConfig/AuthService";
const Sidebar = ({ refresh }) => {
  const navigate = useNavigate();
  const fetchLogout = async () => {
    try {
      // const response = await AuthService.logout(token);
      sessionStorage.removeItem("userType");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("socketId");
      sessionStorage.removeItem("userId");
      toast.success("Logout Successfully");
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

  const userType = sessionStorage.getItem("userType");
  return (
    <section className=" md:h-[90vh] h-screen w-64 bg-white/70 md:border-4 text-black md:rounded-xl rounded-lg">
      <div className="flex flex-col justify-between h-full">
        <div>
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

              <li className="w-full">
                <NavLink
                  to="chats"
                  className={({ isActive }) =>
                    isActive
                      ? "flex justify-center items-center text-white bg-teal-400 rounded-md w-full  delay-150 transition-all ease-in-out"
                      : "text-black hover:text-white hover:flex hover:justify-center hover:items-center hover:bg-teal-200  rounded-md"
                  }
                >
                  <div>Chats</div>
                </NavLink>
              </li>
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
        </div>
        <div className="flex flex-row gap-2 p-6">
          <Button

            onClick={fetchLogout}
          >
            Logout
          </Button>
          <Button

            onClick={refresh}
          >
            <RefreshCw />
          </Button>

        </div>
      </div>
    </section>
  );
};

export default Sidebar;
