/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store/store";

import { useCallback, useEffect, useState } from 'react'
import { Header, Sidebar } from './components/index'
import { Outlet, useNavigate } from 'react-router-dom'
import Service from './api/configAPI'
// import FrappeService from "./frappeConfig/FrappeService";
import { setUserData, showStaff } from './store/userSlice'
// import { loadFabricator, showClient } from "./store/fabricatorSlice";
import { showProjects, showTeam } from './store/projectSlice'
import { showTask } from './store/taskSlice'
import { showFabricator } from './store/fabricatorSlice'
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

    const [segregateProject, setSegregateProject] = useState({});

  const projects = useSelector((state) => state?.projectData?.projectData);
  const tasks = useSelector((state) => state?.taskData?.taskData);
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
        console.log("Task data-------------",tasksData);
        dispatch(showTask(tasksData));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersData = await Service.getAllUser(token);
        dispatch(showStaff(usersData));
        // setUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchFabricators = async () => {
      try {
        const fabricatorsData = await Service.getAllFabricator(token);
        dispatch(showFabricator(fabricatorsData));
      } catch (error) {
        console.error("Error fetching fabricators:", error);
      }
    };

    const fetchTeam = async () => {
      try {
        const teamData = await Service.getAllTeam(token);
        // console.log(teamData)
        dispatch(showTeam(teamData));
        // setTeam(teamData)
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };

    fetchTeam();
    fetchTasks();
    fetchUsers();
    fetchProjects();
    fetchFabricators();
  }, []);



  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, [setSidebarOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await Service.getCurrentUser(token)
      console.log(user)
        dispatch(setUserData(user))
    }
    fetchUser()
  }, [dispatch])


   useEffect(() => {
     const fetchProjects = async () => {
       try {
         const projectsData = await Service.getAllProject(token);
        //  console.log(projectsData)
         dispatch(showProjects(projectsData));
       } catch (error) {
         console.error("Error fetching projects:", error);
       }
     };

     const fetchTasks = async () => {
       try {
         const tasksData = await Service.getAllTask(token);
         console.log(tasksData)
         dispatch(showTask(tasksData));
       } catch (error) {
         console.error("Error fetching tasks:", error);
       }
     };

     const fetchUsers = async () => {
       try {
         const usersData = await Service.allEmployee(token);
         dispatch(showStaff(usersData));
         // setUsers(usersData)
       } catch (error) {
         console.error("Error fetching users:", error);
       }
     };

     const fetchFabricators = async () => {
       try {
         const fabricatorsData = await Service.getAllFabricator(token);
         dispatch(showFabricator(fabricatorsData));
       } catch (error) {
         console.error("Error fetching fabricators:", error);
       }
     };

     const fetchTeam = async () => {
       try {
         const teamData = await Service.getAllTeam(token);
         // console.log(teamData)
         dispatch(showTeam(teamData));
         // setTeam(teamData)
       } catch (error) {
         console.error("Error fetching team:", error);
       }
     };

     fetchTeam();
     fetchTasks();
     fetchUsers();
     fetchProjects();
     fetchFabricators();
   }, [token]);

  return (
    <Provider store={store}>
      <div className="flex flex-col w-screen h-screen overflow-hidden md:flex-row bg-gradient-to-r from-green-300/50 to-teal-300">
        {/* Sidebar */}

        {/* {!isConnected && (
          <>
            <div className="absolute top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-50">
              <div className="flex items-center justify-center w-full h-full px-20 py-10">
                <div className="px-32 py-20 text-red-700 bg-white border-2 border-red-700 rounded-3xl">
                  {result
                    ? 'Connecting to Server, Please Wait...'
                    : 'Connection Failed, Please Check Your Internet Connection'}
                </div>
              </div>
            </div>
          </>
        )} */}

        <div className="flex flex-col w-full">
          <div className="mx-5 my-2 shadow-2xl drop-shadow-lg">
            <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          </div>
          {/* Header */}
          <div className="flex flex-row">
            <div
              className={`fixed md:static flex flex-col md:bg-opacity-0 bg-white w-64 z-20 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } md:translate-x-0 md:w-64`}
            >
              <div className="flex items-center justify-between p-4">
                <Sidebar />
              </div>
            </div>
            {/* Main Content */}
            <div
              className={`flex h-[89vh] overflow-y-auto flex-grow transition-all duration-300 ${
                sidebarOpen ? "md:ml-64 ml-0 bg-black/50" : "md:ml-0 ml-0"
              }`}
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
