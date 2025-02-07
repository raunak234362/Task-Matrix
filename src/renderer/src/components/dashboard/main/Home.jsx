/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Service from "../../../api/configAPI";
import { BarViews, FabricatorCharts, Header } from "../../index";
import SegregateProject from "../../../util/SegregateProject";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showProjects, showTeam } from "../../../store/projectSlice";
import { showTask } from "../../../store/taskSlice";
import { showStaff } from "../../../store/userSlice";
import { showFabricator } from "../../../store/fabricatorSlice";

const Home = () => {
  const userType = sessionStorage.getItem("userType");
  const [team, setTeam] = useState([]);
  const [segregateProject, setSegregateProject] = useState({});
  const token = sessionStorage.getItem("token");

  const dispatch = useDispatch();

  const projects = useSelector((state) => state?.projectData?.projectData);
  console.log(projects);
  const tasks = useSelector((state) => state?.taskData?.taskData);
  const users = useSelector((state) => state?.userData?.staffData);
  const fabricators = useSelector(
    (state) => state?.fabricatorData?.fabricatorData,
  );
  const teams = useSelector((state) => state?.projectData?.teamData);
  // console.log(teams)

  useEffect(() => {
    const segregateProject = async () => {
      const segregatedProjects = await SegregateProject(projects);
      setSegregateProject(segregatedProjects);
    };
    segregateProject();
  }, []);

  return (
    <div className="w-full h-[89vh] overflow-y-hidden mx-5">
      <div className="flex items-center justify-center w-full">
        <div className="px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-teal-500/50">
          Dashboard
        </div>
      </div>
      <div className="h-[85vh] mt-2 overflow-y-auto">
        <div className="grid grid-cols-1 gap-6 px-2 my-6 md:grid-cols-2 lg:grid-cols-5">
          {/* {(userType === "manager" || userType=== "admin") ? (
            <div className="flex flex-col items-center p-2 text-center text-gray-800 bg-gray-200 rounded-lg shadow-md">
              <NavLink to="/admin/fabricator">
                <span className="text-4xl font-bold text-gray-900">
                  {fabricators?.length}
                </span>
                <p className="mt-2 text-xl font-semibold">
                  Total No. of Fabricators
                </p>
              </NavLink>
            </div>
          ) : null} */}
          <div className="flex flex-col items-center p-2 text-center text-gray-800 bg-green-200 rounded-lg shadow-md">
            <NavLink to="/admin/project">
              <span className="text-4xl font-bold text-gray-900">
                {projects?.length}
              </span>
              <p className="mt-2 text-xl font-semibold">
                Total No. of Projects
              </p>
            </NavLink>
          </div>
          <div className="flex flex-col items-center p-2 text-center text-gray-800 bg-gray-200 rounded-lg shadow-md">
            <NavLink to="/admin/task">
              <span className="text-4xl font-bold text-gray-900">
                {tasks?.length}
              </span>
              <p className="mt-2 text-xl font-semibold">Total No. of Tasks</p>
            </NavLink>
          </div>
          {userType === "manager" || userType === "admin" ? (
            <div className="flex flex-col items-center p-2 text-center text-gray-800 bg-green-200 rounded-lg shadow-md">
              <NavLink to="/admin/user">
                <span className="text-4xl font-bold text-gray-900">
                  {users?.length}
                </span>
                <p className="mt-2 text-xl font-semibold">Total No. of Users</p>
              </NavLink>
            </div>
          ) : null}
          {userType === "manager" || userType === "admin" ? (
            <div className="flex flex-col items-center p-2 text-center text-gray-800 bg-gray-200 rounded-lg shadow-md">
              <NavLink to="/admin/project/manage-team">
                <span className="text-4xl font-bold text-gray-900">
                  {teams?.length}
                </span>
                <p className="mt-2 text-xl font-semibold">Total No. of Team</p>
              </NavLink>
            </div>
          ) : null}
        </div>

        <div className="p-2 my-5 bg-gray-200 rounded-lg">
          <div>
            <FabricatorCharts segregateProject={segregateProject} />
          </div>
        </div>
        <div className="grid grid-cols-[69%,30%]  gap-2">
          <div className="p-6 bg-white rounded-lg shadow-lg ">
            <BarViews
              segregateProject={segregateProject}
              setProject={projects}
              setFabricator={fabricators}
            />
          </div>

          <div className="flex-grow p-6 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-2xl font-semibold">All Projects</h3>
            <div className="overflow-x-auto h-[50vh]">
              <table className="w-full text-left border-collapse table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border">S.no</th>
                    <th className="px-4 py-2 border">Project Name</th>
                    <th className="px-4 py-2 border">Project Manager</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto">
                  {projects?.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-center border">
                        No Projects Found
                      </td>
                    </tr>
                  ) : (
                    projects?.map((project, index) => (
                      <tr key={project.id}>
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{project.name}</td>
                        <td className="px-4 py-2 border">
                          {project.manager?.f_name}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
