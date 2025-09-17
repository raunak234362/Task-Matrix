/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Input, Button } from "../../index";
import { useState } from "react";
import AllJobStudy from "./AllJobStudy";

const AllWorkBreakdown = ({ onClose, projectId }) => {
  console.log(projectId);

  const workBreakdown = useSelector(
    (state) => state?.projectData.workBreakdown
  );

  const handleClose = () => {
    onClose(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[90%] md:p-5 p-2 rounded-lg shadow-lg md:w-5/6 w-11/12">
        <div className="flex flex-row justify-between">
          <Button className="bg-red-500" onClick={handleClose}>
            Close
          </Button>
        </div>
        <div className="top-2 w-full flex justify-center z-10">
          <div className="bg-teal-400 text-white px-3 md:px-4 py-2 md:text-2xl font-bold rounded-lg shadow-md">
            Work-Break Down Structure
          </div>
        </div>
        <div className="h-[85%] overflow-y-auto">
            <AllJobStudy projectId={projectId}/>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default AllWorkBreakdown;
