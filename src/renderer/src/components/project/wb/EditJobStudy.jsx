/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button } from "../../index";
import Service from "../../../config/Service";

const EditJobStudy = ({ jobStudy, onClose }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      description: jobStudy.description,
      QtyNo: jobStudy.QtyNo,
      unitTime: jobStudy.unitTime,
      execTime: jobStudy.execTime,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await Service.updateJobStudy(jobStudy.id, {
        description: data.description,
        QtyNo: Number(data.QtyNo),
        unitTime: Number(data.unitTime),
        execTime: Number(data.execTime),
      });
      console.log("Updated Job Study:", response);
      onClose();
    } catch (error) {
      console.error("Error updating job study:", error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="font-bold">Edit Job Study</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label>Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </div>
        <div className="mb-4">
          <label>Quantity</label>
          <Controller
            name="QtyNo"
            control={control}
            render={({ field }) => <Input type="number" {...field} />}
          />
        </div>
        <div className="mb-4">
          <label>Unit Time</label>
          <Controller
            name="unitTime"
            control={control}
            render={({ field }) => <Input type="number" {...field} />}
          />
        </div>
        <div className="mb-4">
          <label>Execution Time</label>
          <Controller
            name="execTime"
            control={control}
            render={({ field }) => <Input type="number" {...field} />}
          />
        </div>
        <Button type="submit">Save Changes</Button>
        <Button type="button" onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default EditJobStudy; 