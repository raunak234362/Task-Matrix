/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Input, CustomSelect } from "../../../index";
import Service from "../../../../api/configAPI";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { addTask } from "../../../../store/taskSlice";
import { toast } from "react-toastify";
import socket from "../../../../socket";


const AddTask = () => {
  const [projectOptions, setPtojectOptions] = useState([]);
  const projects = useSelector((state) => state?.projectData?.projectData);
  const [project, setProject] = useState({});
  const [projectStage, setProjectStage] = useState([]);
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
        project?.team?.members?.reduce((acc, member) => {
          const exists = acc.find((item) => item.value === member?.id);

          if (!exists) {
            acc.push({
              label: `${member.role} - ${member.f_name} ${member.m_name} ${member.l_name}`,
              value: member?.id,
            });
          }
          return acc;
        }, []) || []; // Fallback to an empty array if reduce fails
      console.log("projectStage", project?.stage);
      setProjectStage(project?.stage);
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
      // setProjectStage(options);
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
    console.log("Task Data:", taskData);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const TaskName = `${taskData.type} - ${taskData.taskname}`;

      const data = await Service.addTask({
        ...taskData,
        name: TaskName,
        status: "ASSIGNED",
        token: token,
      });
      console.log("Task Data:", data);

      toast.success("✅ Task Added Successfully");
      dispatch(addTask(data));

      // ✅ Notify assigned user via socket
      // if (taskData.user) {
      //   console.log("User ID:", taskData.user);
      //   socket.emit("customNotification", {
      //     userId: taskData.user, // should be the assigned user's ID
      //   });
      // }

    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("❌ Error adding task");
    }
  };




  return (
    <div className="bg-white/70 w-full h-full rounded-lg p-2 px-5">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full ">
        <div className="flex flex-col justify-between gap-5 ">
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Project:
          </div>
          <div className="px-4">
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
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Task Details:
          </div>
          <div className="flex flex-row gap-x-2 px-4">
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
                  { label: "Model Checking", value: "MC" },
                  { label: "Detailing", value: "DETAILING" },
                  { label: "Detailing Checking", value: "DC" },
                  { label: "Erection", value: "ERECTION" },
                  { label: "Erection Checking", value: "EC" },
                  { label: "Designing", value: "DESIGNING" },
                  { label: "Design Checking", value: "DWG_CHECKING" },
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
          <div className="px-4">
            <CustomSelect
              label="Stage"
              name="stage"
              options={[
                { label: "Select Stage", value: "" },
                { label: "(RFI)Request for Information", value: "RFI" },
                { label: "(IFA)Issue for Approval", value: "IFA" },
                {
                  label: "(BFA)Back from Approval/ Returned App",
                  value: "BFA",
                },
                {
                  label: "(BFA-M)Back from Approval - Markup",
                  value: "BFA_M",
                },
                { label: "(RIFA)Re-issue for Approval", value: "RIFA" },
                { label: "(RBFA)Return Back from Approval", value: "RBFA" },
                { label: "(IFC)Issue for Construction/ DIF", value: "IFC" },
                {
                  label: "(BFC)Back from Construction/ Drawing Revision",
                  value: "BFC",
                },
                { label: "(RIFC)Re-issue for Construction", value: "RIFC" },
                { label: "(REV)Revision", value: "REV" },
                { label: "(CO#)Change Order", value: "CO" },
              ]}
              {...register("Stage", { required: "Stage is required" })}
              onChange={setValue}
            />
            {errors.stage && <div>This field is required</div>}
          </div>
          <div className="px-4">
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
          {/* <div className="mt-5">
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
            </div> */}
          <div className="flex flex-col max-md:flex-row w-1/5 gap-5 px-4">
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

          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Assigning Details:
          </div>
          <div className="px-4 space-y-2">
            <div className="">
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
            <div className="">
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
            <div className="text-md text-gray-700 ">Duration:</div>
            <div className="flex flex-col md:flex-row max-lg:flex-col w-1/5 gap-2">
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

          <div className="my-5 w-full">
            <Button type="submit" className="w-full text-lg bg-teal-100 text-teal-500 border-2 border-teal-500 hover:bg-teal-500 hover:text-white">
              Add Task
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
