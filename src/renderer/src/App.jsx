/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Provider, useDispatch } from "react-redux";
import store from "./store/store";
import { useCallback, useEffect, useState } from "react";
import { Header, Sidebar } from "./components/index";
import { Outlet } from "react-router-dom";
import Service from "./api/configAPI";
import { setUserData, showStaff } from "./store/userSlice";
import { showProjects, showTeam } from "./store/projectSlice";
import { showTask, showTaskRecord } from "./store/taskSlice";
import socket, { connectSocket } from "./socket";
import NotificationReceiver from "./util/NotificationReceiver";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [userDetail, setUserDetail] = useState();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const userType = sessionStorage.getItem("userType");

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const fetchProjects = async () => {
    const projectsData = await Service.getAllProject(token);
    dispatch(showProjects(projectsData));
  };

  const fetchTasks = async () => {
    const tasks = await Service.getAllTask(token);
    setTasks(tasks);
    const departmentTasks = tasks?.flatMap((task) => task?.tasks) || [];
    dispatch(showTask(userType === "department-manager" ? departmentTasks : tasks));
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
      const user = await Service.getCurrentUser(token);
      setUserDetail(user);
      sessionStorage.setItem("userId", user.id);
      connectSocket(user.id);

      if (socket) {
        sessionStorage.setItem("socketId", socket.id);
        socket.on("connect", () => {
          console.log("✅ Connected with socket:", socket.id);
          console.log("✅ Connected with userID:", user.id);
        });
      }

      dispatch(setUserData(user));
    } catch (error) {
      console.error("❌ Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchUser();
    fetchMyTasks();
    fetchProjects();
    fetchUserData();
    fetchTeam();
  }, [token, dispatch]);

  useEffect(() => {
    fetchTasks();
  }, [token]);

  useEffect(() => {
    const { update } = window.electron || {};

    if (update?.onUpdateAvailable) {
      update.onUpdateAvailable(() => setUpdateAvailable(true));
    }

    if (update?.onUpdateDownloaded) {
      update.onUpdateDownloaded(() => {
        setUpdateAvailable(false);
        setUpdateDownloaded(true);
      });
    }

    return () => {
      // Optional cleanup (if you ever unsubscribe from events)
    };
  }, []);

  const handleInstallUpdate = () => {
    window.electron?.update?.installUpdate?.();
  };

  useEffect(() => {
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    const root = document.getElementById("root");
    if (root) root.style.height = "100%";
  }, []);

  const reloadWindow = () => {
    window.location.reload();
  };

  return (
    <Provider store={store}>
      <div className="flex flex-col w-screen h-screen overflow-hidden md:flex-row bg-gradient-to-br from-gray-700 to-teal-200">
        <NotificationReceiver />
        <div className="flex flex-col w-full">
          <div className="mx-5 my-2 shadow-2xl drop-shadow-lg">
            <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          </div>
          <div className="flex flex-row">
            <div
              className={`fixed md:static flex flex-col md:bg-opacity-0 bg-white w-64 z-20 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } md:translate-x-0 md:w-64`}
            >
              <div className="flex items-center justify-between pl-2">
                <Sidebar refresh={reloadWindow} />
              </div>
            </div>
            <div
              className={`flex w-full mx-2 border-4 rounded-lg border-white bg-gradient-to-t from-gray-50/70 to-gray-100/50 overflow-hidden flex-grow transition-all duration-300 ${
                sidebarOpen ? "md:ml-64 bg-black/80" : ""
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
