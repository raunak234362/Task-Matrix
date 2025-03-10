/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../../../../store/taskSlice";
import { fetchTeam } from "../../../../store/projectSlice";
import Service from "../../../../api/configAPI";
import Input from "../../../fields/Input";
import { CustomSelect, Button } from "../../../index";
import { toast } from "react-toastify";

/* eslint-disable react/prop-types */
const EditTask = ({ onClose, task }) => {
  // console.log(task);
  const taskDetail = task[0];
  const dispatch = useDispatch();
  const [assignedUser, setAssignedUser] = useState([]);
  console.log("TASK-=-==-=-=-=-=-=", taskDetail);
  const [defaultHour, defaultMin] = (taskDetail?.duration ?? "00:00").split(":").slice(0, 2);

const { register, handleSubmit,watch, formState: { errors }, setValue } = useForm({
  defaultValues: {
    name: taskDetail?.name || "",
    description: taskDetail?.description || "",
    duration: taskDetail?.duration || "",
    start_date: taskDetail?.start_date || "",
    due_date: taskDetail?.due_date || "",
    status: taskDetail?.status || "",
    hour: defaultHour,  // Ensure hour is set
    min: defaultMin,    // Ensure minutes are set
  },
});

  console.log("TASK-=-=-=-=-=-=-=-", taskDetail);
  const teams = useSelector(
    (state) =>
      state?.projectData?.teamData?.filter(
        (team) => team.id === taskDetail?.project?.teamID,
      ) || [],
  );
  console.log("STAFF-=-=-=-=-=-=-=-", teams);

  const team = teams[0];

  const teamData = useSelector((state) =>
    state?.projectData?.teamData.find(
      (team) => team.id === taskDetail?.project?.teamID,
    ),
  );
  const staffData = useSelector((state) => state?.userData?.staffData) || [];
  // const processTeamMembers = () => {
  //   try {
  //     if (!teamData) {
  //       console.log("No team data available");
  //       return;
  //     }

  //     console.log("Team members processed:", assigned);
  //     setAssignedUser(assigned);
  //   } catch (error) {
  //     console.error("Error processing team members:", error);
  //   }
  // };

  const assigned = teamData?.members?.reduce((acc, member) => {
    const exists = acc?.find((item) => item?.value === member?.id);
    console.log("EXISTS-=-=-=-=-=-=-=-", member);
    if (!exists) {
      acc.push({
        label: `${member?.role} - ${staffData.find((staff) => staff.id === member.id)?.f_name} ${staffData.find((staff) => staff.id === member.id)?.m_name} ${staffData.find((staff) => staff.id === member.id)?.l_name}`,
        value: member?.id,
      });
    }
    return acc;
  }, []);

  console.log("ASSIGNED-=-=-=-=-=-=-=-", assigned);
  // useEffect(() => {
  //   processTeamMembers();
  // }, [teamData]);

  const onSubmit = async (data) => {
    console.log("Data: +++++++++++++++", data);
    try {
      // Ensure hour and min have default values if empty
      const durationHour = data.hour ? data.hour : "00";
      const durationMin = data.min ? data.min : "00";

      // Combine type and taskname into name field
      const taskData = {
        ...data,
        name: data?.type ? `${data?.type} - ${data?.taskname}` : data?.name,
        user_id: data?.user,
        duration: `${durationHour}:${durationMin}:00`, // Ensuring default values
      };

      // Remove unnecessary fields before sending to backend
      delete taskData.type;
      delete taskData.taskname;
      delete taskData.hour;
      delete taskData.min;

      const updatedTask = await Service.editTask(taskDetail?.id, taskData);
      toast.success("Successfully Updated Task: ", updatedTask);
      dispatch(updateTask(updatedTask));
    } catch (error) {
      toast.error(error);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[65vh] overflow-x-auto p-5 rounded-lg shadow-lg w-full md:w-[50vw] ">
        <div className="flex justify-between my-5 bg-teal-200/50 p-2 rounded-lg">
          <h2 className="text-2xl font-bold">Edit Task</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div>
          {console.log(teamData)}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-2">
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
                  { label: "Checking", value: "CHECKING" },
                  { label: "Erection", value: "ERECTION" },
                  { label: "Detailing", value: "DETAILING" },
                  { label: "Others", value: "OTHERS" },
                ]}
                {...register("type")}
                onChange={setValue}
              />
            </div>
            <div className="my-2">
              <Input
                name="taskname"
                label="Task Name: "
                placeholder="Task Name"
                defaultValues={task?.name?.split(" - ")[1]}
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
            </div>
            <div className="my-2">
              <CustomSelect
                label="Current User:"
                name="user"
                options={team?.members?.map((member) => ({
                  label: `${member?.role} - ${staffData.find((staff) => staff.id === member.id)?.f_name} ${staffData.find((staff) => staff.id === member.id)?.m_name} ${staffData.find((staff) => staff.id === member.id)?.l_name}`,
                  value: member?.id,
                }))}
                className="w-full"
                defaultValues={task?.assignedUser}
                {...register("user")}
                onChange={setValue}
              />
            </div>
            <div className="my-2">
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
            <div className="mt-1">
              <div className="text-lg font-bold">Duration:</div>
              <div className="flex flex-row w-1/5 gap-5">
                <div className="w-full">
                  <Input
                    type="number"
                    name="hour"
                    label="HH"
                    defaultValues={task?.duration}
                    placeholder="HH"
                    className="w-20"
                    min={0}
                    {...register("hour")}
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
                    {...register("min")}
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
            <div className="my-2">
              <CustomSelect
                label="Status:"
                name="status"
                options={[
                  { label: "ASSIGNED", value: "ASSIGNED" },
                  { label: "IN PROGRESS", value: "IN-PROGRESS" },
                  { label: "ON HOLD", value: "ON-HOLD" },
                  { label: "BREAK", value: "BREAK" },
                  { label: "IN REVIEW", value: "IN-REVIEW" },
                  { label: "COMPLETED", value: "COMPLETE" },
                  { label: "APPROVED", value: "APPROVED" },
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
            <div className="my-2">
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

            <div className=" w-full my-2">
              <Input
                label="Start Date:"
                name="start_date"
                type="date"
                className="w-full"
                defaultValues={task?.start_date}
                {...register("start_date")}
              />
            </div>
            <div className=" w-full my-2">
              <Input
                label="Due Date:"
                name="due_date"
                type="date"
                className="w-full"
                defaultValues={task?.due_date}
                {...register("due_date")}
              />
            </div>

            <Button type="submit">Update Project</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
