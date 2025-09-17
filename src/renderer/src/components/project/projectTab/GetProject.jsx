/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Calendar,
  Edit2,
  FileText,
  Globe,
  HardDrive,
  Plus,
  X,
  ChevronRight,
  BarChart2,
  Layers,
} from "lucide-react";
import EditProject from "./EditProject";
import Service from "../../../api/configAPI";
import AddWB from "../wb/AddWB";

// UI Components
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-teal-500 hover:bg-teal-600 text-white shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    ghost: "hover:bg-gray-100 text-gray-700",
  };
  const sizes = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    primary: "bg-teal-100 text-teal-800",
  };
  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ title, icon, action }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 p-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-teal-500">{icon}</span>}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-6 px-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Main Component
const GetProject = ({ projectId, projectData, getProject, onClose }) => {
  const [activeTab, setActiveTab] = useState("details");

  const [selectedEditProject, setSelectedEditProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

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

  const tabs = [
    { id: "details", label: "Details & Fabricator" },
    { id: "files", label: "Files" },
  ];

  const getStatusVariant = (status) => {
    const statusMap = {
      Completed: "success",
      "In Progress": "info",
      "On Hold": "warning",
      Delayed: "danger",
      "Not Started": "default",
    };
    return statusMap[status] || "default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const renderDetailsAndFabricator = () => (
    <div className="space-y-6">
      {/* Project Details Card */}
      <Card>
        <CardHeader
          title="Project Details"
          icon={<Calendar size={18} />}
          action={
            <Button
              variant="outline"
              className="bg-teal-500 text-white font-semibold"
              size="sm"
              onClick={handleEditClick}
            >
              <Edit2 size={16} />
              Edit
            </Button>
          }
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Description
                </h4>
                <div
                  className="text-gray-700 w-full text-sm md:text-base whitespace-normal text-right sm:text-left"
                  dangerouslySetInnerHTML={{
                    __html: projectData?.description || "N/A",
                  }}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Status
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(projectData?.status)}>
                    {projectData?.status || "Not available"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStatusView(projectId)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Department
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.department?.name || "Not available"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Team</h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.team?.name || "Not available"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Project Manager
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.manager?.f_name ||
                  projectData?.manager?.m_name ||
                  projectData?.manager?.l_name
                    ? `${projectData?.manager?.f_name || ""} ${
                        projectData?.manager?.m_name || ""
                      } ${projectData?.manager?.l_name || ""}`.trim()
                    : "Not available"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Estimated Hours
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.estimatedHours || "Not available"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Stage
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.stage || "Not available"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Tools
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.tools || "Not available"}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Start Date
                  </h4>
                  <p className="text-gray-800 font-semibold">
                    {formatDate(projectData?.startDate)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Approval Date
                  </h4>
                  <p className="text-gray-800 font-semibold">
                    {formatDate(projectData?.approvalDate)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Submission Date
                  </h4>
                  <p className="text-gray-800 font-semibold">
                    {formatDate(projectData?.endDate)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Main Design
                  </h4>
                  <Badge
                    variant={
                      projectData?.connectionDesign ? "success" : "default"
                    }
                  >
                    {projectData?.connectionDesign
                      ? "Required"
                      : "Not required"}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Misc Design
                  </h4>
                  <Badge
                    variant={projectData?.miscDesign ? "success" : "default"}
                  >
                    {projectData?.miscDesign ? "Required" : "Not required"}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Connection Design
                  </h4>
                  <Badge
                    variant={
                      projectData?.customerDesign ? "success" : "default"
                    }
                  >
                    {projectData?.customerDesign ? "Required" : "Not required"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fabricator Details Card */}
      <Card>
        <CardHeader title="Fabricator Details" icon={<Layers size={18} />} />
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Fabricator Name
              </h4>
              <p className="text-gray-800 font-medium">
                {projectData?.fabricator?.fabName || "Not available"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Website
                </h4>
                {projectData?.fabricator?.website ? (
                  <a
                    href={projectData?.fabricator?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
                  >
                    <Globe size={16} />
                    <span>Visit Website</span>
                  </a>
                ) : (
                  <p className="text-gray-500">Not available</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Drive
                </h4>
                {projectData?.fabricator?.drive ? (
                  <a
                    href={projectData?.fabricator.drive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
                  >
                    <HardDrive size={16} />
                    <span>Access Drive</span>
                  </a>
                ) : (
                  <p className="text-gray-500">Not available</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Files</h4>
              {Array.isArray(projectData?.fabricator?.files) &&
              projectData?.fabricator?.files.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {projectData?.fabricator?.files?.map((file, index) => (
                    <a
                      key={index}
                      href={`${
                        import.meta.env.VITE_BASE_URL
                      }/fabricator/fabricator/viewfile/${
                        projectData?.fabricatorID
                      }/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <FileText size={16} className="text-teal-500" />
                      <span className="text-gray-700 text-sm">
                        {file.originalName || `File ${index + 1}`}
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 ml-auto"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No files available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFiles = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">Project Files</h4>
        <Button size="sm" variant="outline">
          <Plus size={14} />
          Add Files
        </Button>
      </div>
      {Array.isArray(projectData?.files) && projectData?.files.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {projectData?.files?.map((file, index) => (
            <a
              key={index}
              href={`${
                import.meta.env.VITE_BASE_URL
              }/api/project/projects/viewfile/${projectId}/${file.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <FileText size={18} className="text-teal-500" />
              <div>
                <p className="text-gray-800 text-sm font-medium">
                  {file.originalName || `File ${index + 1}`}
                </p>
                <p className="text-xs text-gray-500">
                  Added on {new Date().toLocaleDateString()}
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-400 ml-auto" />
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">No files available for this project</p>
          <Button size="sm" variant="ghost" className="mt-2">
            <Plus size={14} />
            Upload Files
          </Button>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return renderDetailsAndFabricator();
      case "files":
        return renderFiles();
      default:
        return renderDetailsAndFabricator();
    }
  };

  return (
    <>
      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>

      {selectedEditProject && (
        <EditProject
          project={selectedEditProject}
          onUpdate={getProject}
          onClose={handleModalClose}
        />
      )}
      {/* Note: ProjectStatus modal not implemented here as it requires additional context */}
    </>
  );
};

export default GetProject;
