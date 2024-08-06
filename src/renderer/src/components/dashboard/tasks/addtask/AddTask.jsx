/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { Button, Header, Input, Select } from "../../../index";
import Service from "../../../../api/configAPI";
import { setTaskData } from "../../../../store/taskSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const AddTask = () => {
  const [projectOptions, setPtojectOptions] = useState([]);
  const [project, setProject] = useState({});
  const [parentTaskOptions, setParentTaskOptions] = useState([]);
  const [assignedUser, setAssignedUser] = useState([]);
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // FETCH task related to project
  // Fetch project details
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await Service.getAllProject();
        const options = projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
        setPtojectOptions(options);
        console.log(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectChange = async (projectId) => {
    try {
      const project = await Service.getProject(projectId);
      setProject(project);
      const assigned = project?.team?.members?.map((member) => ({
        label: `${member?.role} - ${member?.employee?.name}`,
        value: member?.employee?.id,
      }));
      setAssignedUser(assigned);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleParentTasks = async (projectId) => {
    try {
      const parentTasks = await Service.getParentTasks(projectId);
      const options = parentTasks?.map((task) => ({
        label: task?.name,
        value: task?.id,
      }));
      setParentTaskOptions(options);
    } catch (error) {
      console.error("Error fetching parent tasks:", error);
    }
  };

  const onSubmit = async (taskData) => {
    try {
      const token = sessionStorage.getItem("token");
      console.log(taskData.project);
      if (!token) {
        throw new Error("Token not found");
      }
      const data = await Service.addTask({
        ...taskData,
        token: token,
      });
      console.log("Response from task:", taskData);

      dispatch(setTaskData(data));
      console.log("Task added:", data);
      alert("Successfully added new Task", taskData?.name);
    } catch (error) {
      console.error("Error adding task:", error);
      console.log("Project data:", taskData);
    }
  };

  return (
    <div>
      <div>
      <Header title={"Add Task"}/>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5">
        <div className="p-5 flex flex-col justify-between gap-5">
          <div className="flex rounded-lg flex-col shadow-lg shadow-black/15 p-8">
            <div className="mt-5">
              <Select
                label="Project: "
                placeholder="Project"
                // name="project"
                className="w-full"
                options={[
                  {
                    label: "Select Project",
                    value: "",
                  },
                  ...projectOptions,
                ]}
                onChange={async (e) => {
                  await handleParentTasks(e.target.value);
                  await handleProjectChange(e.target.value);
                  register("project", { value: e.target.value });
                }}
              />
            </div>
            <div className="mt-5">
              <Select
                label="Parent Task: "
                name="parent"
                placeholder="Parent Task"
                className="w-full"
                options={[
                  {
                    label: "Select Parent Task",
                    value: "",
                  },
                  ...parentTaskOptions,
                ]}
                {...register("parent")}
              />
            </div>
            <div className="mt-5">
              <Input
                name="name"
                label="Task Name: "
                placeholder="Task Name"
                className="w-full"
                {...register("name")}
              />
            </div>
            <div className="mt-5">
              <Select
                label="Priority"
                name="priority"
                options={[
                  { label: "LOW", value: 0 },
                  { label: "MEDIUM", value: 1 },
                  { label: "HIGH", value: 2 },
                  { label: "Critical", value: 3 },
                ]}
                className="w-full"
                {...register("priority")}
              />
            </div>
            <div className="mt-5">
              <Select
                label="Status"
                name="status"
                options={[
                  { label: "ASSIGNED", value: "ASSINGED" },
                  { label: "IN PROGRESS", value: "IN-PROGRESS" },
                  { label: "ON HOLD", value: "ON-HOLD" },
                  { label: "BREAK", value: "BREAK" },
                  { label: "IN REVIEW", value: "IN-REVIEW" },
                  { label: "COMPLETED", value: "COMPLETE" },
                  { label: "APPROVED", value: "APPROVED" },
                ]}
                className="w-full"
                {...register("status")}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Due Date:"
                name="due_date"
                type="date"
                placeholder="Date"
                className="w-full"
                {...register("due_date")}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Duration:"
                type="text"
                name="duration"
                placeholder="Date"
                className="w-full"
                {...register("duration")}
              />
            </div>
            <div className="mt-5">
              <Select
                label="Assign User"
                name="user"
                options={[
                  { label: "Select User", value: "" },
                  ...assignedUser,
                ]}
                className="w-full"
                {...register("user")}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Description: "
                name="description"
                placeholder="Description"
                className="w-full h-44"
                {...register("description")}
              />
            </div>
            <div className="mt-5 w-full">
              <Button type="submit">Add Task</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
