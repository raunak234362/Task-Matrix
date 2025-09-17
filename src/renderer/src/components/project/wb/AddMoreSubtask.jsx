/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "../../fields/Button";
import toast from "react-hot-toast";
import Service from "../../../api/configAPI";


const AddMoreSubtask = ({
  handleClose,
  selectedTaskId,
  projectId,
  fetchSubTask,
  projectStage,
}) => {
  const { register, handleSubmit, control, setValue, watch, reset } = useForm();
  const [subtasks, setSubtask] = useState([]);
  const stage = projectStage
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data) => {
    console.log("Form data:", data);

    try {
      const addMoreSubtask = {
        ...data,
        stage:stage,
        unitTime: parseFloat(data.unitTime),
        CheckUnitTime: parseFloat(data.CheckUnitTime),
      };
      console.log(addMoreSubtask);
      await Service.addOneSubTask(projectId, selectedTaskId, addMoreSubtask);
      toast.success("Work breakdown data added successfully!");
      const newSubtask = {
        id: subtasks.length + 1,
        description: data.description,
        unitTime: parseFloat(data.unitTime),
        CheckUnitTime: parseFloat(data.CheckUnitTime),
      };
      fetchSubTask();
      setSubtask((prevSubtasks) => [...prevSubtasks, newSubtask]);
      setIsSubmitted(true); // Prevent further edits
      reset(); // Reset form fields
    } catch (error) {
      toast.error("Error adding work breakdown data");
    }
  };

  const handleAddSubtask = () => {
    console.log("Subtask added");
    //to display in the same table
  };
  const [index, setIndex] = useState(1);

  const fetchSubTasks = async () => {
    const subTasks = await Service.addOneSubTask(projectId, selectedTaskId);
    // fwefwf(subTasks);
    console.log(subTasks);
  };
  useEffect(() => {
    fetchSubTasks();
  }, []);
  useEffect(() => {
    setIndex(subtasks.length + 1);
  }, [subtasks]);

  const [click, setClick] = useState(false);

  return (
    <>
      <div className="p-5 m-5 rounded-lg shadow-lg w-[40%] bg-white lg:w-[40%]">
        <div className="flex flex-row justify-between">
          <Button className="bg-red-500" onClick={handleClose}>
            Close
          </Button>
        </div>
        <div className="pt-10 bg-white h-[60vh] overflow-auto rounded-lg">
          <form
            className="flex flex-col gap-y-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <table className="w-full text-sm text-center border border-collapse border-gray-600">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 border border-gray-600">SL.No</th>
                  <th className="px-2 py-1 border border-gray-600">
                    Description
                  </th>
                  <th className="px-2 py-1 border border-gray-600">
                    Unit Time
                  </th>
                  <th className="px-2 py-1 border border-gray-600">
                    Checking Unit Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border border-gray-600">{index}</td>
                  <td className="px-2 py-1 border border-gray-600">
                    <Controller
                      name="description"
                      control={control}
                      defaultValue=""
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input
                          type="text"
                          placeholder="Enter description"
                          {...register("description")}
                        />
                      )}
                    />
                  </td>
                  <td className="px-2 py-1 border border-gray-600">
                    <Controller
                      name="unitTime"
                      control={control}
                      defaultValue="0"
                      render={({ field }) => (
                        <input
                          type="decimal"
                          placeholder="Enter execution hours"
                          {...register("unitTime")}
                        />
                      )}
                    />
                  </td>
                  <td className="px-2 py-1 border border-gray-600">
                    <Controller
                      name="CheckUnitTime"
                      control={control}
                      defaultValue="0"
                      render={({ field }) => (
                        <input
                          type="decimal"
                          placeholder="Enter checking hours"
                          {...register("CheckUnitTime")}
                        />
                      )}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <Button type="submit" className="m-3">
              Add Row
            </Button>
          </form>
          <table className="w-full text-sm text-center border border-collapse border-gray-600">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-2 py-1 border border-gray-600">SL.No</th>
                <th className="px-2 py-1 border border-gray-600">
                  Description
                </th>
                <th className="px-2 py-1 border border-gray-600">Unit Time</th>
                <th className="px-2 py-1 border border-gray-600">
                  Checking Unit Time
                </th>
              </tr>
            </thead>
            <tbody className="px-2 py-1 border border-gray-600">
              {subtasks.map((subtask) => (
                <tr key={subtask.id}>
                  <td className="px-2 py-1 border border-gray-600">
                    {subtask.id}
                  </td>
                  <td className="px-2 py-1 border border-gray-600">
                    {subtask.description}
                  </td>
                  <td className="px-2 py-1 border border-gray-600">
                    {subtask.unitTime}
                  </td>
                  <td className="px-2 py-1 border border-gray-600">
                    {subtask.CheckUnitTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <Button>Edit</Button>
          <table className="w-full text-sm text-center border border-collapse border-gray-600"></table>
        </div>
      </div>
    </>
  );
};

export default AddMoreSubtask;





