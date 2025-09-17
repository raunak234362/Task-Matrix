/* eslint-disable react/prop-types */

import { useState } from "react";
import AllSubmittals from "./AllSubmittals";

const Submittals = ({ projectData }) => {
  const [activeTab, setActiveTab] = useState("allSubmittals");
  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start border-b rounded-md ">
          <div className="flex space-x-4 overflow-x-auto">
           
            <button
              onClick={() => setActiveTab("allSubmittals")}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "allSubmittals"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              View Submittals
            </button>
          </div>
        </div>
        <div className="flex-grow p-2 h-[85vh] overflow-y-auto">
          {activeTab === "allSubmittals" && (
            <div>
              <AllSubmittals projectData={projectData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submittals;
