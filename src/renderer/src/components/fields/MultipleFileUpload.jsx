/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

function MultipleFileUpload({ onFilesChange }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array?.from(event.target.files);
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...selectedFiles];
      onFilesChange(updatedFiles); // Update parent component with the new file list
      return updatedFiles;
    });
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles?.filter((_, index) => index !== indexToRemove);
      onFilesChange(updatedFiles); 
      return updatedFiles;
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        Upload Files
      </label>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      <div className="mt-4">
        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <span className="text-sm text-gray-800">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MultipleFileUpload;
