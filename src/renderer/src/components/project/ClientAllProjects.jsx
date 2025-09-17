/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  ArrowUpDown,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  LayoutGrid,
  List,
  Loader2,
  MapPin,
  PauseCircle,
  Search,
  Users,
} from "lucide-react";
import Service from "../../api/configAPI";
import { showProjects } from "../../store/projectSlice";

import { useTable, useSortBy } from "react-table";
import ClientProjectStatus from "./clientProjectTab/ClientProjectStatus";

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ClientAllProjects = () => {
  const projects =
    useSelector((state) => state?.projectData?.projectData) || [];
  const taskData = useSelector((state) => state?.taskData?.taskData) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : "";
  const dispatch = useDispatch();

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await Service.allprojects(token);
      dispatch(showProjects(response?.data));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  // Status configuration
  const statusConfig = {
    ACTIVE: {
      color: "bg-blue-100 text-blue-800",
      icon: <Loader2 className="w-4 h-4 mr-1" />,
      label: "Active",
    },
    COMPLETE: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle2 className="w-4 h-4 mr-1" />,
      label: "Complete",
    },
    ASSIGNED: {
      color: "bg-purple-100 text-purple-800",
      icon: <Users className="w-4 h-4 mr-1" />,
      label: "Assigned",
    },
    IN_REVIEW: {
      color: "bg-orange-100 text-orange-800",
      icon: <AlertCircle className="w-4 h-4 mr-1" />,
      label: "In Review",
    },
    ONHOLD: {
      color: "bg-red-100 text-red-800",
      icon: <PauseCircle className="w-4 h-4 mr-1" />,
      label: "On Hold",
    },
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.ACTIVE;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Calculate project progress consistently
  const calculateProjectProgress = (project) => {
    if (project?.tasks && Array.isArray(project.tasks)) {
      const completedTasks = project.tasks.filter(
        (task) => task?.status === "COMPLETE"
      ).length;
      const totalTasks = project.tasks.length;
      return {
        completedTasks,
        totalTasks,
        percentage:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      };
    }

    // Fallback to taskData from Redux store
    const projectTasks = taskData.filter(
      (task) => task.project_id === project.id
    );
    const completedTasks = projectTasks.filter(
      (task) => task.status === "COMPLETE"
    ).length;
    const totalTasks = projectTasks.length;

    return {
      completedTasks,
      totalTasks,
      percentage:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  };

  // Enhanced projects with calculated progress
  const enhancedProjects = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      progress: calculateProjectProgress(project),
    }));
  }, [projects, taskData]);

  // Filtering and sorting logic (used for react-table and grid)
  const filteredAndSortedProjects = useMemo(() => {
    // Filter projects
    const filtered = enhancedProjects.filter((project) => {
      const matchesSearch =
        project?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        project?.description?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project?.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort projects manually for grid (react-table handles sorting in list)
    // Here you might want to do a default sort on "name"
    const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [enhancedProjects, searchTerm, statusFilter]);

  // Progress bar component
  const ProgressBar = ({ percentage, showLabel = true }) => {
    const getProgressColor = (percent) => {
      if (percent >= 80) return "bg-green-500";
      if (percent >= 60) return "bg-blue-500";
      if (percent >= 40) return "bg-yellow-500";
      return "bg-red-500";
    };

    return (
      <div className="flex items-center">
        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
              percentage
            )}`}
            style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
          />
        </div>
        {showLabel && (
          <span className="text-sm text-gray-500 min-w-[40px]">
            {percentage}%
          </span>
        )}
      </div>
    );
  };

  // ----- REACT-TABLE -----
  const columns = useMemo(
    () => [
      {
        Header: "Project Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {row.original.name}
            </div>
            <div className="text-sm text-gray-500">{row.original.location}</div>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => <StatusBadge status={value} />,
      },
      {
        Header: "Contractor",
        accessor: "fabricator", // shows as object, cell will fix display
        Cell: ({ value }) => value?.fabName,
        sortType: (a, b) => {
          const aName = a.original.fabricator?.fabName || "";
          const bName = b.original.fabricator?.fabName || "";
          return aName.localeCompare(bName);
        },
      },
      {
        Header: "Progress",
        accessor: (row) => row.progress?.percentage,
        id: "progressPercentage",
        Cell: ({ row }) => (
          <ProgressBar percentage={row.original.progress?.percentage} />
        ),
        sortType: (a, b) =>
          (a.original.progress?.percentage || 0) -
          (b.original.progress?.percentage || 0),
      },
      {
        Header: "Timeline",
        accessor: "startDate",
        disableSortBy: true,
        Cell: ({ row }) =>
          `${formatDate(row.original.startDate)} - ${formatDate(
            row.original.endDate
          )}`,
      },
      {
        Header: "Budget",
        accessor: "budget",
        Cell: ({ value }) => formatCurrency(value),
      },
    ],
    [formatDate, formatCurrency]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: filteredAndSortedProjects,
        initialState: {
          sortBy: [{ id: "name", desc: false }],
        },
        disableSortRemove: true,
      },
      useSortBy
    );

  // NAVIGATION HANDLER
  const handleRowClick = (projectId) => {
    setSelectedProject(projectId);
  };

  const handleClose = () => {
    setSelectedProject(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="mb-4 text-lg font-medium text-gray-900 sm:mb-0">
            Projects
          </h2>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
              {/* Status Filter */}
              <div className="relative">
                <select
                  className="py-2 pl-3 pr-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETE">Complete</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex space-x-2">
              <button
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="p-6">
        {filteredAndSortedProjects.length === 0 ? (
          <div className="py-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No projects found matching your criteria."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleRowClick(project.id)}
                className="cursor-pointer overflow-hidden bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="mb-1 text-lg font-medium text-gray-900">
                      {project.name}
                    </h3>
                    <StatusBadge status={project.status} />
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="font-medium">Progress</span>
                      <span>{project.progress.percentage}%</span>
                    </div>
                    <ProgressBar
                      percentage={project.progress.percentage}
                      showLabel={false}
                    />
                  </div>
                  <div className="flex justify-between mb-4 text-sm">
                    <div>
                      <span className="font-medium">Budget:</span>
                      <span className="ml-1">
                        {formatCurrency(project.budget)}
                      </span>
                    </div>
                    {/* <div>
                      <span className="font-medium">Tasks:</span>
                      <span className="ml-1">
                        {project.progress.completedTasks}/
                        {project.progress.totalTasks}
                      </span>
                    </div> */}
                  </div>
                  <div>
                    <span className="font-medium">Start:</span>
                    <span className="ml-1">
                      {formatDate(project.startDate)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Estimated Completion:</span>
                    <span className="ml-1">{formatDate(project.endDate)}</span>
                  </div>
                </div>
                <div className="flex justify-between px-6 py-3 bg-gray-50">
                  <div className="text-sm text-gray-500">
                    <Building2 className="inline w-4 h-4 mr-1" />
                    {project.fabricator?.fabName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y divide-gray-200"
              {...getTableProps()}
            >
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup, hgIdx) => (
                  <tr key={hgIdx} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, colIdx) => (
                      <th
                        key={column.id || colIdx}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className={`px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100`}
                      >
                        <div className="flex items-center">
                          {column.render("Header")}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ArrowUpDown className="w-4 h-4 ml-1 rotate-180" />
                            ) : (
                              <ArrowUpDown className="w-4 h-4 ml-1" />
                            )
                          ) : column.canSort ? (
                            <ArrowUpDown className="w-4 h-4 ml-1 opacity-30" />
                          ) : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                className="bg-white divide-y divide-gray-200"
                {...getTableBodyProps()}
              >
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      key={row.id || row.original.id}
                      {...row.getRowProps()}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(row.original.id)}
                    >
                      {row.cells.map((cell, cellIdx) => (
                        <td
                          key={cell.column.id || cellIdx}
                          className="px-6 py-4 whitespace-nowrap"
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedProject && (
        <ClientProjectStatus
          projectId={selectedProject}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ClientAllProjects;
