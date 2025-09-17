/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import MultipleFileUpload from "../../fields/MultipleFileUpload";
import Input from "../../fields/Input";
import Button from "../../fields/Button";
import Service from "../../../api/configAPI";

const ResponseSubmittals = ({ onClose, submittalResponse, submittal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  console.log("ResponseSubmittals component rendered with submittal ID:", submittal);
  const submittalID = submittal.id;
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const handleModalClose = useCallback(() => {
    onClose(false);
    reset();
    setIsSubmitting(false);
    setFiles([]);
  }, [onClose, reset]);

  const onFilesChange = useCallback((updatedFiles) => {
    setFiles(updatedFiles);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      console.log("Submitting Submittal response with data:", data);
      setIsSubmitting(true);
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("description", data.description);

      try {
        await Service.respondSubmittals(submittalID, formData);
        toast.success("Submittal response submitted successfully");
      } catch (err) {
        console.error("Submittal submission error:", err);
        toast.error("Failed to submit Submittal. Please try again.");
      }
    },
    [files, submittalID]
  );

  return (
    <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md">
      <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
        <div className="text-lg font-semibold text-white">Response To Submittal</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <MultipleFileUpload
          label="Upload Files"
          onFilesChange={onFilesChange}
          files={files}
          accept="image/*,application/pdf,.doc,.docx,.pptx"
        />
        <div>
          <Input
            label="Description"
            type="textarea"
            rows={3}
            className="w-full mt-1 rounded-md focus:ring-2 "
            disabled={isSubmitting}
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          // disabled={isSubmitting}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};



export default ResponseSubmittals;
