/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../../../store/taskSlice";
import Service from "../../../api/configAPI";
import Input from "../../fields/Input";
import { CustomSelect, Button } from "../../index";
import { toast } from "react-toastify";

/* eslint-disable react/prop-types */
const EditTask = ({ onClose, task }) => {
  const taskDetail = task[0];
  const [milestoneOptions, setMilestoneOptions] = useState([]);
  const dispatch = useDispatch();
  const takenHour = taskDetail?.workingHourTask?.[0]?.duration;
  const work_id = taskDetail?.workingHourTask?.[0]?.id;
  const projectId = taskDetail?.project_id;
  const [defaultHour, defaultMin] = (taskDetail?.duration ?? "00:00")
    .split(":")
    .slice(0, 2);

  const userType = sessionStorage.getItem("userType");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: taskDetail?.name || "",
      description: taskDetail?.description || "",
      duration: taskDetail?.duration || "",
      start_date: taskDetail?.start_date || "",
      due_date: taskDetail?.due_date || "",
      status: taskDetail?.status || "",
      hour: defaultHour,
      min: defaultMin,
    },
  });

  const status = watch("status");

  const teams = useSelector(
    (state) =>
      state?.projectData?.teamData?.filter(
        (team) => team.id === taskDetail?.project?.teamID,
      ) || [],
  );

  const team = teams[0];
  const teamData = useSelector((state) =>
    state?.projectData?.teamData.find(
      (team) => team.id === taskDetail?.project?.teamID,
    ),
  );
  console.log("===========", taskDetail);

  const fetchMilestones = async () => {
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

  useEffect(() => {
    fetchMilestones();
  }, []);
  const staffData = useSelector((state) => state?.userData?.staffData) || [];

  const assigned = teamData?.members?.reduce((acc, member) => {
    if (!acc?.some((item) => item?.value === member?.id)) {
      const staff = staffData.find((staff) => staff.id === member.id);
      acc.push({
        label: `${member?.role} - ${staff?.f_name} ${staff?.m_name} ${staff?.l_name}`,
        value: member?.id,
      });
    }
    return acc;
  }, []);

  const minutesToHHMMSS = (minutes) => {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}:00`;
  };

  const hhmmssToMinutes = (str) => {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  };

  const onSubmit = async (data) => {
    try {
      const durationHour = data.hour || "00";
      const durationMin = data.min || "00";

      let taskData = {
        ...data,
        name: data?.type ? `${data?.type} - ${data?.taskname}` : data?.name,
        user_id: data?.user,
        duration: `${durationHour}:${durationMin}:00`,
      };

      ["type", "taskname", "hour", "min"].forEach(
        (field) => delete taskData[field],
      );

      if (data.status === "VALIDATE_COMPLETE" && takenHour) {
        taskData.duration = minutesToHHMMSS(takenHour);
      }

      if (data.status === "COMPLETE_OTHER" && takenHour) {
        const durationInMinutes = hhmmssToMinutes(taskData.duration);
        const updatedDuration = durationInMinutes;
        taskData.workingHourTask = [{ duration: updatedDuration }];
        await Service.getEditWorkHoursById(
          { duration: updatedDuration },
          work_id,
        );
      }

      if (data.status === "REWORK") {
        taskData = { ...taskData, reworkStartTime: new Date().toISOString() };
      }
      delete taskData.workingHourTask;

      const updatedTask = await Service.editTask(taskDetail?.id, taskData);
      toast.success("Successfully Updated Task");
      dispatch(updateTask(updatedTask));
    } catch (error) {
      toast.error(error?.message || "Error updating task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[70vh] overflow-x-auto p-5 rounded-lg shadow-lg w-full md:w-[50vw] ">
        <div className="flex justify-between my-5 bg-teal-200/50 p-2 rounded-lg">
          <h2 className="text-2xl font-bold">Edit Task</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="">
            <p className="text-red-700 text-xs">
              *If you want to update the Task Name you have to select the Task
              Type
            </p>
            <CustomSelect
              label="Task Type: "
              name="type"
              placeholder="Task Type"
              className="w-full"
              defaultValues={task?.name?.split(" - ")[0]}
              options={[
                { label: "Select Task", value: "" },
                { label: "Modeling", value: "MODELING" },
                { label: "Model checking", value: "MC" },
                { label: "Erection", value: "ERECTION" },
                { label: "Erection checking", value: "EC" },
                { label: "Detailing", value: "DETAILING" },
                { label: "Detail checking", value: "DC" },
                { label: "Designing", value: "DESIGNING" },
                { label: "Design Checking", value: "DWG_CHECKING" },
                { label: "Others", value: "OTHERS" },
              ]}
              {...register("type")}
              onChange={setValue}
            />
          </div>

          <div className="">
            <Input
              name="taskname"
              label="Task Name: "
              placeholder="Task Name"
              defaultValues={task?.name?.split(" - ")[1]}
              className="w-full"
              {...register("taskname", {
                validate: (value) =>
                  watch("type") === "OTHERS" && (!value || value.trim() === "")
                    ? "With Task Type 'Others', Task name is required"
                    : true,
              })}
            />
          </div>
          <div className="">
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

          <div className="">
            <CustomSelect
              label="Current User:"
              name="user"
              options={team?.members?.map((member) => {
                const staff = staffData.find((staff) => staff.id === member.id);
                return {
                  label: `${member?.role} - ${staff?.f_name} ${staff?.m_name} ${staff?.l_name}`,
                  value: member?.id,
                };
              })}
              className="w-full"
              defaultValues={task?.assignedUser}
              {...register("user")}
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
              defaultValues={task?.description}
              {...register("description")}
            />
          </div>

          {userType === "admin" && (
            <div className="mt-1">
              <div className="text-lg font-bold">Duration:</div>
              <div className="flex flex-row w-1/5 gap-5">
                <Input
                  type="number"
                  name="hour"
                  label="HH"
                  defaultValues={defaultHour}
                  placeholder="HH"
                  className="w-20"
                  min={0}
                  {...register("hour")}
                />
                <Input
                  type="number"
                  name="min"
                  label="MM"
                  placeholder="MM"
                  className="w-20"
                  min={0}
                  max={60}
                  {...register("min")}
                />
                {errors.min && (
                  <p className="text-red-600">{errors.min.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="">
            <CustomSelect
              label="Status:"
              name="status"
              options={[
                { label: "ASSIGNED", value: "ASSIGNED" },
                { label: "IN PROGRESS", value: "IN_PROGRESS" },
                { label: "ON HOLD", value: "ONHOLD" },
                { label: "BREAK", value: "BREAK" },
                { label: "IN REVIEW", value: "IN_REVIEW" },
                { label: "RE-WORK", value: "REWORK" },
                { label: "COMPLETED", value: "COMPLETE" },
                { label: "VALIDATE & COMPLETED", value: "VALIDATE_COMPLETE" },
                {
                  label: "COMPLETED(TECHNICAL ISSUE)",
                  value: "COMPLETE_OTHER",
                },
              ]}
              className="w-full"
              defaultValues={task?.status}
              {...register("status")}
              onChange={setValue}
            />
            {errors.status && (
              <p className="text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="">
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
              defaultValues={task?.priority}
              {...register("priority")}
              onChange={setValue}
            />
          </div>

          <Input
            label="Start Date:"
            name="start_date"
            type="date"
            className="w-full "
            defaultValues={task?.start_date}
            {...register("start_date")}
          />

          <Input
            label="Due Date:"
            name="due_date"
            type="date"
            className="w-full "
            defaultValues={task?.due_date}
            {...register("due_date")}
          />

          <Button
            type="submit"
            className="w-full text-lg bg-teal-100 text-teal-500 border-2 border-teal-500 hover:bg-teal-500 hover:text-white"
          >
            Update Project
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
