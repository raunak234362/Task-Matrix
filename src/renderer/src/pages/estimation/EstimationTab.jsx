import { useState } from "react";
import {  ProjectStats } from "../../components";
import Estimation from "../../components/estimation/EstimationTask/Estimation";

const EstimationTab = () => {
  const [activeTab, setActiveTab] = useState("allEstimation");
  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start bg-gradient-to-t from-teal-100 to-teal-400 border-b rounded-md ">
          <h1 className="text-2xl py-2 font-bold text-white">
            Estimation Detail
          </h1>
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("allEstimation")}
              className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "allEstimation" ? "text-base md:text-base bg-teal-500 text-white font-semibold" : "md:text-base text-sm bg-white"}`}
            >
              All Estimation
            </button>
            <button
              onClick={() => setActiveTab("EstimationTasks")}
              className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "EstimationTasks" ? "text-base md:text-base bg-teal-500 text-white font-semibold" : "md:text-base text-sm bg-white"}`}
            >
              Estimation Tasks
            </button>
          </div>
        </div>
        <div className="flex-grow p-2 h-[85vh] overflow-y-auto">
          {activeTab === "allEstimation" && (
            <div>
              <Estimation />
            </div>
          )}

          {activeTab === "EstimationTasks" && (
            <div>
              <ProjectStats />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstimationTab;
