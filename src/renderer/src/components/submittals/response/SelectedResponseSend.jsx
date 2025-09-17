/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useForm, Controller } from "react-hook-form";
import { Button, CustomSelect, Input, MultipleFileUpload } from "../..";
import { useCallback, useState } from "react";
import Service from "../../../api/configAPI";
import { Toaster, toast } from "react-hot-toast";

const SelectedResponseSend = ({ rfiID, responseId }) => {
    console.log("SelectedResponseSend component rendered with rfiID:", rfiID);
    console.log("SelectedResponseSend component rendered with responseId:", responseId);

  const [files, setFiles] = useState([]);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm();
  const onFilesChange = useCallback((updatedFiles) => {
    setFiles(updatedFiles);
  }, []);

  const onSubmitWithFiles = async (data) => {
    console.log("Form data:", files);
    const responseData = {
      ...data,
      files,
      parentResponseId: responseId,
    };
    console.log("RFI Response Data:", responseData);
    try {
      await Service.respondWBTRfi(rfiID, responseData);
      toast.success("RFQ response submitted successfully");
    } catch (err) {
      console.error("RFQ submission error:", err);
      toast.error("Failed to submit RFQ. Please try again.");
    }
  };

  return (
    <div>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmitWithFiles)} className="w-full">
        <div>
          <h2 className="pb-2 mb-6 text-2xl font-extrabold text-teal-600 border-b border-teal-300">
            Send Quation Response
          </h2>
          <div className="w-full mb-4">
            <label className="block mt-2 text-sm font-medium text-gray-700">
              Status
            </label>
            <CustomSelect
              label="status"
              name="status"
              color="blue"
              options={[
                // { label: "Select Status", value: ""},
                { label: "Partial", value: "PARTIAL" },
                { label: "Complete", value: "COMPLETE" },
                { label: "Open", value: "OPEN" },
              ]}
              {...register("status", { required: true })}
              onChange={setValue}
            />
            <label className="block mt-2 text-sm font-medium text-gray-700"></label>
            <MultipleFileUpload
              label="Select Files"
              onFilesChange={onFilesChange}
              files={files}
              accept="image/*,application/pdf,.pdf,.pptx,.txt,.doc,.docx,.webp,.csv,.xlsx,.xls"
            />
            {errors.files && (
              <div className="text-red-500">This field is required</div>
            )}
            <label className="block mt-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              type="textarea"
              placeholder="Please enter the reason(optional)"
              className="w-full border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-teal-400"
              rows={2}
              {...register("reason")}
            />
          </div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default SelectedResponseSend;
