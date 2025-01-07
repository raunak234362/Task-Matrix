/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Button, GhantChart, EditProject } from "../../../index"; // Ensure GanttChart is imported correctly
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

  const [members, setMembers] = useState({});
  const [teamTask, setTeamTask] = useState([]);
  const [teamData, setTeamData] = useState();
  const [taskDetail, setTaskDetail] = useState();
  const [loading, setLoading] = useState(true);
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
  }, [project?.team]);

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

  useEffect(() => {
    async function fetchTasks() {
      if (teamTask.length) {
        const data1 = await SegregateTeam(teamTask);
        setTaskDetail(data1);
      }
    }
    fetchTasks();
  }, [teamTask]); // Only re-run when teamTask changes


  if (!isOpen) return null;

  const startDate = new Date(project?.startDate);
  const endDate = new Date(project?.endDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[92%] fixed top-[8%] overflow-x-auto p-5 rounded-lg shadow-lg w-screen ">
        <div className="text-3xl font-bold flex justify-between text-white bg-teal-200/50 shadow-xl px-5 py-1 mt-2 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800">Project Details</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className=" h-[80vh] overflow-y-auto">
          <div className="bg-blue-gray-200/50 rounded-lg my-5">
            {/* Conditionally render Gantt Chart */}
            {loading ? (
              <div className="text-center">Loading Gantt Chart...</div>
            ) : (
              <GhantChart taskData={taskDetail} />
            )}
          </div>


          <div className="h-fit overflow-y-auto rounded-lg">
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-teal-100/70 rounded-lg p-5">
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
                  {project?.tool}
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
                  {teamData?.name}
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
                <div className="bg-teal-100/50 p-5 h-fit rounded-lg my-3">
                  <div className="text-xl font-bold text-gray-800">
                    Fabricator Detail:
                  </div>
                  <div>
                    <div className="my-3">
                      <strong className="text-gray-700">
                        Fabricator Name:
                      </strong>
                      <div>{project?.fabricator?.name}</div>
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
                  <div className="text-xl font-bold text-gray-800">
                    Team Members:
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">Manager</h3>
                  <li>{project?.manager?.name}</li>

                  <h3 className="text-sm font-bold text-gray-800">Leader</h3>
                  <li>{project?.leader?.name}</li>

                  {Object.keys(members).map((role) => (
                    <div key={role}>
                      <h3 className="text-sm font-bold text-gray-800">
                        {role}
                      </h3>
                      <ol className="list-decimal list-inside ml-4">
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
