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
  const [fabricator, setFabricator] = useState(null);
  const [project, setProject] = useState(null);
  const [team, setTeam] = useState([]);
  const [segregateProject, setSegregateProject] = useState({});
  const token = sessionStorage.getItem("token");
  
  const dispatch = useDispatch();

  const projects = useSelector((state) => state?.projectData?.projectData);
  const tasks = useSelector((state) => state?.taskData?.taskData);
  console.log("Task data",tasks);
  const users = useSelector((state) => state?.userData?.staffData);
  const fabricators = useSelector(
    (state) => state?.fabricatorData?.fabricatorData,
  );
  const teams = useSelector((state) => state?.projectData?.teamData);
  // console.log(teams)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await Service.getAllProject(token);
        dispatch(showProjects(projectsData));
        const segregatedProjects = await SegregateProject(projectsData);
        setSegregateProject(segregatedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const tasksData = await Service.getAllTask(token);
        dispatch(showTask(tasksData));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // const fetchUsers = async () => {
    //   try {
    //     const usersData = await Service.getAllUser(token);
    //     dispatch(showStaff(usersData));
    //     // setUsers(usersData)
    //   } catch (error) {
    //     console.error("Error fetching users:", error);
    //   }
    // };

    // const fetchFabricators = async () => {
    //   try {
    //     const fabricatorsData = await Service.getAllFabricator(token);
    //     dispatch(showFabricator(fabricatorsData));
    //   } catch (error) {
    //     console.error("Error fetching fabricators:", error);
    //   }
    // };

    // const fetchTeam = async () => {
    //   try {
    //     const teamData = await Service.getAllTeam(token);
    //     // console.log(teamData)
    //     dispatch(showTeam(teamData));
    //     // setTeam(teamData)
    //   } catch (error) {
    //     console.error("Error fetching team:", error);
    //   }
    // };

    // fetchTeam();
    fetchTasks();
    // fetchUsers();
    fetchProjects();
    // fetchFabricators();
  }, [token]);

  return (
    <div className="w-full h-[89vh] overflow-y-hidden mx-5">
      <div className="flex w-full justify-center items-center">
        <div className="text-3xl font-bold text-white bg-teal-500/50 shadow-xl px-5 py-1 mt-2 rounded-lg">
          Dashboard
        </div>
      </div>
      <div className="h-[85vh] mt-2 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 my-6 px-2">
        {(userType === "manager" || userType=== "admin") ? (
            <div className="bg-gray-200 shadow-md p-2 flex flex-col items-center rounded-lg text-center text-gray-800">
              <NavLink to="/admin/fabricator">
                <span className="text-4xl font-bold text-gray-900">
                  {fabricators?.length}
                </span>
                <p className="mt-2 text-xl font-semibold">
                  Total No. of Fabricators
                </p>
              </NavLink>
            </div>
          ) : null}
          <div className="bg-green-200 shadow-md p-2 flex flex-col items-center rounded-lg text-center text-gray-800">
            <NavLink to="/admin/project">
              <span className="text-4xl font-bold text-gray-900">
                {projects?.length}
              </span>
              <p className="mt-2 text-xl font-semibold">
                Total No. of Projects
              </p>
            </NavLink>
          </div>
          <div className="bg-gray-200 shadow-md p-2 flex flex-col items-center rounded-lg text-center text-gray-800">
            <NavLink to="/admin/task">
              <span className="text-4xl font-bold text-gray-900">
                {tasks?.length}
              </span>
              <p className="mt-2 text-xl font-semibold">Total No. of Tasks</p>
            </NavLink>
          </div>
          {(userType === "manager" || userType=== "admin") ? (
            <div className="bg-green-200 shadow-md p-2 flex flex-col items-center rounded-lg text-center text-gray-800">
              <NavLink to="/admin/user">
                <span className="text-4xl font-bold text-gray-900">
                  {users?.length}
                </span>
                <p className="mt-2 text-xl font-semibold">Total No. of Users</p>
              </NavLink>
            </div>
          ) : null}
          {(userType === "manager" || userType=== "admin") ? (
            <div className="bg-gray-200 shadow-md p-2 flex flex-col items-center rounded-lg text-center text-gray-800">
              <NavLink to="/admin/project/manage-team">
                <span className="text-4xl font-bold text-gray-900">
                  {teams?.length}
                </span>
                <p className="mt-2 text-xl font-semibold">Total No. of Team</p>
              </NavLink>
            </div>
          ) : null}
        </div>

        <div className="bg-gray-200 p-2 my-5 rounded-lg">
          <div>
            <FabricatorCharts segregateProject={segregateProject} />
          </div>
        </div>
        <div className="grid grid-cols-[69%,30%]  gap-2">
          <div className=" bg-white shadow-lg rounded-lg p-6 ">
            <BarViews
              segregateProject={segregateProject}
              setProject={setProject}
              setFabricator={setFabricator}
            />
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 flex-grow">
            <h3 className="text-2xl font-semibold mb-4">All Projects</h3>
            <div className="overflow-x-auto h-[50vh]">
              <table className="w-full  table-auto border-collapse text-left">
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
                          {project.manager?.name}
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
