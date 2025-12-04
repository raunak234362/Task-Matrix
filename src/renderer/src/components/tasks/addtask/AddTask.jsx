/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Input, CustomSelect } from "../../index";
import Service from "../../../api/configAPI";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { addTask } from "../../../store/taskSlice";
import { toast } from "react-toastify";

const AddTask = () => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [milestoneOptions, setMilestoneOptions] = useState([]);
  const tasks = useSelector((state) => state?.taskData?.taskData);
  const projects = useSelector((state) => state?.projectData?.projectData);
  const [project, setProject] = useState({});
  const [projectStage, setProjectStage] = useState([]);
  const [assignedUser, setAssignedUser] = useState([]);
  const [pendingTaskError, setPendingTaskError] = useState(null); // State for pending task error
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); // State for button disabled
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const projectId = watch("project");
  const selectedUser = watch("user");

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
        console.log("Project Options:", options);
        setProjectOptions(options);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Error fetching projects");
      }
    };
    fetchProjects();
  }, []);

  const fetchMilestones = async (projectId) => {
    try {
      const milestones = await Service.getMilestoneByProjectId(projectId);
      const options =
        milestones?.data?.map((milestone) => ({
          label: milestone.subject,
          value: milestone.id,
        })) || [];
      setMilestoneOptions(options);
      console.log("Milestone Options:", options);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      toast.error("Error fetching milestones");
      setMilestoneOptions([]);
    }
  };

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
        }, []) || [];
      setProjectStage(project?.stage || []);
      setAssignedUser(assigned);
      await fetchMilestones(projectId);
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Error fetching project details");
      setMilestoneOptions([]);
    }
  };

  // const handleParentTasks = async (projectId) => {
  //   try {
  //     const parentTasks = await Service.getParentTasks(projectId);
  //     const options =
  //       parentTasks?.map((task) => ({
  //         label: task?.name,
  //         value: task?.id,
  //       })) || [];
  //     console.log("Parent Task Options:", options);
  //   } catch (error) {
  //     console.error("Error fetching parent tasks:", error);
  //     toast.error("Error fetching parent tasks");
  //   }
  // };

  // const checkUserPendingTasks = (userId) => {
  //   console.log("Checking pending tasks for user:", userId);
  //   if (!userId) {
  //     setPendingTaskError(null);
  //     setIsSubmitDisabled(false);
  //     return;
  //   }

  //   try {
  //     const tasks = useSelector((state) => state.taskData.taskData);
  //     console.log("All Tasks from Store:", tasks);
  //     // Get today's date and subtract 24 hours
  //     const now = new Date();

  //     // Helper: check if day is weekend
  //     const isWeekend = (date) => {
  //       const day = date.getDay();
  //       return day === 6 || day === 0; // Saturday or Sunday
  //     };

  //     // Filter tasks belonging to the selected user with IN_REVIEW status
  //     const inReviewTasks = tasks?.filter(
  //       (t) => t.assignedUserId === userId && t.status === "IN_REVIEW",
  //     );

  //     const hasOldInReview = inReviewTasks?.some((task) => {
  //       const reviewDate = new Date(task.updatedAt || task.inReviewAt);
  //       const hoursDifference = (now - reviewDate) / (1000 * 60 * 60);

  //       // If task has been in review > 24 hours and it's not weekend
  //       return hoursDifference > 24 && !isWeekend(now);
  //     });

  //     if (hasOldInReview) {
  //       setPendingTaskError(
  //         "⚠️ This user has a task pending in review for over 24 hours (excluding weekends). Please review it first.",
  //       );
  //       setIsSubmitDisabled(true);
  //     } else {
  //       setPendingTaskError(null);
  //       setIsSubmitDisabled(false);
  //     }
  //   } catch (error) {
  //     console.error("Error checking user tasks:", error);
  //     setPendingTaskError("Error checking user tasks. Please try again.");
  //     setIsSubmitDisabled(true);
  //   }
  // };

  // 🔹 Check pending tasks for selected user
  const checkUserPendingTasks = (userId) => {
    console.log("Checking pending tasks for user:", userId);

    if (!userId) {
      setPendingTaskError(null);
      setIsSubmitDisabled(false);
      return;
    }

    try {
      const now = new Date();

      const isWeekend = (date) => {
        const day = date.getDay();
        return day === 6 || day === 0; // Sat or Sun
      };

      const calculateBusinessHoursDifference = (start, end) => {
        let diffHours = 0;
        const temp = new Date(start);

        while (temp < end) {
          if (!isWeekend(temp)) diffHours += 1;
          temp.setHours(temp.getHours() + 1);
        }

        return diffHours;
      };

      const inReviewTasks = tasks?.filter(
        (t) => t.user_id === userId && t.status === "IN_REVIEW",
      );

      console.log("In Review Tasks for User:", inReviewTasks);

      const hasOldInReview = inReviewTasks?.some((task) => {
        const reviewDate = new Date(task.inReviewTime?.[0]);
        const hoursDifference = calculateBusinessHoursDifference(
          reviewDate,
          now,
        );
        console.log("Business Hours Since Review:", hoursDifference);

        // Only count as "old" if more than 24 business hours have passed
        return hoursDifference > 24;
      });

      if (hasOldInReview) {
        setPendingTaskError(
          "⚠️ This user has a task pending in review for over 24 business hours (excluding weekends). Please review it first.",
        );
        setIsSubmitDisabled(true);
      } else {
        setPendingTaskError(null);
        setIsSubmitDisabled(false);
      }
    } catch (error) {
      console.error("Error checking user tasks:", error);
      setPendingTaskError("Error checking user tasks. Please try again.");
      setIsSubmitDisabled(true);
    }
  };

  useEffect(() => {
    if (projectId) {
      handleProjectChange(projectId);
    } else {
      setMilestoneOptions([]);
      setAssignedUser([]);
      setProjectStage([]);
      setProject({});
      setPendingTaskError(null);
      setIsSubmitDisabled(false);
    }
  }, [projectId]);

  // Check pending tasks when user changes
  useEffect(() => {
    checkUserPendingTasks(selectedUser);
  }, [selectedUser]);

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
        mileStone_id: taskData.milestone_id,
      });
      console.log("Task Added:", data);

      toast.success("✅ Task Added Successfully");
      dispatch(addTask(data));
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      if (
        errorMessage ===
        "User has an old pending task. Please complete it before assigning a new one."
      ) {
        setPendingTaskError(errorMessage);
        setIsSubmitDisabled(true);
      } else {
        toast.warning("Failed to add task. Please try again.", errorMessage);
      }
    }
  };

  return (
    <div className="bg-white/70 w-full h-full rounded-lg p-2 px-5">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col justify-between gap-5">
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Project:
          </div>
          <div className="px-4">
            <CustomSelect
              label="Project:"
              placeholder="Select Project"
              name="project"
              className="w-full"
              options={[
                { label: "Select Project", value: "" },
                ...projectOptions,
              ]}
              {...register("project", { required: "Project is required" })}
              onChange={setValue}
            />
            {errors.project && (
              <p className="text-red-600">{errors.project.message}</p>
            )}
          </div>

          {/* Milestone Selection */}
          <div className="px-4">
            <CustomSelect
              label="Milestone:"
              placeholder="Select Milestone"
              name="milestone"
              className="w-full"
              options={[
                { label: "Select Milestone", value: "" },
                ...milestoneOptions,
              ]}
              {...register("milestone_id")}
              onChange={setValue}
            />
            {errors.milestone && (
              <p className="text-red-600">{errors.milestone.message}</p>
            )}
          </div>

          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Task Details:
          </div>
          <div className="flex flex-row gap-x-2 px-4">
            <div className="w-[30%]">
              <CustomSelect
                label="Task Type:"
                name="type"
                placeholder="Task Type"
                className="w-full"
                options={[
                  { label: "Select Task", value: "" },
                  { label: "Modeling", value: "MODELING" },
                  { label: "Model Checking", value: "MC" },
                  { label: "Detailing", value: "DETAILING" },
                  { label: "Detail Checking", value: "DC" },
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
                label="Task Name:"
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
              label="Stage:"
              name="stage"
              options={[
                { label: "Select Stage", value: "" },
                { label: "(RFI) Request for Information", value: "RFI" },
                { label: "(IFA) Issue for Approval", value: "IFA" },
                {
                  label: "(BFA) Back from Approval/Returned App",
                  value: "BFA",
                },
                {
                  label: "(BFA-M) Back from Approval - Markup",
                  value: "BFA_M",
                },
                { label: "(RIFA) Re-issue for Approval", value: "RIFA" },
                { label: "(RBFA) Return Back from Approval", value: "RBFA" },
                { label: "(IFC) Issue for Construction/DIF", value: "IFC" },
                {
                  label: "(BFC) Back from Construction/Drawing Revision",
                  value: "BFC",
                },
                { label: "(RIFC) Re-issue for Construction", value: "RIFC" },
                { label: "(REV) Revision", value: "REV" },
                { label: "(CO#) Change Order", value: "CO" },
              ]}
              {...register("Stage", { required: "Stage is required" })}
              onChange={setValue}
            />
            {errors.stage && (
              <p className="text-red-600">{errors.stage.message}</p>
            )}
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
          <div className="flex flex-col max-md:flex-row w-full gap-5 px-4">
            <div className="w-1/3">
              <Input
                label="Start Date:"
                name="start_date"
                type="date"
                className="w-full"
                {...register("start_date", {
                  required: "Start Date is required",
                })}
              />
              {errors.start_date && (
                <p className="text-red-600">{errors.start_date.message}</p>
              )}
            </div>
            <div className="w-1/3">
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
            <div>
              <CustomSelect
                label="Assign User:"
                name="user"
                options={[{ label: "Select User", value: "" }, ...assignedUser]}
                className="w-full"
                {...register("user", {
                  required: "Assigning User is required",
                })}
                onChange={(name, value) => {
                  setValue(name, value);
                  checkUserPendingTasks(value); // Re-check on user change
                }}
              />
              {errors.user && (
                <p className="text-red-600">{errors.user.message}</p>
              )}
            </div>
            <div>
              <Input
                type="textarea"
                label="Description:"
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
            <div className="text-md text-gray-700">Duration:</div>
            <div className="flex flex-col md:flex-row max-lg:flex-col w-full gap-2">
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
                {errors.hour && (
                  <p className="text-red-600">{errors.hour.message}</p>
                )}
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
                {errors.min && (
                  <p className="text-red-600">{errors.min.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Display pending task error above button */}
          {pendingTaskError && (
            <p className="text-red-600 text-center mt-4">{pendingTaskError}</p>
          )}
          <div className="my-5 w-full">
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full text-lg border-2 transition-colors duration-300 
    ${
      isSubmitDisabled
        ? "bg-red-100 text-red-500 border-red-500 cursor-not-allowed hover:bg-red-100 hover:text-red-500"
        : "bg-teal-100 text-teal-500 border-teal-500 hover:bg-teal-500 hover:text-white"
    }`}
            >
              Add Task
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
