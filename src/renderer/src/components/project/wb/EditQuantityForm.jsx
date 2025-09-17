/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Input, Button } from "../../index";
import toast from "react-hot-toast";
import Service from "../../../api/configAPI";

const EditQuantityForm = ({ subTask, onClose, onSave }) => {
  const [quantityFormData, setQuantityFormData] = useState({
    qty: subTask.QtyNo || "",
    unittime: subTask.unitTime || "",
    checkunittime: subTask.CheckUnitTime || "",
  });

  useEffect(() => {
    setQuantityFormData({
      qty: subTask.QtyNo || "",
      unittime: subTask.unitTime || "",
      checkunittime: subTask.CheckUnitTime || "",
    });
  }, [subTask]);

  const handleQuantityChange = (e) => {
    const { name, value } = e.target;
    setQuantityFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantitySave = async () => {
    const updated = { ...subTask };
    const qty = parseFloat(quantityFormData.qty) || 0;
    const unitTime = parseFloat(quantityFormData.unittime) || 0;
    const checkUnitTime = parseFloat(quantityFormData.checkunittime) || 0;

    const body = {
      QtyNo: qty,
      unitTime: unitTime,
      CheckUnitTime: checkUnitTime,
      execHr: parseFloat((qty * unitTime).toFixed(2)),
      checkHr: parseFloat((qty * checkUnitTime).toFixed(2)),
    };

    try {
      await Service.editOneSubTask(updated.id, body);
      onSave(body);
      toast.success("Quantity updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 shadow-xl w-[90%] max-w-md">
        <h2 className="mb-4 text-xl font-bold">Update Quantity for Subtask</h2>
            <div className="flex flex-col gap-2">
            <label className="text-sm font-normal">Quantity:</label>
          <Input
            type="number"
            name="qty"
            value={quantityFormData.qty}
            onChange={handleQuantityChange}
            placeholder="Quantity"
          />
          {/* <Input
            type="number"
            name="unittime"
            value={quantityFormData.unittime}
            onChange={handleQuantityChange}
            placeholder="Unit Time"
          />
          <Input
            type="number"
            name="checkunittime"
            value={quantityFormData.checkunittime}
            onChange={handleQuantityChange}
            placeholder="Check Unit Time"
          /> */}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button className="bg-green-500" onClick={handleQuantitySave}>
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

export default EditQuantityForm;
