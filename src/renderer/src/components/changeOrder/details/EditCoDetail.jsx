/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "../../fields/Button";
import Input from "../../fields/Input";
import { CustomSelect } from "../..";
import Service from "../../../api/configAPI";
import toast from "react-hot-toast";

const EditCoDetail = ({ selectedCO, onClose, fetchCO }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      remarks: selectedCO?.remarks || "",
      description: selectedCO?.description || "",
      changeOrder: selectedCO?.changeOrder || "",
      status: selectedCO?.status || "",
    },
  });

  const statusOptions = [
    { value: "ACCEPT", label: "Accept" },
    { value: "REJECT", label: "Reject" },
    { value: "NOT_REPLIED", label: "Waiting For Reply" },
  ];

  const onSubmit = async (data) => {
    // Handle form submission
    console.log("Form Data:", data);
    try {
      const response = await Service.updateCO(selectedCO.id, data);
      console.log(response);
      await fetchCO(); 
      toast.success("Change Order updated successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Change Order");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur">
      <div className="bg-white md:h-fit h-[85%] md:w-5/12 w-11/12 max-w-2xl rounded-2xl shadow-2xl overflow-hidden ring-1 ring-teal-400">
        <div className="sticky top-0 z-10 flex justify-between items-center p-3 bg-gradient-to-r from-teal-500/90 to-teal-300/90 border-b rounded-t-2xl">
          <div className="text-lg text-white font-semibold tracking-wide">
            <span className="font-bold opacity-80">Subject:</span>{" "}
            {selectedCO?.remarks || "N/A"}
          </div>
          <button
            className="p-2 text-gray-600 bg-white/70 rounded-full hover:bg-teal-200 transition-colors border border-teal-200"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="remarks"
                className="block mb-2 text-teal-700 font-medium"
              >
                Remarks
              </label>
              <Input
                type="text"
                id="remarks"
                {...register("remarks")}
                className="w-full border rounded-lg px-4 py-2 bg-white/80 focus:ring-2 focus:ring-teal-400 transition"
                placeholder="Enter remarks..."
              />
              {errors.remarks && (
                <span className="text-xs text-red-500">
                  {errors.remarks.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="changeOrder"
                className="block mb-2 text-teal-700 font-medium"
              >
                Change Order No.
              </label>
              <Input
                type="text"
                id="changeOrder"
                {...register("changeOrder")}
                className="w-full border rounded-lg px-4 py-2 bg-white/80 focus:ring-2 focus:ring-teal-400 transition"
                placeholder="Enter change order number..."
              />
              {errors.changeOrder && (
                <span className="text-xs text-red-500">
                  {errors.changeOrder.message}
                </span>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-teal-700 font-medium"
            >
              Description
            </label>
            <Input
              type="textarea"
              id="description"
              {...register("description")}
              className="w-full border rounded-lg px-2 py-2 bg-white/80 focus:ring-2 focus:ring-teal-400 transition min-h-[40px]"
              placeholder="Describe the change order..."
            />
            {errors.description && (
              <span className="text-xs text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="status"
              className="block mb-2 text-teal-700 font-medium"
            >
              Status
            </label>
            <CustomSelect
              options={statusOptions}
              id="status"
              {...register("status")}
              className="w-full"
              placeholder="Select status"
            />
            {errors.status && (
              <span className="text-xs text-red-500">
                {errors.status.message}
              </span>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 transition transform hover:scale-105"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoDetail;
