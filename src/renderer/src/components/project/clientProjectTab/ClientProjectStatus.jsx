/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import Service from "../../../config/Service";
import { X } from "lucide-react";
import ClientProjectDetail from "./ClientProjectDetail";
import RFI from "../../rfi/RFI";
import Submittals from "../../submittals/Submittals";
import CO from "../../changeOrder/CO";

const ClientProjectStatus = ({ projectId, onClose }) => {
  const [projectData, setProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState("projectDetail");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const id = projectId;

  const getProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Service.getProject(id);
      setProjectData(response);
    } catch (err) {
      setError("Failed to load project data");
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log("Project Data:", projectData);
  useEffect(() => {
    if (projectId) {
      getProject(projectId);
    }
  }, [projectId]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
        <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
          {" "}
          <div className="text-lg text-white">
            <span className="font-bold">Subject:</span> {projectData?.name}
          </div>
          <button
            className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Tabs */}
        <div className="my-3 border-b">
          <div className="flex overflow-x-auto">
            {[
              { key: "projectDetail", label: "Project Details" },
              // { key: "overview", label: "Overview" },
              { key: "RFI", label: "RFI" },
              { key: "Submittals", label: "Submittals" },
              { key: "CO", label: "CO#" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === key
                    ? "bg-teal-500 text-white font-semibold rounded-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {activeTab === "projectDetail" && (
          <ClientProjectDetail projectData={projectData} />
        )}
        {activeTab === "RFI" && (
          <RFI projectData={projectData} />
        )}
        {activeTab === "Submittals" && (
          <Submittals projectData={projectData} />
        )}
        {activeTab === "CO" && (
          <CO projectData={projectData} />
        )}
      </div>
    </div>
  );
};

export default ClientProjectStatus;
