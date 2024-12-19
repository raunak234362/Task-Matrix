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
  const teams = useSelector((state) => state?.projectData?.teamData);
  const dispatch = useDispatch();
  const [projectData, setProjectData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [teamOptions, setTeamOptions] = useState([]);

  useEffect(() => {
    const options = teams?.map((team) => ({
      label: team?.name,
      value: team?.id,
    }));
    setTeamOptions(options);
  }, []);
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
    setValue,
  } = useForm({
    defaultValues: {
      name: project?.name || "",
      fabricator: project?.fabricator?.id || "",
      description: project?.description || "",
      startDate: project?.startDate || "",
      endDate: project?.endDate || "",
      status: project?.status || "",
      stage: project?.stage || "",
      manager: project?.manager?.id || "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const updatedProject = await Service.editProject(project.id, data);
      dispatch(updateProjectData(updatedProject));
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
            <div className="my-2">
              <Input
                label="Project Name"
                type="text"
                defaultValue={projectData?.projectName}
                {...register("name")}
              />
            </div>
            <div className="my-2">
              <Input
                label="Project Description"
                type="text"
                defaultValue={projectData?.projectDescription}
                {...register("description")}
              />
            </div>
            <div>
              <Input
                label="End Date"
                type="date"
                defaultValue={projectData?.projectEndDate}
                {...register("endDate")}
              />
            </div>
            <div className="my-2">
              <CustomSelect
                label="Stage"
                name= "stage"
                options={[
                  { label: 'RFI', value: 'RFI' },
                  { label: 'IFA', value: 'IFA' },
                  { label: 'BFA', value: 'BFA' },
                  { label: 'BFA-Markup', value: 'BFA-M' },
                  { label: 'RIFA', value: 'RIFA' },
                  { label: 'RBFA', value: 'RBFA' },
                  { label: 'IFC', value: 'IFC' },
                  { label: 'BFC', value: 'BFC' },
                  { label: 'RIFC', value: 'RIFC' },
                  { label: 'REV', value: 'REV' },
                  { label: 'CO#', value: 'CO#' }
                ]}
                defaultValue={projectData?.projectStatus}
                {...register("stage")}
                onChange={setValue}
              />
            </div>
            <div className="my-2">
              <CustomSelect
                label="Status"
                name="status"
                options={[
                  { label: "ACTIVE", value: "ACTIVE" },
                  { label: "ON-HOLD", value: "ON-HOLD" },
                  { label: "INACTIVE", value: "INACTIVE" },
                  { label: "DELAY", value: "DELAY" },
                  { label: "REOPEN", value: "REOPEN" },
                  { label: "COMPLETE", value: "COMPLETE" },
                  { label: "SUBMIT", value: "SUBMIT" },
                  { label: "SUSPEND", value: "SUSPEND" },
                  { label: "CANCEL", value: "CANCEL" },

                ]}
                defaultValue={projectData?.projectStatus}
                {...register("status")}
                onChange={setValue}
              />
            </div>
            <div className="my-2">
              <CustomSelect
                label="Team"
                name="team"
                options={teamOptions}
                className="w-full"
                {...register("team")}
                onChange={setValue}
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
