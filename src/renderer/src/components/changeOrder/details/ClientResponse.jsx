/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Service from "../../../api/configAPI";
import toast, { Toaster } from "react-hot-toast";
import MultipleFileUpload from "../../fields/MultipleFileUpload";
import Input from "../../fields/Input";
import { Button, CustomSelect } from "../..";

const ClientResponse = ({ coId, responseId }) => {
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
    const formData = new FormData();
    formData.append("status", data.status);
    formData.append("description", data.reason);
    // formData.append("parentResponseId", responseId);
    files.forEach((file) => formData.append("files", file));
    // const responseData = {
    //   ...data,
    //   files: formData,
    //   parentResponseId: responseId,
    // };
    console.log("RFI Response Data:", formData);
    try {
      await Service.respondCO(coId, formData);
      toast.success("RFQ response submitted successfully");
    } catch (err) {
      console.error("RFQ submission error:", err);
      toast.error("Failed to submit RFQ. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md">
      <Toaster />
      <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
        <div className="text-lg font-semibold text-white">
          Response To Change Order
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmitWithFiles)} className="w-full">
        <div>
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
                { label: "Accept", value: "ACCEPT" },
                { label: "Reject", value: "REJECT" },
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

export default ClientResponse;
