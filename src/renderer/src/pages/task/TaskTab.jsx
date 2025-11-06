/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { LayoutList, ListChecks, MonitorPause } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AddTask, AllTask, MyTask } from "../../components";
import Service from "../../api/configAPI";

const STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETE: "COMPLETE",
  VALIDATE_COMPLETE: "VALIDATE_COMPLETE",
  COMPLETE_OTHER: "COMPLETE_OTHER",
  IN_REVIEW: "IN_REVIEW",
  ASSIGNED: "ASSIGNED",
  BREAK: "BREAK",
};

const TaskTab = () => {
  const userType = sessionStorage.getItem("userType");
  const [hourTaken, setHourTaken] = useState();
  const [activeTab, setActiveTab] = useState(
    userType === "user" ? "myTask" : "allTasks",
  );
  const tasks = useSelector((state) => state?.taskData?.taskData ?? []);

  // Helper to count tasks by status
  const countByStatus = (status) =>
    tasks?.filter((task) => task?.status === status)?.length;

  const activeTaskCount = countByStatus(STATUS?.IN_PROGRESS);
  const completedTaskCount =
    countByStatus(STATUS?.COMPLETE) +
    countByStatus(STATUS?.COMPLETE_OTHER) +
    countByStatus(STATUS?.USER_FAULT) +
    countByStatus(STATUS?.VALIDATE_COMPLETE);
  const inReviewTaskCount = countByStatus(STATUS?.IN_REVIEW);
  const assignedTaskCount = countByStatus(STATUS?.ASSIGNED);
  const breakTaskCount = countByStatus(STATUS?.BREAK);

  const canAddTask = [
    "project-manager",
    "admin",
    "department-manager",
  ].includes(userType);

  // Renders the correct content panel
  function renderCurrentTab() {
    switch (activeTab) {
      case "myTask":
        return <MyTask />;
      case "allTasks":
        return <AllTask />;
      case "addTask":
        return <AddTask />;
      default:
        return null;
    }
  }

  const fetchHours = async () => {
    const response = await Service.getAssignedHours();
    setHourTaken(response);
    console.log("Fetched Hours:", response);
  };
  console.log("Hour Taken", hourTaken);

  useEffect(() => {
    fetchHours();
    const onHoursUpdated = () => {
      fetchHours();
    };
    window.addEventListener("hours-updated", onHoursUpdated);
    return () => window.removeEventListener("hours-updated", onHoursUpdated);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col w-full h-screen overflow-y-auto">
        {/* Summary Cards */}
        <div className="mx-1 space-y-3">
          <div className="grid grid-cols-2 gap-5 my-1 md:grid-cols-4">
            <div
              className={`p-6 rounded-2xl shadow-xl text-white grid items-center justify-between transition-all hover:scale-[1.02] duration-300
    ${
      hourTaken?.totalWorkingHours / 60 >= 8
        ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-50 border-r-4 border-green-500"
        : hourTaken?.totalWorkingHours / 60 >= 6
          ? "bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-50 border-r-4 border-cyan-500"
          : hourTaken?.totalWorkingHours / 60 >= 4
            ? "bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-50 border-r-4 border-yellow-400"
            : "bg-gradient-to-r from-red-500 via-red-200 to-pink-50 border-r-4 border-red-500"
    }`}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <p className="text-sm opacity-90">Total Hours Utilized</p>
                  <h2 className="text-xl font-bold tracking-wide">
                    {(() => {
                      const totalMinutes = hourTaken?.totalWorkingHours || 0;
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return `${hours.toString().padStart(2, "0")} hrs ${minutes
                        .toString()
                        .padStart(2, "0")} mins`;
                    })()}
                  </h2>
                </div>
              </div>

              {/* Dynamic message */}
              <div
                className={`w-full lg:text-sm text-xs px-4 py-2 rounded-full backdrop-blur-sm font-medium ${
                  hourTaken?.totalWorkingHours >= 8
                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                    : hourTaken?.totalWorkingHours >= 6
                      ? "bg-gradient-to-r from-cyan-100 to-blue-100 text-blue-800"
                      : hourTaken?.totalWorkingHours >= 4
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800"
                        : "bg-gradient-to-r from-white  to-pink-100/40 text-red-800"
                }`}
              >
                {hourTaken?.totalWorkingHours >= 8
                  ? "🔥 You performed well and maintained your 8hrs work!"
                  : hourTaken?.totalWorkingHours >= 6
                    ? "💪 Keep going — you're close to your daily milestone!"
                    : hourTaken?.totalWorkingHours >= 4
                      ? "⚡ Good effort! Try to reach your target today."
                      : "⏳ Let’s boost your focus and hit that 8-hour goal!"}
              </div>
            </div>

            <SummaryCard
              title="Total Task"
              mainCount={tasks.length}
              subTitle="Completed task"
              subCount={completedTaskCount}
              borderColor="border-green-500"
              icon={<ListChecks className="h-6 w-6 text-green-500" />}
              iconBg="bg-green-100"
            />
            <SummaryCard
              title="Assigned Tasks"
              mainCount={assignedTaskCount}
              subTitle="In Progress tasks"
              subCount={activeTaskCount}
              borderColor="border-amber-500"
              icon={<LayoutList className="h-6 w-6 text-amber-500" />}
              iconBg="bg-amber-100"
            />
            <SummaryCard
              title="In-Review Tasks"
              mainCount={inReviewTaskCount}
              subTitle="In Break tasks"
              subCount={breakTaskCount}
              borderColor="border-orange-500"
              icon={<MonitorPause className="h-6 w-6 text-orange-500" />}
              iconBg="bg-orange-100"
            />
          </div>

          <div className="">
            {/* Navigation Tabs */}
            <div className="px-3 pt-2 flex flex-col justify-between items-start bg-white border-b rounded-md">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("myTask")}
                  className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b
                    ${
                      activeTab === "myTask"
                        ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                        : "md:text-base text-sm bg-white"
                    }`}
                >
                  My Task
                </button>
                <button
                  onClick={() => setActiveTab("allTasks")}
                  className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b
                    ${
                      activeTab === "allTasks"
                        ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                        : "md:text-base text-sm bg-white"
                    }`}
                >
                  All Tasks
                </button>
                {canAddTask && (
                  <button
                    onClick={() => setActiveTab("addTask")}
                    className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b
                      ${
                        activeTab === "addTask"
                          ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                          : "md:text-base text-sm bg-white"
                      }`}
                  >
                    Add Tasks
                  </button>
                )}
              </div>
              <div className="flex-grow w-full overflow-y-auto border-l-4 border-t-2 border-teal-300 rounded-md bg-white">
                {renderCurrentTab()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted for reusability
const SummaryCard = ({
  title,
  mainCount,
  subTitle,
  subCount,
  borderColor,
  icon,
  iconBg,
}) => (
  <div
    className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${borderColor}`}
  >
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold text-gray-800">{mainCount ?? 0}</h2>
          <div className="items-center mt-1 gap-5">
            <span
              className={`text-sm ${borderColor.replace("border-", "text-")}`}
            >
              {subTitle}
            </span>
            <div
              className={`text-xl font-bold ${borderColor.replace("border-", "text-")}`}
            >
              {subCount ?? 0}
            </div>
          </div>
        </div>
        <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
      </div>
    </div>
  </div>
);

export default TaskTab;
