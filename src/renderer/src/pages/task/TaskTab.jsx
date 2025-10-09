/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { LayoutList, ListChecks, MonitorPause } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AddTask, AllTask, MyTask } from "../../components";

const STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETE: "COMPLETE",
  IN_REVIEW: "IN_REVIEW",
  ASSIGNED: "ASSIGNED",
  BREAK: "BREAK",
};

const TaskTab = () => {
  const userType = sessionStorage.getItem("userType");
  const [activeTab, setActiveTab] = useState(
    userType === "user" ? "myTask" : "allTasks",
  );
  const tasks = useSelector((state) => state?.taskData?.taskData ?? []);

  // Helper to count tasks by status
  const countByStatus = (status) =>
    tasks?.filter((task) => task?.status === status)?.length;

  const activeTaskCount = countByStatus(STATUS?.IN_PROGRESS);
  const completedTaskCount = countByStatus(STATUS?.COMPLETE);
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

  return (
    <div className="w-full">
      <div className="flex flex-col w-full h-screen overflow-y-auto">
        {/* Summary Cards */}
        <div className="mx-1 space-y-3">
          <div className="grid grid-cols-2 gap-5 my-1 md:grid-cols-3">
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
