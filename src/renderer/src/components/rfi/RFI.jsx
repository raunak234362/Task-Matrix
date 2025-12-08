/* eslint-disable react/prop-types */

import { useState } from "react";
import AddRFI from "./AddRFI";
import AllRFI from "./AllRFI";
const RFI = ({ projectData }) => {
  const [activeTab, setActiveTab] = useState("allRFI");
  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start border-b rounded-md ">
          <div className="flex space-x-4 overflow-x-auto">
            {userType === "client" || userType === "staff" ? null : (
              <button
                onClick={() => setActiveTab("addRFI")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "addRFI"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Create RFI
              </button>
            )}
            <button
              onClick={() => setActiveTab("allRFI")}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "allRFI"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              View RFI
            </button>
          </div>
        </div>
        <div className="flex-grow p-2 h-[85vh] overflow-y-auto">
          {activeTab === "addRFI" && (
            <div>
              <AddRFI projectData={projectData} />
            </div>
          )}
          {activeTab === "allRFI" && (
            <div>
              <AllRFI projectData={projectData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFI;
