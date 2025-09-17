/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import JoditEditor from "jodit-react";
import Button from "../fields/Button";
import SectionTitle from "../../util/SectionTitle";
import Service from "../../api/configAPI";

const Notes = ({ projectId, toggleForm }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: "",
      stage: "",
    },
  });
  const [notes, setNotes] = useState([]);
  const [joditContent, setJoditContent] = useState(""); // Local state for JoditEditor

  const joditConfig = {
    height: 100,
    width: "100%",
    placeholder: "Enter notes with rich formatting...",
    enter: "p", // Use paragraph as default block element
    defaultValue: "", // Start with empty content
    removeEmptyBlocks: true, // Prevent empty <p><br></p>
    cleanHTML: {
      removeEmptyElements: true, // Additional cleanup for empty elements
    },
  };

 
  const fetchNotes = async () => {
    const response = await Service.getNotesByProjectId(projectId);
    console.log("Fetched Notes:", response.data);
    setNotes(response.data);
  };

 const onSubmit = async (data) => {
    try {
      console.log("Form Data:", JSON.stringify(data, null, 2));
      const response = await Service.addNotes(data, projectId);
      console.log("Notes Added:", response);
      setJoditContent(""); // Reset JoditEditor
      setValue("content", ""); // Reset form field
      setValue("stage", ""); // Reset form field
      fetchNotes();
      toggleForm(); // Close form
    } catch (error) {
      console.error("Error adding notes:", error);
      throw new Error("Error creating notes");
    }
  };


  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <div className="max-w-full mx-auto p-6 bg-white rounded-md shadow-md">
        <div className="flex flex-row justify-around items-start mb-4 gap-5">
          <div className="bg-white w-full h-full overflow-y-auto mt-4 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Notes:
                </label>
                <JoditEditor
                  value={joditContent}
                  config={joditConfig}
                  onBlur={(newContent) => {
                    setJoditContent(newContent);
                    setValue("content", newContent, { shouldValidate: true });
                  }}
                  className="w-full border border-gray-300 rounded-md"
                />
                <input
                  type="hidden"
                  {...register("content", { required: "Notes are required" })}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Stage:
                </label>
                <select
                  {...register("stage", {required: "Stage is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Stage</option>
                  {[
                    "RFI",
                    "IFA",
                    "BFA",
                    "BFA_M",
                    "RIFA",
                    "RBFA",
                    "IFC",
                    "BFC",
                    "RIFC",
                    "REV",
                    "CO#",
                  ].map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
                {errors.stage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stage.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-4 py-2 w-full rounded-md hover:bg-green-700 transition duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white w-full h-full overflow-y-auto mt-4 p-6 rounded-lg shadow-md">
           <span className="font-bold text-gray-700">Notes:</span>
            <div>
              {notes?.length === 0 ? (
                <p>No notes available for this project.</p>
              ) : (
                <div className="space-y-6 max-h-[400px] overflow-y-auto">
                  {notes.map((note) => (
                    <div key={note.id} className="border-b bg-gray-50 p-3 rounded-lg shadow-md pb-3">
                      <div className="text-sm font-semibold text-gray-700 mb-1">
                        Stage: {note.stage}
                      </div>
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                      <div className="text-xs text-gray-800 mt-1">
                        Created: {new Date(note.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
