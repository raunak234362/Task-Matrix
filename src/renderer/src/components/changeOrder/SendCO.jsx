/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Input, CustomSelect, Button, MultipleFileUpload } from "../index";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Service from "../../api/configAPI";
import SendCoTable from "./SendCoTable";

const SendCO = ({ projectData, fetchCO }) => {
  // Step 1 form
  const {
    register,
    handleSubmit,
    setValue,
    getValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  //states
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [click, setClick] = useState(false);

  //projectDetails
  const project = projectData || {};
  const fabricatorID = project.fabricatorID;
  const projectID = project.id;
  console.log(projectData);

  const clientData = useSelector((state) => state?.fabricatorData?.clientData);

  const clientName = clientData?.find(
    (client) => client.id === fabricatorID
  )?.name;
  console.log("Client Name:", clientName);

  const filteredClients = clientData?.filter(
    (client) => client.fabricatorId === fabricatorID
  );
  console.log("Filtered Clients:", filteredClients);
  const clientOptions = filteredClients?.map((client) => ({
    label: `${client.f_name} ${client.l_name}`,
    value: client.id,
  }));
  // File upload handler
  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };
  const [dataCO, setDataCO] = useState();
  console.log(dataCO);
  // Step 1 form  submission handler
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const formData = new FormData();

      // Append files
      files?.forEach((file) => {
        formData.append("files", file);
      });
      console.log("Step 1 data:", data);
      const coData = {
        ...data,
        files,
        project_id: projectID,
        recepient_id: data.recipient_id,
        fabricator_id: fabricatorID,
      };
      const response = await Service.addCO(coData);
      console.log("CO created successfully:", response);
      toast.success("CO created successfully");
      // Move to step 2
      setDataCO(response.data);
      setStep(2);
      setSave(true);
      setClick(true);
    } catch (error) {
      toast.error("Error saving details");
      console.error("Error saving details:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [save, setSave] = useState(false);

  return (
    <>
      <div>
        <div className="overflow-x-auto overflow-y-auto h-fit">
          <div className="container w-full py-6 mx-auto ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 bg-white rounded-lg shadow-md "
            >
              {/* Project Information Section */}
              <div className="px-2 py-2 mb-4 font-bold text-white rounded-lg bg-teal-500/50">
                Project Information:
              </div>

              <div className="space-y-4">
                <div className="w-full">
                  <CustomSelect
                    label="Select Recipients:"
                    placeholder="Select Recipients"
                    size="lg"
                    color="blue"
                    options={[
                      { label: "Select Recipients", value: "" },
                      ...clientOptions,
                    ]}
                    {...register("recipient_id", { required: true })}
                    onChange={setValue}
                  />
                  {errors.recipient_id && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="px-2 py-2 mt-6 mb-4 font-bold text-white rounded-lg bg-teal-500/50">
                Details:
              </div>

              <div className="space-y-4">
                <div className="w-full">
                  <Input
                    label="Subject/Remarks:"
                    placeholder="Subject/Remarks"
                    size="lg"
                    color="blue"
                    {...register("remark", { required: true })}
                  />
                  {errors.remark && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div>

                {/* <div className="w-full">
                  <Input
                    type="number"
                    label="Change Order No. CO#"
                    placeholder="CO#"
                    size="lg"
                    color="blue"
                    min="0"
                    {...register("changeOrderNumber", {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.changeOrder && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div> */}

                <div className="w-full">
                  <Input
                    type="textarea"
                    label="Description:"
                    placeholder="Description"
                    size="lg"
                    color="blue"
                    {...register("description")}
                  />
                </div>
              </div>
              <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                Attach Files:
              </div>
              <div className="px-1 my-2 md:px-2">
                <MultipleFileUpload
                  label="Select Files"
                  onFilesChange={onFilesChange}
                  files={files}
                  accept="image/*,application/pdf,.doc,.docx"
                  {...register("files")}
                />
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold"
                >
                  Save & Continue
                </Button>
              </div>
            </form>
            {/* {isModalOpen && <SendCoTable data={dataCO.id} onClose={handleModalClose} />} */}
            {click && save && <SendCoTable data={dataCO} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default SendCO;
