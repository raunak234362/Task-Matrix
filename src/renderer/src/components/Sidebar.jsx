/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./index";
import LOGO from "../assets/logo.png";
import { toast } from "react-toastify";
import {
  Building2,
  ChartCandlestick,
  Home,
  MessageSquare,
  RefreshCw,
  SquareKanban,
  User2,
} from "lucide-react";
import { useSelector } from "react-redux";

const Sidebar = ({ refresh }) => {
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
        "user",
        "estimator",
        "sales",
      ],
    },
    {
      label: "Project",
      to: "project",
      icon: <SquareKanban />,
      roles: [
        "admin",
        "department-manager",
        "project-manager",
        "client",
        "user",
        "estimator",
        "sales",
      ],
    },
    {
      label: "Tasks",
      to: "tasks",
      icon: <ChartCandlestick />,
      roles: ["admin", "department-manager","project-manager", "user", "human-resource"],
    },
    {
      label: "Estimations",
      to: "estimation",
      icon: <ChartCandlestick />,
      roles: ["admin", "department-manager","user"],
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
        "human-resource",
      ],
    },
  ];

  const canView = (roles) => roles.includes(userType);

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


  const userType = sessionStorage.getItem("userType");
  return (
    <section className=" md:h-screen h-screen w-64 bg-white/70 md:border-4 text-black md:rounded-xl rounded-lg">
      <div className="flex flex-col justify-between h-full">
        <div>
          <nav className="p-0 md:p-5 space-y-3">
            <div className="flex items-center justify-center p-2 mb-4">
              <img src={LOGO} alt="" className="w-40" />
            </div>

            <ul className="flex flex-col gap-5">
              {navItems.map(
                ({ label, to, roles, icon }) =>
                  canView(roles) && (
                    <li key={label}>
                      <NavLink
                        to={to}
                        end={to === "/dashboard"}
                        className={({ isActive }) =>
                          isActive
                            ? "flex gap-3 justify-center items-center text-white bg-teal-400/50 py-1 rounded-md w-full delay-150"
                            : "text-black gap-3 hover:text-white hover:bg-teal-200 hover:px-4 py-1 flex justify-start items-center rounded-md"
                        }
                      >
                        <div className="text-teal-500">{icon}</div>
                        <div>{label}</div>
                      </NavLink>
                    </li>
                  ),
              )}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="text-center text-base font-semibold">
            {userData?.f_name} {userData?.m_name} {userData?.l_name}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            {userType.toUpperCase()}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Version - 1.0.0
          </div>
          <div className="flex flex-row gap-2 p-6">
            <Button onClick={fetchLogout}>Logout</Button>
            <Button onClick={refresh}>
              <RefreshCw />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
