/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Button, GhantChart } from "../../../index"; // Ensure GanttChart is imported correctly
import Service from "../../../../api/configAPI";
import SegregateTeam from "../../../../util/SegragateTeam";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../../config/constant";
const Project = ({ projectId, isOpen, onClose }) => {
  const project = useSelector((state) =>
    state?.projectData?.projectData?.find(
      (project) => project.id === projectId,
    ),
  );
  console.log(project);
  const teams = useSelector((state) => state?.projectData?.teamData);
  const staffData = useSelector((state)=> state?.userData?.staffData)
  const [members, setMembers] = useState({});
  const [teamTask, setTeamTask] = useState([]);
  const [teamData, setTeamData] = useState();
  const [taskDetail, setTaskDetail] = useState();
  const [loading, setLoading] = useState(true);
  const userType = sessionStorage.getItem("userType");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch team data once when the project is loaded
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await Service.getTeam(project.team);
        setTeamData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team data:", error);
        setLoading(false);
      }
    };

    if (project?.team) {
      setLoading(true);
      fetchTask();
    }
  }, []);

  useEffect(() => {
    if (teamData) {
      const segregateTeam = () => {
        let teamMembers = {};
        let memb = [];
        teamData?.members?.forEach((member) => {
          memb.push({
            employee: member?.employee,
            date: project?.endDate,
            role: member?.role,
          });
          if (member?.role !== "MANAGER" && member?.role !== "LEADER") {
            if (member?.role in teamMembers) {
              teamMembers[member?.role].push(member);
            } else {
              teamMembers[member?.role] = [member];
            }
          }
        });
        setMembers(teamMembers);
        setTeamTask(memb);
      };

      segregateTeam();
    }
  }, [teamData, project?.endDate]);

  const handleEditClick = () => {
    setIsModalOpen(true);
    setSelectedProject(project);
  };
  const handleModalClose = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    async function fetchTasks() {
      if (teamTask.length) {
        const data1 = await SegregateTeam(teamTask); // For Seggregation
        setTaskDetail(data1);
      }
    }
    fetchTasks();
  }, [teamTask]); // Only re-run when teamTask changes

  if (!isOpen) return null;

  const startDate = new Date(project?.startDate);
  const endDate = new Date(project?.endDate);

  console.log(project);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[92%] fixed top-[8%] overflow-x-auto p-5 rounded-lg shadow-lg w-screen ">
        <div className="flex justify-between px-5 py-1 my-5 text-3xl font-bold text-white rounded-lg shadow-xl bg-teal-200/50">
          <h2 className="text-3xl font-bold text-gray-800">Project Details</h2>
          <button
            className="px-5 text-xl font-bold text-white rounded-lg bg-teal-500/50 hover:bg-teal-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className=" h-[80vh] overflow-y-auto">
          <div className="overflow-y-auto rounded-lg h-fit">
            <div className="grid grid-cols-2 gap-5">
              <div className="p-5 rounded-lg bg-teal-100/70">
                <div className="my-3">
                  <strong className="text-gray-700">Project Name:</strong>
                  <div>{project?.name}</div>
                </div>
                <div className="my-3">
                  <strong className="text-gray-700">Description: </strong>
                  {project?.description}
                </div>
                <div className="my-3">
                  <strong className="text-gray-700">Start Date: </strong>
                  {startDate?.toDateString()}
                </div>
                <div className="my-3">
                  <strong className="text-gray-700">Approval Date: </strong>
                  {endDate?.toDateString()}
                </div>
                <p className="my-3">
                  <strong className="text-gray-700">Tools:</strong>{" "}
                  {project?.tools}
                </p>
                <p className="my-3">
                  <strong className="text-gray-700">Connection Design:</strong>{" "}
                  {project?.connectionDesign ? "REQUIRED" : "Not Required"}
                </p>
                <p className="my-3">
                  <strong className="text-gray-700">Misc Design:</strong>{" "}
                  {project?.miscDesign ? "REQUIRED" : "Not Required"}
                </p>
                <p className="my-3">
                  <strong className="text-gray-700">Customer:</strong>{" "}
                  {project?.customer ? "REQUIRED" : "Not Required"}
                </p>
                <div>
                  <strong className="text-gray-700">Team: </strong>
                  {project?.team?.name}
                </div>
                <div className="my-3">
                  <strong className="text-gray-700">Status: </strong>
                  {project?.status}
                </div>
                <div>
                  <strong className="text-gray-700">Stage: </strong>
                  {project?.stage}
                </div>
              </div>

              <div className="">
                <div className="p-5 my-3 rounded-lg bg-teal-100/50 h-fit">
                  <div className="text-xl font-bold text-gray-800">
                    Fabricator Detail:
                  </div>
                  <div>
                    <div className="my-3">
                      <strong className="text-gray-700">
                        Fabricator Name:
                      </strong>
                      <div>{project?.fabricator?.fabName}</div>
                    </div>
                    <div className="my-3">
                      <strong className="text-gray-700">
                        Standard Design:
                      </strong>
                      <div>
                        <a
                          href={`${BASE_URL}${project?.fabricator?.design}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 cursor-pointer hover:text-blue-700"
                        >
                          View standard
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-teal-100/60 p-5 h-[40vh] overflow-y-auto rounded-lg my-1">
                  <div className="my-2 text-2xl tex-gray-800 fon2t-bold">
                    Team Members:
                  </div>
                  <div className="my-4">
                    {" "}
                    <h3 className="text-gray-800 font-lgbold text-">Manager</h3>
                    <li>{project?.team?.manager?.username}</li>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800">Members</h3>
                  {project?.team?.members.map((user) => {
                    return (
                      <li key={user.id}>
                        {`${staffData.find((staff) => staff.id === user.id)?.f_name} ${staffData.find((staff) => staff.id === user.id)?.m_name} ${staffData.find((staff) => staff.id === user.id)?.l_name}`} - {user.role}
                      </li>
                    );
                  })}

                  {Object.keys(members).map((role) => (
                    <div key={role}>
                      <h3 className="text-sm font-bold text-gray-800">
                        {role}
                      </h3>
                      <ol className="ml-4 list-decimal list-inside">
                        {members[role]?.map((member) => (
                          <li key={member?.id} className="mt-1">
                            {member?.employee?.name}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
