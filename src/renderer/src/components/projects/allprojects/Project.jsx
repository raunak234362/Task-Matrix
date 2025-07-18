/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Button } from "../../index";
import ProjectStatus from "./ProjectStatus";

const Project = ({ projectId, onClose }) => {
  const [project, setProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedEditProject, setSelectedEditProject] = useState(null);
  const [selectedProjectWB, setSelectedProjectWB] = useState(null);
  const [addWorkBreakdown, setAddWorkBreakdown] = useState(false);
  const [allWorkBreakdown, setAllWorkBreakdown] = useState(false);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [editWorkBreakdown, setEditWorkBreakdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projectData = useSelector((state) =>
    state?.projectData.projectData.find((project) => project.id === projectId),
  );
  console.log("Project Data", projectData);

  // const fetchFiles = async (data) => {
  //   console.log("Fetching files", data);
  //   try {
  //     const files = await Service.allProjectFile(projectId,data);

  //     console.log("Files", files);
  //   } catch (error) {
  //     console.log("Error fetching files:", error);
  //   }
  // };

  // const fetchFileAndOpen = async (fileId) => {
  //   try {
  //     const response = await Service.allProjectFile(projectId, fileId, { responseType: 'blob' }); // API call to fetch the file as blob
  //     console.log("File response", response);
  //     // const fileUrl = URL.createObjectURL(response.data); // Create object URL from blob
  //     // console.log("File URL", fileUrl);
  //     window.open(response, "_blank"); // Open file in a new tab
  //   } catch (error) {
  //     console.error("Error opening file:", error);
  //   }
  // };

  const handleClose = async () => {
    onClose(true);
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
    setSelectedEditProject(projectData);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEditProject(null);
  };

  const handleStatusView = (projectID) => {
    setSelectedProjectStatus(projectID);
    setIsStatusModalOpen(true);
  };

  const handleStatusClose = () => {
    setSelectedProjectStatus(null);
    setIsStatusModalOpen(false);
  };

  const projectDetails = {
    projectData: projectData, // Ensure correct property assignment
    // Add other properties as needed
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-85">
      <div className="bg-white h-[80vh] p-5 md:p-5 rounded-lg shadow-lg md:w-3/4 ">
        <div className="flex flex-row justify-between">
          <Button className="bg-red-500" onClick={handleClose}>
            Close
          </Button>
        </div>
        <div className="h-[70vh] overflow-y-auto">
          <div className="z-10 flex justify-center w-full overflow-y-auto top-2">
            <div className="mt-2">
              <div className="px-3 py-2 font-bold text-white bg-teal-400 rounded-lg shadow-md md:px-4 md:text-2xl">
                Project: {projectData?.name || "Unknown"}
              </div>
            </div>
          </div>

          <div className="overflow-y-auto rounded-lg shadow-lg h-fit">
            <div className="p-5 rounded-lg shadow-md bg-gray-100/50">
              <h2 className="mb-4 text-lg font-semibold">Project Details</h2>

              <div className="grid grid-cols-1 gap-6 overflow-x-hidden overflow-y-hidden md:grid-cols-2">
                {[
                  { label: "Description", value: projectData?.description },
                  {
                    label: "Fabricator",
                    value: projectData?.fabricator?.fabName,
                  },
                  { label: "Status", value: projectData?.status },
                  {
                    label: "Estimated Hours",
                    value: projectData?.estimatedHours,
                  },
                  {
                    label: "Assigned Hours",
                    value: projectData?.estimatedHours * 0.7,
                  },
                  {
                    label: "Fabrication Hours",
                    value: projectData?.estimatedHours * 0.3,
                  },
                  { label: "Stage", value: projectData?.stage },
                  { label: "Tool", value: projectData?.tools },
                  { label: "Start Date", value: projectData?.startDate },
                  { label: "Department", value: projectData?.department?.name },
                  { label: "End Date", value: projectData?.approvalDate },
                  {
                    label: "Project Manager",
                    value: `${projectData?.manager?.f_name || ""} ${projectData?.manager?.m_name || ""} ${projectData?.manager?.l_name || ""}`,
                  },
                  {
                    label: "Files",
                    value: Array.isArray(projectData?.files)
                      ? projectData?.files?.map((file, index) => (
                          <a
                            key={index}
                            href={`${import.meta.env.VITE_BASE_URL}/project/projects/viewfile/${projectId}/${file.id}`} // Use the file path with baseURL
                            target="_blank" // Open in a new tab
                            rel="noopener noreferrer"
                            className="px-5 py-2 text-teal-500 hover:underline"
                          >
                            {file.originalName || `File ${index + 1}`}
                          </a>
                        ))
                      : "Not available",
                  },
                ]?.map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="font-medium text-gray-700">{label}:</span>
                    <span className="text-gray-600">
                      {value || "Not available"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-row items-center mt-3 space-x-5">
                <div>
                  <p className="font-bold text-gray-700">Project Status: </p>
                </div>
                <div>
                  <Button onClick={() => handleStatusView(projectId)}>
                    View
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-lg shadow-md bg-gray-100/50">
              <h2 className="mb-4 text-lg font-semibold">Fabricator Details</h2>

              <div className="grid grid-cols-1 gap-6 overflow-x-hidden overflow-y-hidden md:grid-cols-2">
                {[
                  {
                    label: "Fabricator",
                    value: projectData?.fabricator?.fabName,
                  },
                  {
                    label: "Website",
                    value: projectData?.fabricator?.website ? (
                      <a
                        href={projectData?.fabricator?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-wrap hover:underline"
                      >
                        {projectData?.fabricator?.website}
                      </a>
                    ) : (
                      "Not available"
                    ),
                  },
                  {
                    label: "Drive",
                    value: projectData?.fabricator?.drive ? (
                      <a
                        href={projectData?.fabricator.drive}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {projectData?.fabricator.drive}
                      </a>
                    ) : (
                      "Not available"
                    ),
                  },

                  // {
                  //   label: "Files",
                  //   value: Array.isArray(projectData?.files)
                  //     ? projectData?.files.map((file, index) => (
                  //         <Button
                  //           key={index}
                  //           onClick={() => fetchFileAndOpen(file.id)} // Open file in a new tab
                  //         >
                  //           {file.originalName || `File ${index + 1}`}
                  //         </Button>
                  //       ))
                  //     : "Not available",
                  // },
                  {
                    label: "Files",
                    value: Array.isArray(projectData?.fabricator?.files)
                      ? projectData?.fabricator?.files?.map((file, index) => (
                          <a
                            key={index}
                            href={`${import.meta.env.VITE_BASE_URL}/fabricator/fabricator/viewfile/${projectData?.fabricatorID}/${file.id}`} // Use the file path with baseURL
                            target="_blank" // Open in a new tab
                            rel="noopener noreferrer"
                            className="px-5 py-2 text-teal-500 hover:underline"
                          >
                            {file.originalName || `File ${index + 1}`}
                          </a>
                        ))
                      : "Not available",
                  },
                ]?.map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="font-medium text-gray-700">{label}:</span>
                    <span className="text-gray-600">
                      {value || "Not available"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedProjectStatus && (
        <ProjectStatus
          projectId={selectedProjectStatus}
          onClose={handleStatusClose}
        />
      )}
    </div>
  );
};

export default Project;
