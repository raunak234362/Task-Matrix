/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, Select } from "../../../index";
import { useDispatch, useSelector } from "react-redux";
import { updateProjectData } from "../../../../store/projectSlice";
import Service from "../../../../api/configAPI";

const EditProject = ({ onClose, projectId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [teamData,setTeamData]=useState(null)
  const [teamOptions, setTeamOptions] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      projectName: projectData?.projectName || "",
      fabricatorName: projectData?.fabricatorName || "",
      projectDescription: projectData?.projectDescription || "",
      projectStartDate: projectData?.projectStartDate || "",
      projectEndDate: projectData?.projectEndDate || "",
      projectStatus: projectData?.projectStatus || "",
      projectStage: projectData?.projectStage || "",
      teamName: projectData?.teamName || "",
      teamManager:projectData?.teamManager || "",
    },
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const project = await Service.getProjectById(projectId);
        setProjectData(project);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setLoading(false);
      }
    };

    const fetchTeams = async () => {
      try {
        const teams = await Service.getAllTeam();
        const options = teams.map((team) => team.teamName);
        setTeamOptions(["Select the team", ...options]);
        setTeamData(teams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();

    if (projectId) {
      fetchProjectData();
    } else {
      console.error("Missing projectId");
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectData) {
      reset(projectData);
    }
  }, [projectData, reset]);

  const onSubmit = async (data) => {
    try {
      const updatedProject = await Service.updateProject(
        projectId,
        data
      );
      dispatch(updateProjectData(updatedProject));
      console.log("Project updated:", updatedProject);
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const startDate = new Date(projectData?.projectStartDate);
  const endDate = new Date(projectData?.projectEndDate);

  if (loading) return <p>Loading...</p>;
  if (!projectData) return <p>Project data not found.</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Fabricator Name"
        type="text"
        defaultValue={projectData.fabricatorName}
        {...register("fabricatorName")}
      />
      <Input
        label="Project Name"
        type="text"
        defaultValue={projectData.projectName}
        {...register("projectName")}
      />
      <Input
        label="Project Description"
        type="text"
        defaultValue={projectData.projectDescription}
        {...register("projectDescription")}
      />
      <p className="py-1">
        <strong>Start Date:</strong> {startDate.toDateString()}{" "}
        {startDate.toLocaleTimeString()}
      </p>
      <p className="py-1">
        <strong>End Date:</strong> {endDate.toDateString()}{" "}
        {endDate.toLocaleTimeString()}
      </p>
      <Input
        label="End Date"
        type="datetime-local"
        defaultValue={projectData.projectEndDate}
        {...register("projectEndDate")}
      />
      <Input
        label="Status"
        type="text"
        defaultValue={projectData.projectStatus}
        {...register("projectStatus")}
      />
      <Input
        label="Stage"
        type="text"
        defaultValue={projectData.projectStage}
        {...register("projectStage")}
      />
      <Select
        label="Team"
        name="teamName"
        options={teamOptions}
        className="w-full"
        {...register("teamName")}
      />
      <Button type="submit">Update Project</Button>
    </form>
  );
};

export default EditProject;
