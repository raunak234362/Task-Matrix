/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Input, CustomSelect } from "../../../index";
import Service from "../../../../api/configAPI";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addTask } from "../../../../store/taskSlice";
import { toast } from "react-toastify";

const AddTask = () => {
  const [projectOptions, setPtojectOptions] = useState([]);
  const [project, setProject] = useState({});
  const [parentTaskOptions, setParentTaskOptions] = useState([]);
  const [assignedUser, setAssignedUser] = useState([]);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();


  const projectId = watch("project");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await Service.getAllProject();
        const options = projects
          .filter((project) => project.team != null)
          .map((project) => ({
            label: `${project.name} - ${project.fabricator.fabName}`,
            value: project.id,
          }));
          console.log(options);
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
      const assigned =
        project?.data?.team?.members?.reduce((acc, member) => {
          const exists = acc.find((item) => item.value === member?.id);

          if (!exists) {
            acc.push({
              label: `${member.role} - ${member.f_name} ${member.m_name} ${member.l_name}`,
              value: member?.id,
            });
          }
          return acc;
        }, []) || []; // Fallback to an empty array if reduce fails
      setAssignedUser(assigned);
    } catch (error) {
      toast.error("Error fetching project details:", error);
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
      toast.error("Error fetching parent tasks:", error);
    }
  };

  useEffect(() => {
    if (projectId) {
      handleProjectChange(projectId);
      handleParentTasks(projectId);
    }
  }, [projectId]);

  const onSubmit = async (taskData) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const TaskName = `${taskData.type} - ${taskData.taskname}`;
      const data = await Service.addTask({
        ...taskData,
        name: TaskName,
        token: token,
      });
      toast.success("Task Added Successfully");
      dispatch(addTask(data));
    } catch (error) {
      toast.error("Error adding task", error);
    }
  };



  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-1">
        <div className="flex flex-col justify-between gap-5 ">
          <div className="flex flex-col p-5 rounded-lg shadow-lg shadow-black/15">
            <div className="mt-5">
              <CustomSelect
                label="Project:"
                placeholder="Project"
                name="project"
                className="w-full"
                options={[
                  {
                    label: "Select Project",
                    value: "",
                  },
                  ...projectOptions,
                ]}
                {...register("project", { required: "Project is required" })}
                onChange={setValue}
              />
              {errors.project && (
                <p className="text-red-600">{errors.project.message}</p>
              )}
            </div>

            {/* <div className="mt-5">
              <CustomSelect
                label="Parent Task: "
                name="parent"
                placeholder="Parent Task"
                className="w-full"
                options={[
                  {
                    label: 'Select Task',
                    value: ''
                  },
                  ...parentTaskOptions
                ]}
                {...register('parent')}
                onChange={setValue}
              />
            </div> */}
            <div className="flex flex-row mt-5 gap-x-2">
              <div className="w-[30%]">
                <CustomSelect
                  label="Task Type: "
                  name="type"
                  placeholder="Task Type"
                  className="w-full"
                  options={[
                    {
                      label: "Select Task",
                      value: "",
                    },
                    { label: "Modeling", value: "MODELING" },
                    { label: "Model Checking", value: "MODEL_CHECKING" },
                    { label: "Detailing", value: "DETAILING" },
                    { label: "Detailing Checking", value: "DETAIL_CHECKING" },
                    { label: "Erection", value: "ERECTION" },
                    { label: "Erection Checking", value: "ERECTION_CHECKING" },
                    { label: "Others", value: "OTHERS" },
                  ]}
                  {...register("type", { required: "Task Type is required" })}
                  onChange={setValue}
                />
                {errors.type && (
                  <p className="text-red-600">{errors.type.message}</p>
                )}
              </div>
              <div className="w-full">
                <Input
                  name="taskname"
                  label="Task Name: "
                  placeholder="Task Name"
                  className="w-full"
                  {...register("taskname", {
                    validate: (value) => {
                      if (
                        watch("type") === "OTHERS" &&
                        (!value || value.trim() === "")
                      ) {
                        return "With Task Type 'Others', Task name is required";
                      }
                      return true;
                    },
                  })}
                />
                {errors.taskname && (
                  <p className="text-red-600">{errors.taskname.message}</p>
                )}
              </div>
            </div>
            <div className="mt-5">
              <CustomSelect
                label="Priority:"
                name="priority"
                options={[
                  { label: "LOW", value: 0 },
                  { label: "MEDIUM", value: 1 },
                  { label: "HIGH", value: 2 },
                  { label: "Critical", value: 3 },
                ]}
                className="w-full"
                {...register("priority", { required: "Priority is required" })}
                onChange={setValue}
              />
              {errors.priority && (
                <p className="text-red-600">{errors.priority.message}</p>
              )}
            </div>
            <div className="mt-5">
              <CustomSelect
                label="Status:"
                name="status"
                options={[
                  { label: "ASSIGNED", value: "ASSIGNED" },
                  { label: "IN_PROGRESS", value: "IN_PROGRESS" },
                  { label: "ONHOLD", value: "ONHOLD" },
                  { label: "BREAK", value: "BREAK" },
                  { label: "IN_REVIEW", value: "IN_REVIEW" },
                  { label: "COMPLETED", value: "COMPLETE" },
                  { label: "APPROVED", value: "APPROVED" },
                ]}
                className="w-full"
                {...register("status", { required: "Status is required" })}
                onChange={setValue}
              />
              {errors.status && (
                <p className="text-red-600">{errors.status.message}</p>
              )}
            </div>
            <div className="flex flex-row w-1/5 gap-5 my-5">
              <div className="w-full ">
                <Input
                  label="Start Date:"
                  name="start_date"
                  type="date"
                  className="w-full"
                  {...register("start_date", {
                    required: "Start Date is required",
                  })}
                />
                {errors.due_date && (
                  <p className="text-red-600">{errors.due_date.message}</p>
                )}
              </div>
              <div className="w-full ">
                <Input
                  label="Due Date:"
                  name="due_date"
                  type="date"
                  className="w-full"
                  {...register("due_date", {
                    required: "Due Date is required",
                  })}
                />
                {errors.due_date && (
                  <p className="text-red-600">{errors.due_date.message}</p>
                )}
              </div>
            </div>
            <div className="mt-1">
              <div className="text-lg font-bold">Duration:</div>
              <div className="flex flex-row w-1/5 gap-5">
                <div className="w-full">
                  <Input
                    type="number"
                    name="hour"
                    label="HH"
                    placeholder="HH"
                    className="w-20"
                    min={0}
                    {...register("hour", {
                      required: "Hours is required in Duration",
                    })}
                    onBlur={(e) => {
                      if (e.target.value < 0) e.target.value = 0;
                    }}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="number"
                    name="min"
                    placeholder="MM"
                    label="MM"
                    className="w-20"
                    min={0}
                    max={60}
                    {...register("min", {
                      required: "Minutes is required in Duration",
                    })}
                    onBlur={(e) => {
                      if (e.target.value < 0) e.target.value = 0;
                    }}
                  />
                </div>
                {errors.min && (
                  <p className="text-red-600">{errors.min.message}</p>
                )}
              </div>
            </div>
            <div className="mt-5">
              <CustomSelect
                label="Assign User:"
                name="user"
                options={[{ label: "Select User", value: "" }, ...assignedUser]}
                className="w-full"
                {...register("user", {
                  required: "Assigning User is required",
                })}
                onChange={setValue}
              />
            </div>
            <div className="mt-5">
              <Input
                type="textarea"
                label="Description: "
                name="description"
                placeholder="Description"
                className="w-full"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-600">{errors.description.message}</p>
              )}
            </div>
            <div className="w-full mt-5">
              <Button type="submit">Add Task</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
