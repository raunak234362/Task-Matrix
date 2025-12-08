/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Provider, useDispatch } from "react-redux";
import store from "./store/store";
import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "./components/index"; // Removed Header if not used
import { Outlet } from "react-router-dom";
import Service from "./api/configAPI";
import { setUserData, showStaff } from "./store/userSlice";
import { showProjects, showTeam } from "./store/projectSlice";
import { showTask, showTaskRecord } from "./store/taskSlice";
import socket, { connectSocket } from "./socket";
import NotificationReceiver from "./util/NotificationReceiver";
import { toast } from "react-toastify";
import { showClient } from "./store/fabricatorSlice";

const App = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [userDetail, setUserDetail] = useState();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const userType = sessionStorage.getItem("userType");

  const toggleSidebar = useCallback(() => {
    setIsSidebarMinimized((prev) => !prev);
  }, []);

  const fetchProjects = async () => {
    const projectsData = await Service.getAllProject(token);
    dispatch(showProjects(projectsData));
  };

  const fetchTasks = async () => {
    const tasks = await Service.getAllTask(token);
    setTasks(tasks);
    const departmentTasks =
      tasks?.flatMap((task) =>
        task?.tasks?.map((subTask) => ({
          ...subTask,
          project: task?.name,
          manager: task?.manager, // Attach manager from parent task
        })),
      ) || [];
    dispatch(
      showTask(userType === "department-manager" ? departmentTasks : tasks),
    );
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

  const fetchFabricators = async () => {
    const fabricatorData = await Service.getAllFabricators(token);
    console.log("Fabricators:", fabricatorData);
    
    // dispatch(showFabricator(fabricatorData));
  }

  const fetchClients = async () => {
    const clientData = await Service.allClient(token);    
    dispatch(showClient(clientData));
  }

  const fetchUser = async () => {
    try {
      const user = await Service.getCurrentUser(token);
      setUserDetail(user);
      sessionStorage.setItem("userId", user.id);
      connectSocket(user.id);

      if (socket) {
        sessionStorage.setItem("socketId", socket.id);
        socket.on("connect", () => {
          // console.log("✅ Connected with socket:", socket.id);
          // console.log("✅ Connected with userID:", user.id);
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
    fetchClients()
    fetchFabricators()
    fetchMyTasks();
    fetchProjects();
    fetchUserData();
    fetchTeam();
  }, [token, dispatch]);

  useEffect(() => {
    fetchTasks();
  }, [token]);

  useEffect(() => {
    console.log("App mounted. Checking window.electron:", window.electron);
    const { update } = window.electron || {};
    console.log("Update object:", update);

    if (update?.onUpdateAvailable) {
      update.onUpdateAvailable(() => setUpdateAvailable(true));
    }

    if (update?.onUpdateDownloaded) {
      update.onUpdateDownloaded(() => {
        setUpdateAvailable(false);
        setUpdateDownloaded(true);
        toast.info(
          ({ closeToast }) => (
            <div className="flex flex-col gap-2">
              <span>Update Downloaded. Restart to install?</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  closeToast();
                  handleInstallUpdate();
                }}
              >
                Restart
              </button>
            </div>
          ),
          {
            autoClose: false,
            position: "bottom-right",
          },
        );
      });
    }

    return () => {
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
      <div className="flex h-screen w-screen p-2 gap-2 overflow-hidden bg-gradient-to-br from-gray-700 to-teal-200">
        <NotificationReceiver />
        <div
          className={`h-full transition-all duration-300 ${isSidebarMinimized ? "w-16" : "w-64"
            }`}
        >
          <Sidebar
            refresh={reloadWindow}
            isMinimized={isSidebarMinimized}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div
          className={`flex-1 h-full overflow-hidden transition-all duration-300 bg-gradient-to-t from-gray-50/70 to-gray-100/70 rounded-lg border-4 border-white`}
        >
          <Outlet />
        </div>
      </div>
    </Provider>
  );
};

export default App;
