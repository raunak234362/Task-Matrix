/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Input, Button } from "../../index";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import Service from "../../../api/configAPI.js";
import toast from "react-hot-toast";
import EditQuantityForm from "./EditQuantityForm";
import AddMoreSubtask from "./AddMoreSubtask.jsx";
import EditUnitTime from "./EditUnitTime";

const SelectedWBTask = ({
  onClose,
  selectedTask,
  selectedTaskId,
  selectedActivity,
  projectId,
  projectStage,
}) => {
  const workBreakdown = useSelector(
    (state) => state?.projectData.workBreakdown
  );
  const [workBD, setWorkBD] = useState("");
  const [subTaskBD, setSubTaskBD] = useState([]);
  const [showTimeFormIndex, setShowTimeFormIndex] = useState(null);
  const [showQuantityFormIndex, setShowQuantityFormIndex] = useState(null); // state to track which subtask is being edited for quantity
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("Selected Stage:", projectStage);
  const fetchWorkBD = async () => {
    const workBreakDown = workBreakdown.find(
      (wb) => wb.taskName === selectedTask
    );
    setWorkBD(workBreakDown);
  };

  const fetchSubTasks = async () => {
    const subTasks = await Service.allSubTasks(projectId, selectedTaskId, projectStage);
    setSubTaskBD(subTasks);
  };

  useEffect(() => {
    fetchSubTasks();
    fetchWorkBD();
  }, []);

  const handleTimeUpdateClick = (index) => {
    setShowTimeFormIndex(index);
  };

  const handleQuantityUpdateClick = (index) => {
    setShowQuantityFormIndex(index);
  };

  const handleSaveUpdatedSubtask = (updatedData) => {
    const updatedSubTasks = [...subTaskBD];
    updatedSubTasks[showTimeFormIndex] = {
      ...updatedSubTasks[showTimeFormIndex],
      ...updatedData,
    };
    setSubTaskBD(updatedSubTasks);
  };

  const handleSaveUpdatedQuantity = (updatedData) => {
    const updatedSubTasks = [...subTaskBD];
    updatedSubTasks[showQuantityFormIndex] = {
      ...updatedSubTasks[showQuantityFormIndex],
      ...updatedData,
    };
    setSubTaskBD(updatedSubTasks);
  };


  const userType = sessionStorage.getItem("userType");
  const isAdmin = userType === "admin"


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full p-2 bg-white rounded-lg shadow-lg h-fit md:p-5 md:w-[60%] lg:w-[50%]">
        <div className="flex flex-row justify-between ">
          <Button className="bg-red-500" onClick={() => onClose(true)}>
            Close
          </Button>
        </div>

        <div className="flex flex-row items-center justify-center">
          <div>
            <b>Selected Task:</b>{" "}
            {workBD?.task?.find((task) => task.id === selectedTaskId)?.name}
          </div>
        </div>

        <div className="pt-10 bg-white h-[60vh] overflow-auto rounded-lg">
          <table className="w-full text-sm text-center border border-collapse border-gray-600">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-2 py-1 border border-gray-600 ">Sub-Task</th>
                <th className="px-2 py-1 border border-gray-600 ">Qty</th>
                <th className="px-2 py-1 border border-gray-600">
                  Execution Hours
                </th>
                <th className="px-2 py-1 border border-gray-600">
                  Checking Hours
                </th>
                <th className="px-2 py-1 border border-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {subTaskBD.map((subTask, index) => (
                <tr key={subTask.id}>
                  <td className="px-2 py-1 border border-gray-600">
                    {subTask.description}
                  </td>

                  <td className="px-2 py-1 border border-gray-600">
                    {subTask.QtyNo}
                  </td>

                  <td className="px-2 py-1 border border-gray-600">
                    {(subTask.execHr / 60).toFixed(2)}
                  </td>

                  <td className="px-2 py-1 border border-gray-600">
                    {(subTask.checkHr / 60).toFixed(2)}
                  </td>

                  <td className="flex gap-2 py-1 border border-gray-600 x-2">
                    {/*if admin show update unittime or else show edit quantity*/}
                    {isAdmin ? (
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          onClick={() => handleTimeUpdateClick(index)}
                          className="text-white bg-blue-500"
                        >
                          Update Time
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleQuantityUpdateClick(index)}
                          className="text-white bg-blue-500"
                        >
                          Edit Quantity
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => handleQuantityUpdateClick(index)}
                        className="text-white bg-blue-500"
                      >
                        Edit Quantity
                      </Button>
                    )}
                    {/* <Button
                      type="button"
                      onClick={() => handleTimeUpdateClick(index)}
                      className="text-white bg-blue-500"
                    >
                      Update Time
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleQuantityUpdateClick(index)}
                      className="text-white bg-blue-500"
                    >
                      Edit Quantity
                    </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-5 text-white bg-teal-600 w-[100%] ml-2"
          >
            Add More Subtask
          </Button>
        </div>
      </div>
      {/*to update unit time*/}
      {showTimeFormIndex !== null && (
        <EditUnitTime
          subTask={subTaskBD[showTimeFormIndex]}
          onClose={() => setShowTimeFormIndex(null)}
          onSave={handleSaveUpdatedSubtask}
        />
      )}
      {/*to update quantity*/}
      {showQuantityFormIndex !== null && (
        <EditQuantityForm
          subTask={subTaskBD[showQuantityFormIndex]}
          onClose={() => setShowQuantityFormIndex(null)}
          onSave={handleSaveUpdatedQuantity}
        />
      )}
      {/*to add more subtasks*/}
      {isModalOpen && (
        <AddMoreSubtask
          handleClose={() => setIsModalOpen(false)}
          selectedTaskId={selectedTaskId}
          projectId={projectId}
          fetchSubTask={fetchSubTasks}
          projectStage={projectStage}
        />
      )}
    </div>
  );
};

export default SelectedWBTask;

