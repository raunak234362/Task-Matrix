/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateTask } from "../../../../store/taskSlice";
import Service from "../../../../api/configAPI";
import Input from "../../../fields/Input";
import { CustomSelect } from "../../..";

/* eslint-disable react/prop-types */
const EditTask = ({ onClose, task }) => {
  const dispatch = useDispatch();
  const [taskData, setTaskData] = useState(null);

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
      startDate: task?.startDate || "",
      endDate: task?.endDate || "",
      status: task?.status || "",
      stage: task?.stage || "",
      manager: task?.manager?.id || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const updatedTask = await Service.editTask(task?.id, data);
      dispatch(updateTask(updatedTask));
      console.log("Successfully Updated Task: ", updatedTask);
    } catch (error) {
      console.log(error);
    }
    onClose();
  };
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
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-5 flex flex-row gap-x-2">
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
                    { label: "Checking", value: "CHECKING" },
                    { label: "Erection", value: "ERECTION" },
                    { label: "Detailing", value: "DETAILING" },
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
