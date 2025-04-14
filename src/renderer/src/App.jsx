/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store/store";
import { useCallback, useEffect, useState } from "react";
import { Header, Sidebar } from "./components/index";
import { Outlet, useNavigate } from "react-router-dom";
import Service from "./api/configAPI";
import { setUserData, showStaff } from "./store/userSlice";
import { showProjects, showTeam } from "./store/projectSlice";
import { showTask, showTaskRecord } from "./store/taskSlice";
import socket from "./socket";
import NotificationReceiver from "./util/NotificationReceiver";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const [userDetail,setUserDetail]=useState()
  const userType = sessionStorage.getItem("userType");
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, [setSidebarOpen]);

  const fetchProjects = async () => {
    const projectsData = await Service.getAllProject(token);
    dispatch(showProjects(projectsData));
  };

  const fetchTasks = async () => {
    const tasksData = await Service.getAllTask(token);
    dispatch(showTask(tasksData));
  };
  const fetchMyTasks = async () => {
    const allMyTaskData = await Service.getAllMyTask(token);
    dispatch(showTaskRecord(allMyTaskData));
  };

  const fetchUserData = async () => {
    const usersData = await Service.allEmployee(token);
    dispatch(showStaff(usersData));
  };
  const fetchTeam = async () => {
    const teamData = await Service.getAllTeam(token);
    dispatch(showTeam(teamData));
  };
 const fetchUser = async () => {
    try {
      const User = await Service.getCurrentUser(token);
      setUserDetail(User);
      // sessionStorage.setItem("userId", User.id);
      dispatch(setUserData(User));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchUser();
    fetchMyTasks();
    fetchTasks();
    fetchProjects();
    fetchUserData();
    fetchTeam();
  }, [token,dispatch]);

  

  return (
    <Provider store={store}>
      {/* <ToastContainer /> */}
      <div className="flex flex-col w-screen h-screen overflow-hidden md:flex-row bg-gradient-to-r from-green-300/50 to-teal-300">
        {/* Sidebar */}
      <NotificationReceiver/>
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
