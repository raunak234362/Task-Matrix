/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./index";
import LOGO from "../assets/logo.png";
import SmallLogo from "../assets/logoSm.png"
import { toast } from "react-toastify";
import {
  ChartCandlestick,
  Home,
  MessageSquare,
  RefreshCw,
  User2,
  Menu,
  ChevronLeft,
  Hourglass,
  LogOut,
  FolderOpenDot,
} from "lucide-react";
import { useSelector } from "react-redux";

const Sidebar = ({ refresh, isMinimized, toggleSidebar }) => {
  const userData = useSelector((state) => state.userData.userData);
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: <Home />,
      roles: [
        "admin",
        "department-manager",
        "project-manager",
        "client",
        "system-admin",
        "user",
        "estimator",
        "sales",
      ],
    },
    {
      label:"Projects",
      to:"projects",
      icon: <FolderOpenDot/>,
      roles: ["admin", "department-manager", "project-manager", "user", "human-resource"],
    },
    {
      label: "Tasks",
      to: "tasks",
      icon: <ChartCandlestick />,
      roles: ["admin", "department-manager", "project-manager", "user","system-admin", "human-resource"],
    },
    {
      label: "Estimations",
      to: "estimation",
      icon: <Hourglass />,
      roles: ["admin", "department-manager", "user"],
    },
    {
      label: "Chats",
      to: "chats",
      icon: <MessageSquare />,
      roles: [
        "admin",
        "department-manager",
        "project-manager",
        "user",
        "human-resource",
      ],
    },
    {
      label: "Profile",
      to: "profile",
      icon: <User2 />,
      roles: [
        "admin",
        "user",
        "client",
        "estimator",
        "sales",
        "project-manager",
        "department-manager",
        "system-admin",
        "human-resource",
      ],
    },
  ];

  const canView = (roles) => roles.includes(userType);

  const fetchLogout = async () => {
    try {
      sessionStorage.removeItem("userType");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("socketId");
      sessionStorage.removeItem("userId");
      toast.success("Logout Successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userType = sessionStorage.getItem("userType");

  return (
    <section
      className={`h-full bg-white/70 border-r-4 rounded-lg border-gray-200 text-black transition-all duration-300 flex flex-col ${
        isMinimized ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center p-2">
        {!isMinimized ? <img src={LOGO} alt="Logo" className="w-40" />:<img src={SmallLogo} alt="Logo" className="w-20" />}
      </div>
        <Button onClick={toggleSidebar} className="p-1">
          {isMinimized ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </Button>
      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 space-y-2">
          <ul className="flex flex-col gap-3">
            {navItems.map(
              ({ label, to, roles, icon }) =>
                canView(roles) && (
                  <li key={label}>
                    <NavLink
                      to={to}
                      end={to === "/dashboard"}
                      className={({ isActive }) =>
                        isActive
                          ? `flex items-center text-white bg-teal-400/50 py-1 px-2 rounded-md w-full ${
                              isMinimized ? "justify-center" : "justify-start"
                            }`
                          : `text-black hover:text-white hover:bg-teal-200 py-1 px-2 rounded-md flex items-center w-full ${
                              isMinimized ? "justify-center" : "justify-start"
                            }`
                      }
                    >
                      <div className="text-teal-500 flex-shrink-0">{icon}</div>
                      {!isMinimized && <div className="ml-3">{label}</div>}
                    </NavLink>
                  </li>
                ),
            )}
          </ul>
        </nav>
      </div>
      <div className="p-4 flex flex-col items-start">
        {!isMinimized && (
          <div >
            <div className="text-center text-base font-semibold truncate w-full">
              {userData?.f_name} {userData?.m_name} {userData?.l_name}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {userType?.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500 mb-2">Version - 1.2.1</div>
          </div>
        )}
        <div className={`flex ${isMinimized ? "flex-col" : "flex-row"} gap-2 w-full justify-center items-center px-4`}>
          <Button onClick={fetchLogout} className="p-1 bg-teal-400 text-white">
            {isMinimized ? <LogOut size={20} /> : "Logout"}
          </Button>
          <Button onClick={refresh} className="p-1  bg-teal-400 text-white">
            <RefreshCw size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Sidebar;