/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";

const UserTab = () => {
  const users = useSelector((state) => state?.userData?.staffData);
  const userType = sessionStorage.getItem("userType");
  const navigate = useNavigate();
  const [showGanttChart, setShowGanttChart] = useState(false);

  useEffect(() => {
    if (userType === "manager" || userType === "admin") {
      setShowGanttChart(true);
      navigate("gaant-chart", { replace: true });
    }
  }, [userType, navigate]);

  return (
    <div className="w-full h-[89vh] overflow-hidden mx-5">
      {/* Header */}
      <div className="flex items-center justify-center w-full">
        <h2 className="px-5 py-2 mt-2 text-2xl font-semibold text-white bg-green-500 rounded-lg shadow-lg">
          User
        </h2>
      </div>

      {/* Content */}
      <div className="h-[85vh] mt-2 overflow-y-auto">
        <div className="text-sm bg-white rounded-lg shadow-md md:text-lg">
          {/* Render Gantt Chart directly if userType is "manager" or "admin" */}
          <div className="p-5">{showGanttChart && <Outlet />}</div>
        </div>
      </div>
    </div>
  );
};

export default UserTab;
