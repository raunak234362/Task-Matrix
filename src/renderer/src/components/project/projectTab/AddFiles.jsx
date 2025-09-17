/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Service from "../../../api/configAPI";
import MultipleFileUpload from "../../fields/MultipleFileUpload";
import Button from "../../fields/Button";

const AddFiles = ({ projectId, onUpdate }) => {
  const [fileData, setFileData] = useState([]);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFilesChange = (updatedFiles) => {
    console.log(updatedFiles);
    setFileData(updatedFiles);
  };

  //   const handleFileChange = (e) => {
  //     const file = e.target.files;

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       csv_upload: file,
  //     }));
  //   };

  const onSubmit = async () => {;
    const formData = new FormData();

    // Ensure data?.files is an array and has files
    if (fileData?.length) {
      // Append files to FormData
      for (let i = 0; i < fileData.length; i++) {
        console.log("File data:", fileData[i]);
        formData.append("files", fileData[i]);
      }

      // Log the formData content by iterating over its entries
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      try {
        const response = await Service.addProjectFile(formData, projectId);
        onUpdate();
        toast.success("Files uploaded successfully");
        console.log("Files uploaded successfully:", response);
      } catch (error) {
        toast.error("Error uploading files");
        console.error("Error uploading files:", error);
      }
    } else {
      console.error("No files to upload.");
    }
  };

  return (
    <div className="my-5 overflow-y-auto h-1/3">
      <div className="w-full rounded-lg shadow-lg bg-teal-200/30 md:p-2 ">
        <div className="flex justify-center w-full my-2 font-bold">
          Upload Files
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <Input
            type="file"
            name="files"
            label="Upload Files"
            placeholder="Upload Files"
            size="lg"
            accept=" image/* .zip .rar .iso"
            {...register("files")}
          /> */}
          <MultipleFileUpload
            label="Select Files"
            onFilesChange={onFilesChange}
            files={fileData}
            accept="image/*,application/pdf,.pdf,.pptx, .doc,.docx"
            {...register("files")}
          />
          {errors.files && (
            <div className="text-red-500">This field is required</div>
          )}
          <div className="flex justify-center w-full my-2">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFiles;
