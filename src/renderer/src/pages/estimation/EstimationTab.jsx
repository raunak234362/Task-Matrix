/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Estimation from "../../components/estimation/EstimationTask/Estimation";
import Service from "../../api/configAPI";

const EstimationTab = () => {
  const [estimationTasks, setEstimationTasks] = useState([]);
  const [error, setError] = useState(null); // Add error state for user feedback
  const [activeTab, setActiveTab] = useState("allEstimation");

  const STATUS = {
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETE: "COMPLETE",
    UNDER_REVIEW: "UNDER_REVIEW",
    ASSIGNED: "ASSIGNED",
    BREAK: "BREAK",
  };

  const fetchEstimationTask = async () => {
    try {
      const response = await Service.allEstimationTasks();
      setEstimationTasks(response);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch tasks. Please try again later.");
    }
  };

  useEffect(() => {
    fetchEstimationTask();
  }, []);

  const countByStatus = (status) =>
    estimationTasks.filter((task) => task.status === status).length;

  const activeTaskCount = countByStatus(STATUS.IN_PROGRESS);
  const completedTaskCount = countByStatus(STATUS.COMPLETE);
  const inReviewTaskCount = countByStatus(STATUS.IN_REVIEW);
  const assignedTaskCount = countByStatus(STATUS.ASSIGNED);
  const breakTaskCount = countByStatus(STATUS.BREAK);

  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full space-y-2">
        <div className="px-3 flex flex-col justify-between items-start bg-gradient-to-t from-teal-100 to-teal-400 border-b rounded-md ">
          <h1 className="text-2xl py-2 font-bold text-white">
            Estimation Detail
          </h1>
        </div>
        <div
          className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 mx-2`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Estimation Tasks</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {estimationTasks.length}
              </h2>
              <div className="items-center mt-1 gap-5">
                <span className={`text-sm `}>{}</span>
                <div className={`text-xl font-bold `}>{}</div>
              </div>
            </div>
            <div className={`p-3 rounded-full `}>{}</div>
          </div>
        </div>
        <div className="flex-grow p-2 h-[85vh] overflow-y-auto">
          <div className="px-3 pt-2 flex flex-col justify-between items-start bg-white border-b rounded-md">
            <button
              onClick={() => setActiveTab("allEstimation")}
              className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "allEstimation" ? "text-base md:text-base bg-teal-500 text-white font-semibold" : "md:text-base text-sm bg-white"}`}
            >
              All Estimation
            </button>
          </div>
          {activeTab === "allEstimation" && (
            <div className="flex-grow border-l-4 border-t-2 border-teal-300 rounded-md bg-white">
              <Estimation
                estimationTasks={estimationTasks}
                error={error}
                fetchEstimationTask={fetchEstimationTask}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstimationTab;
