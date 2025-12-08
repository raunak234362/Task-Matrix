/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  CustomSelect,
  Button,
  Toggle,
  MultipleFileUpload,
} from "../index";
import JoditEditor from "jodit-react";
import socket from "../../socket";
import toast, { Toaster } from "react-hot-toast";
import Service from "../../api/configAPI";
import { showClient } from "../../store/fabricatorSlice";

const AddSubmittals = ({ projectData }) => {
  const project = projectData || {};
  const fabricatorID = project?.fabricatorID;
  const projectID = project?.id;
  console.log("Project Data:", project);
  const [joditContent, setJoditContent] = useState("");
  //   const projectData = useSelector((state) => state.projectData.projectData);
  const fabricatorData = useSelector(
    (state) => state?.fabricatorData?.fabricatorData
  );
  const joditConfig = {
    height: 100,
    width: "100%",
    placeholder: "Enter notes with rich formatting...",
    enter: "p", // Use paragraph as default block element
    processPasteHTML: true,
    askBeforePasteHTML: false,
    defaultActionOnPaste: "custom",
    link: {
      processPastedLink: true,
      openInNewTabCheckbox: true,
      noFollowCheckbox: true,
    },
    defaultValue: "", // Start with empty content
    removeEmptyBlocks: true, // Prevent empty <p><br></p>
    cleanHTML: {
      removeEmptyElements: true, // Additional cleanup for empty elements
    },
  };
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);
  console.log(clientData);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchClients = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const client = await Service.allClient(token);
        dispatch(showClient(client));
      } catch (error) {
        console.error("Failed to fetch clients", error);
      }
    };
    fetchClients();
  }, [dispatch]);

  console.log(projectData);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [files, setFiles] = useState([]);

  const recipientID = watch("recipient_id");
  console.log("Selected Recipient ID:", recipientID);
  const selectedFabricator = fabricatorData?.find(
    (fabricator) => fabricator.id === fabricatorID
  );
  const clientName = selectedFabricator
    ? clientData?.find((client) => client.id === selectedFabricator.clientID)
      ?.name
    : "";
  console.log("Client Name:", clientName);

  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };

  const filteredClients = clientData?.filter(
    (client) => client.fabricatorId === fabricatorID
  );
  console.log("Filtered Clients:", filteredClients);
  const clientOptions = filteredClients?.map((client) => ({
    label: `${client.f_name} ${client.l_name}`,
    value: client.id,
  }));

  //   const filteredProjects = projectData?.filter(
  //     (project) => project.fabricatorID === fabricatorID
  //   );
  //   console.log("Filtered Projects:", filteredProjects);
  //   const projectOptions = filteredProjects?.map((project) => ({
  //     label: project.name,
  //     value: project.id,
  //   }));

  const CreateSubmittals = async (data) => {
    const formData = new FormData();

    // Append files
    files?.map((file) => {
      formData.append("files", file);
      console.log("File:", formData?.append);
    });

    const submittalData = {
      ...data,
      project_id: projectID,
      files,
      recepient_id: recipientID,
      fabricator_id: fabricatorID,
    };
    console.log("Sending Data:", submittalData); // Debugging

    try {
      const response = await Service.addSubmittal(submittalData);
      toast.success("Submittal created successfully");
      console.log("Submittal created successfully:", response);
      if (response.user) {
        socket.emit("sendNotification", {
          userId: response.user, // should be the assigned user's ID
          message: `📌 New Task Assigned: ${projectData.name}`,
          title: "New Task",
        });
      }
    } catch (error) {
      toast.error("Error creating Submittal");
      console.error("Error creating Submittal:", error);
    }
  };

  return (
    <>
      <div className="h-fit">
        <div className="overflow-auto max-h-[70%]">
          <Toaster />
          <div className="flex justify-center w-full my-5 text-black">
            <div className="w-full h-full px-2 py-3 overflow-y-auto md:px-10">
              <form onSubmit={handleSubmit(CreateSubmittals)}>
                <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                  Client Information:
                </div>
                <div className="px-1 my-2 md:px-2">
                  <div className="w-full my-3">
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
                    {errors.recipients && <div>This field is required</div>}
                  </div>
                </div>
                <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                  Details:
                </div>
                <div className="px-1 my-2 md:px-2">
                  <div className="w-full my-3">
                    <Input
                      label="Subject/Remarks:"
                      placeholder="Subject/Remarks"
                      size="lg"
                      color="blue"
                      {...register("subject")}
                    />
                  </div>
                  <div className="w-full my-3">
                    <JoditEditor
                      value={joditContent}
                      config={joditConfig}
                      onBlur={(newContent) => {
                        setJoditContent(newContent);
                        setValue("description", newContent, {
                          shouldValidate: true,
                        });
                      }}
                      className="w-full border border-gray-300 rounded-md"
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

                <div className="w-full my-5">
                  <Button type="submit">Send Message</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSubmittals;
