/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../../../../store/taskSlice";
import { fetchTeam } from "../../../../store/projectSlice";
import Service from "../../../../api/configAPI";
import Input from "../../../fields/Input";
import { CustomSelect, Button } from "../../../index";

/* eslint-disable react/prop-types */
const EditTask = ({ onClose, task }) => {
  // console.log(task);
  const dispatch = useDispatch();
  const [assignedUser, setAssignedUser] = useState([]);
  console.log("TASK-=-==-=-=-=-=-=", task);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: task?.name || "",
      description: task?.description || "",
      duration: task?.duration || "",
      start_date: task?.start_date || "",
      due_date: task?.due_date || "",
      status: task?.status || "",
    },
  });

  const teamData = useSelector((state) =>
    state?.projectData?.teamData.find(
      (team) => team.id === task?.project?.teamID,
    ),
  );
  const staffData = useSelector((state) => state?.projectData?.staffData);
  console.log("STAFF-=-=-=-=-=-=-=-", staffData);
  useEffect(() => {
    const processTeamMembers = () => {
      try {
        if (!teamData) {
          console.log("No team data available");
          return;
        }

        const assigned = teamData?.members?.reduce((acc, member) => {
          const exists = acc?.find((item) => item?.value === member?.id);
          console.log("EXISTS-=-=-=-=-=-=-=-", exists);
          if (!exists) {
            acc.push({
              label: `${member?.role} - ${member?.id}`,
              value: member?.id,
            });
          }
          return acc;
        }, []);

        console.log("Team members processed:", assigned);
        setAssignedUser(assigned || []);
      } catch (error) {
        console.error("Error processing team members:", error);
      }
    };

    processTeamMembers();
  }, [teamData]);

  const onSubmit = async (data) => {
    console.log("Data: +++++++++++++++", data);
    try {
      // Combine type and taskname into name field
      const taskData = {
        ...data,
        name: data?.type ? `${data?.type} - ${data?.taskname}` : data?.name,
        user_id: task?.user_id
      };

      // Remove type and taskname before sending to backend
      delete taskData.type;
      delete taskData.taskname;

      const updatedTask = await Service.editTask(task?.id, taskData);
      dispatch(updateTask(updatedTask));
      console.log("Successfully Updated Task: ", updatedTask);
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[65vh] overflow-x-auto p-5 rounded-lg shadow-lg w-[40vw] ">
        <div className="flex justify-between my-5 bg-teal-200/50 p-2 rounded-lg">
          <h2 className="text-2xl font-bold">Edit Project</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-2">
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
                options={[{ label: "Select User", value: "" }, ...assignedUser]}
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
            <div className="my-2">
              <CustomSelect
                label="Status:"
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
