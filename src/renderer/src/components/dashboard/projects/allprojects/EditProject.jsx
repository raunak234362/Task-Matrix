/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, CustomSelect } from "../../../index";
import { useDispatch, useSelector } from "react-redux";
import { updateProjectData } from "../../../../store/projectSlice";
import Service from "../../../../api/configAPI";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const EditProject = ({ onClose, project }) => {
  console.log(project);
  const dispatch = useDispatch();
  const [projectData, setProjectData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [teamOptions, setTeamOptions] = useState([]);

  // const handleDelete = () => {
  //   try {
  //     Service.DeleteProject(project?.id);
  //     alert("Successfully Deleted");
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   onClose();
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      projectName: project?.name || "",
      fabricatorName: project?.fabricator?.name || "",
      projectDescription: project?.description || "",
      projectStartDate: project?.startDate || "",
      projectEndDate: project?.endDate || "",
      projectStatus: project?.statur || "",
      projectStage: project?.stage || "",
      teamName: project?.team || "",
      teamManager: project?.manager || "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const updatedProject = await Service.editProject(project.id, data);
      // dispatch(updateProjectData(updatedProject));
      console.log("Project updated:", updatedProject);
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const startDate = new Date(project?.startDate);
  const endDate = new Date(project?.endDate);

  // if (loading) return <p>Loading...</p>;
  // if (!projectData) return <p>Project data not found.</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[50vh] overflow-x-auto p-5 rounded-lg shadow-lg w-[40vw] ">
        <div className="flex justify-between my-5 bg-teal-200/50 p-2 rounded-lg">
          <h2 className="text-2xl font-bold">Edit Project</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Project Name"
                type="text"
                defaultValue={projectData?.projectName}
                {...register("projectName")}
              />
            </div>
            <div>
              <Input
                label="Project Description"
                type="text"
                defaultValue={projectData?.projectDescription}
                {...register("projectDescription")}
              />
            </div>
            <div>
              <Input
                label="End Date"
                type="datetime-local"
                defaultValue={projectData?.projectEndDate}
                {...register("projectEndDate")}
              />
            </div>
            <div>
              <Input
                label="Status"
                type="text"
                defaultValue={projectData?.projectStatus}
                {...register("projectStatus")}
              />
            </div>
            <div>
              <Input
                label="Stage"
                type="text"
                defaultValue={projectData?.projectStage}
                {...register("projectStage")}
              />
            </div>
            <div>
              <CustomSelect
                label="Team"
                name="teamName"
                options={teamOptions}
                className="w-full"
                {...register("teamName")}
              />
            </div>

            <Button type="submit">Update Project</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
