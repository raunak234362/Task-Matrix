/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
// import { GiHamburgerMenu } from 'react-icons/gi';
// import { IoIosCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
// import { loadFabricator, showClient } from '../../../../../store/fabricatorSlice.js'
import Service from "../../../../api/configAPI";
import { addProject } from "../../../../store/projectSlice";

const ProjectTab = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  // Function to toggle menu visibility
  const projects = useSelector((state) => state?.projectData?.projectData);
  // console.log(projects)
  const token = sessionStorage.getItem("token");

  // Count the number of active projects
  const activeProjectsCount = projects?.filter(
    (project) => project.status === "ACTIVE",
  ).length;

  // Count the number of completed projects
  const completedProjectsCount = projects?.filter(
    (project) => project.status === "COMPLETE",
  ).length;

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };
  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full h-fit overflow-y-hidden mx-5">
      <div className="flex items-center justify-center w-full">
        <div className="px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-teal-500/50">
          Project
        </div>
      </div>

      <div className="h-full mt-2 overflow-y-auto">
        <div className="grid grid-cols-2 gap-5 my-5 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              Total Projects
            </div>
            <div className="text-3xl font-bold">{projects?.length}</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              No. of Active Projects
            </div>
            <div className="text-3xl font-bold">{activeProjectsCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              No. of Completed Projects
            </div>
            <div className="text-3xl font-bold">{completedProjectsCount}</div>
          </div>
        </div>

        {/* Conditional rendering of menu */}
        <div className={` rounded-lg bg-white md:text-lg text-sm`}>
          <div className="overflow-auto rounded-lg bg-teal-100 md:w-full w-[90vw]">
            <nav className="px-5 text-center drop-shadow-md">
              <ul className="flex items-center gap-10 py-1 text-center justify-evenly">
                {/* {(userType === "manager" || userType=== "admin") ? (
                  <li className="px-2">
                    <NavLink
                      to="add-project"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      Add Project
                    </NavLink>
                  </li>
                ) : null} */}
                <li className="px-2">
                  <NavLink
                    to="all-project"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    All Project
                  </NavLink>
                </li>
                {(userType === "manager" || userType=== "admin") ? (
                  <li className="px-2">
                    <NavLink
                      to="project-stats"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      Project Stats
                    </NavLink>
                  </li>
                ) : null}
                {/* {(userType === "manager" || userType=== "admin") ? (
                  <li className="px-2">
                    <NavLink
                      to="manage-team"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      Manage Team
                    </NavLink>
                  </li>
                ) : null} */}
                {/* {(userType === "manager" || userType=== "admin") ? (
                  <li className="px-2">
                    <NavLink
                      to="add-team"
                      ww
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      Add Team
                    </NavLink>
                  </li>
                ) : null} */}
              </ul>
            </nav>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProjectTab;
