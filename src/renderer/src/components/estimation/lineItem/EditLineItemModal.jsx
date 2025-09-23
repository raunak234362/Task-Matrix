/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSignals } from "@preact/signals-react/runtime";
import { lineItemGroupsSignal } from "../../../signals";
import Service from "../../../api/configAPI";

const EditLineItemModal = ({ item, isOpen, onClose, onSave }) => {
  useSignals();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: item?.quantity || "",
      remarks: item?.remarks || "",
    },
  });

  // ✅ Reset form when item changes
  useEffect(() => {
    if (item) {
      reset({
        quantity: item.quantity || "",
        remarks: item.remarks || "",
      });
    }
  }, [item, reset]);

  const lineItemID = item?.id;

  const onSubmit = async (data) => {
    const quantityFloat = parseFloat(data.quantity) || 0;
    const responseData = {
      ...data,
      quantity: quantityFloat,
      totalHours: quantityFloat * (item?.hoursPerQty || 0),
    };

    try {
      const response = await Service.updateEstimationTaskLineItemsById(
        lineItemID,
        responseData,
      );
      toast.success("Line item updated successfully!");
      // Update nested line item inside the groups signal
      const groups = lineItemGroupsSignal.value || [];
      lineItemGroupsSignal.value = groups.map((group) => ({
        ...group,
        lineItems: (group.lineItems || []).map((li) =>
          li.id === lineItemID ? { ...li, ...responseData } : li,
        ),
      }));
      onSave?.(lineItemID, responseData); // optional parent update
      onClose();
    } catch (err) {
      toast.error("Failed to update line item.");
      console.error("Error updating line item:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-teal-700 mb-4">
            Edit Line Item
          </h2>
          <button onClick={onClose}>Close</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Quantity */}
          <div>
            <label className="block text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              step="any"
              {...register("quantity", { required: true })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.quantity && (
              <span className="text-red-500 text-sm">Quantity is required</span>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-gray-700 mb-1">Remarks</label>
            <textarea
              {...register("remarks")}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLineItemModal;
