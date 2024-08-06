/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, ProjectPie, Project, Header, BarView } from "../../../index";
import Service from "../../../../api/configAPI";
import SegregateProject from "../../../../util/SegregateProject";
import { TableView } from "./TableView";

const Allprojects = () => {
  const [projects, setProjects] = useState([]);
  const [fabricator, setFabricator] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userType = sessionStorage.getItem("userType");
  const [segregateProject, setSegreateProject] = useState();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await Service.getAllProject();
        setProjects(projects);
        setSegreateProject(await SegregateProject(projects));
        console.log(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [selectedProject]);

  const handleViewClick = async (projectId) => {
    try {
      const project = await Service.getProject(projectId);
      setSelectedProject(project);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div>
      <Header title={"All Project"} />
      
      {userType!== 'user' && segregateProject && (
        
        <div className="flex-grow bg-white shadow-lg rounded-lg p-6">
        <BarView
          segregateProject={segregateProject}
          setProject={setProjects}
          setFabricator={setFabricator}
        />
      </div>
      
    )}
      {/* {segregateProject && (
        
          <div className="shadow-xl p-5 rounded-lg mt-5">
            <TableView
              segregateProject={segregateProject}
              setProject={setProjects}
              setFabricator={setFabricator}
            />
          </div>
        
      )} */}
      
      

      <div className="table-container w-full my-5 rounded-lg">
        <div className="h-[57vh] overflow-y-hidden shadow-xl table-container w-full rounded-lg">
        
            <h3 className="text-xl flex font-bold uppercase rounded-lg bg-slate-400 text-white px-5 py-1 justify-center items-center">
            All Projects {
              fabricator && (
                <span className="text-white"> - {fabricator}</span>
              )
            }
          </h3>
         
          
          <div className=" mx-5 my-5 h-[50vh] overflow-y-auto">
            <table className="w-full table-auto border-collapse text-center rounded-xl">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-1 py-2">S.no</th>
                  <th className="px-1 py-2">Project Name</th>
                  <th className="px-1 py-2">Project Manager</th>
                  <th className="px-1 py-2">Start Date</th>
                  <th className="px-3 py-2">Approval Date</th>
                  <th className="px-3 py-2">Detail</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr className="bg-white">
                    <td colSpan="7" className="text-center">
                      No Projects Found
                    </td>
                  </tr>
                ) : (
                  projects.map((project, index) => (
                    <tr key={project.id}>
                      <td className="border px-1 py-2">{index + 1}</td>
                      {/* <td className="border px-1 py-2">
                        {project?.fabricator?.name}
                      </td> */}
                      <td className="border px-1 py-2">{project?.name}</td>
                      <td className="border px-1 py-2">
                        {project?.manager?.name}
                      </td>
                      <td className="border px-1 py-2">
                        {new Date(project?.startDate).toDateString()}
                      </td>
                      <td className="border px-3 py-2">
                        {new Date(project?.endDate).toDateString()}
                      </td>
                      <td className="border px-3 py-2">
                        <div className="flex justify-center">
                          <Button onClick={() => handleViewClick(project.id)}>
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedProject && (
        <Project
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          setProject={setSelectedProject}
        />
      )}
    </div>
  );
};

export default Allprojects;
