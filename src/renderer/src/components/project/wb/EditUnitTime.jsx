/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Input, Button } from "../../index";
import toast from "react-hot-toast";
import Service from "../../../api/configAPI";

const EditUnitTime = ({ subTask, onClose, onSave }) => {
  const [timeFormData, setTimeFormData] = useState({
    unittime: subTask.unitTime || "",
    checkunittime: subTask.CheckUnitTime || "",
  });

  useEffect(() => {
    setTimeFormData({
      unittime: subTask.unitTime || "",
      checkunittime: subTask.CheckUnitTime || "",
    });
  }, [subTask]);

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTimeFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeFormSave = async () => {
    const updated = { ...subTask };
    const unitTime = parseFloat(timeFormData.unittime) || 0;
    const checkUnitTime = parseFloat(timeFormData.checkunittime) || 0;
    const qty = parseFloat(subTask.QtyNo) || 0;

    const body = {
      unitTime,
      CheckUnitTime: checkUnitTime,
      execHr: parseFloat((qty * unitTime).toFixed(2)),
      checkHr: parseFloat((qty * checkUnitTime).toFixed(2)),
    };

    try {
      await Service.editOneSubTask(updated.id, body);
      onSave(body); 
      toast.success("Time updated successfully");
      onClose(); 
    } catch {
      toast.error("Failed to update time");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 shadow-xl w-[90%] max-w-md">
        <h2 className="mb-4 text-xl font-bold">Update UnitTime for Subtask</h2>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal">Unit Time:</label>
          <Input
            type="number"
            name="unittime"
            value={timeFormData.unittime}
            onChange={handleTimeChange}
            placeholder="Unit Time"
          />
          <label className="text-sm font-normal">Check Unit Time:</label>
          <Input
            type="number"
            name="checkunittime"
            value={timeFormData.checkunittime}
            onChange={handleTimeChange}
            placeholder="Check Unit Time"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button className="bg-green-500" onClick={handleTimeFormSave}>
            Save
          </Button>
          <Button className="bg-red-500" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditUnitTime;
