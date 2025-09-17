/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Input,
  CustomSelect,
  Button,
} from "../../index";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Service from "../../../api/configAPI";
import JobStudy from "./JobStudy";
import SelectedWBTask from "./SelectedWBTask";
const AddWB = ({ projectId, projectData }) => {
  const [project, setProject] = useState({});
  const [selectedTaskData, setSelectedTaskData] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const projectDetails = useSelector((state) => state?.projectData.projectData);
  const [wbActivity, setWBActivity] = useState();
  const [totalHours, setTotalHours] = useState();
  const [wbTotalHours, setWBTotalHours] = useState();
  const [projectStage, setProjectStage] = useState(null);
  const workBreakdown = useSelector(
    (state) => state?.projectData.workBreakdown
  );
  const { register, handleSubmit, watch, setValue } = useForm();
  const selectedTask = watch("taskName");
  const selectedStage = watch("stage");
  const fetchWBActivity = async () => {
    if (selectedTask || selectedStage) {
      // const wbData = await Service.fetchWorkBreakdownActivity(selectedTask, projectId, selectedStage);
      // setWBActivity(wbData);
    }
  };

  const fetchWBTotalHours = async () => {
    const totalHours = await Service.fetchWorkBreakdownHours(
      selectedTask,
      projectId,
      selectedStage
    );
    setWBTotalHours(totalHours?._sum || {});
  }


  const fetchTotalHours = async () => {
    const totalHours = await Service.fetchWorkBreakdownTotalHours(
      projectId,
      selectedStage
    );
    console.log("Total Hours:", totalHours);
    const exec = totalHours?._sum?.totalExecHr;
    const check = totalHours?._sum?.totalCheckHr;
    setTotalHours(check + exec);
    // setWBTotalHours(totalHours?._sum || {});
  }
  const EstimatedHr = projectData?.estimatedHours * 60
  // console.log(EstimatedHr);
  console.log(totalHours);
  // console.log(Estimate`dHr- totalHours);
  const percentage =
    EstimatedHr && Number(EstimatedHr) !== 0
      ? parseFloat(((Number(EstimatedHr - totalHours) / (Number(EstimatedHr)) * 100) / 63).toFixed(2))
      : 0;
  // console.log("Percentage of Total Hours:", percentage);
  useEffect(() => {
    fetchTotalHours();
  }, [selectedStage]);
  useEffect(() => {
    fetchWBTotalHours();
  }, [selectedTask, selectedStage]);
  useEffect(() => {
    fetchWBActivity();
  }, [selectedTask, selectedStage]);

  const fetchProject = async () => {
    const project = projectDetails.find((project) => project.id === projectId);
    setProjectStage(project?.stage);
    setProject(project || {});
  };
  console.log("Project Data:", projectStage);

  // Initial fetch for project and work breakdown
  useEffect(() => {
    fetchProject();
  }, [projectId]);


  // Update selected task data when task changes
  useEffect(() => {
    const selectedTaskDetails = workBreakdown.find(
      (item) => item?.taskName === selectedTask
    )?.workBreakdown;
    setSelectedTaskData(selectedTaskDetails);
  }, [selectedTask, workBreakdown]);

  // Handle opening the selected WB task by setting its ID
  const handleSelectedWB = (id) => {
    console.log(id);
    setSelectedTaskId(id);
    setSelectedActivity(selectedTask);
  };

  // Handle closing the selected WB task
  const handleSelectedWBClose = () => {
    setSelectedTaskId(null);
  };

  const userType = sessionStorage.getItem("userType");
  console.log("User Type:", userType);
  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white h-[90%] md:p-5 p-2 rounded-lg shadow-lg md:w-full w-11/12">

      <div className="z-10 flex justify-center w-full top-2">
        <div className="px-3 py-2 font-bold text-white bg-teal-400 rounded-lg shadow-md md:px-4 md:text-2xl">
          Work-Break Down Structure
        </div>
      </div>
      <div className="h-[85%] w-full overflow-y-auto">
        <JobStudy projectId={projectId} />

        <div className="mt-10 font-semibold">Work Breakdown Structure -</div>
        <div className="flex justify-center py-5">
          <div className="overflow-x-auto md:w-[80vw] w-full my-3">
            <p className="text-red-500 text-xs">*Select the task type as well as stage to overview</p>
            <div className="flex flex-row-[40%,50%] gap-5 w-full justify-between">
              <div className="w-full">
                <CustomSelect
                  label="WBS - Type"
                  color="blue"
                  options={[
                    { label: "Modeling", value: "MODELING" },
                    { label: "Detailing", value: "DETAILING" },
                    { label: "Erection", value: "ERECTION" },
                  ]}
                  {...register("taskName", { required: true })}
                  onChange={setValue}
                />
              </div>
              <div className="w-full">
                <CustomSelect
                  label="WBS - Stage"
                  color="blue"
                  options={[
                    { label: "RFI", value: "RFI" },
                    { label: "IFA", value: "IFA" },
                    { label: "BFA", value: "BFA" },
                    { label: "BFA-Markup", value: "BFA_M" },
                    { label: "RIFA", value: "RIFA" },
                    { label: "RBFA", value: "RBFA" },
                    { label: "IFC", value: "IFC" },
                    { label: "BFC", value: "BFC" },
                    { label: "RIFC", value: "RIFC" },
                    { label: "REV", value: "REV" },
                    { label: "CO#", value: "CO#" },
                  ]}
                  {...register("stage", { required: true })}
                  onChange={setValue}
                />
              </div>
            </div>
            <div>
              <div className="flex flex-row justify-between">
                <div className="text-sm font-semibold text-gray-600">
                  {console.log("Selected Task:", wbTotalHours)}
                  Total Execution Hours: {wbTotalHours?.totalExecHr ? ((wbTotalHours.totalExecHr) / 60).toFixed(2) : "0"} Hr
                  <br />
                  Total Checking Hours: {wbTotalHours?.totalCheckHr ? ((wbTotalHours.totalCheckHr) / 60).toFixed(2) : "0"} Hr
                  <br />
                  Total Quantity: {wbTotalHours?.totalQtyNo ? wbTotalHours.totalQtyNo : "0"}
                </div>
                {/* <Button
                    className="bg-blue-500"
                    onClick={() => fetchWBActivity()}
                  >
                    Fetch WBS
                  </Button> */}
              </div>
            </div>
            <div className="mt-5 bg-whiall-projectste h-[60vh] overflow-auto rounded-lg">
              <table className="w-full mt-3 text-sm text-center border border-collapse border-gray-600">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-2 py-1 border border-gray-600">S.No</th>
                    <th className="px-2 py-1 border border-gray-600">
                      Description of WBS
                    </th>
                    {userType === "admin" || userType === "department-manager" ? (
                    <th className="px-2 py-1 border border-gray-600">
                      Qty. (No.)
                    </th>
                    ):null}
                    <th className="px-2 py-1 border border-gray-600">
                      Execution Time (Hr)
                    </th>
                    <th className="px-2 py-1 border border-gray-600">
                      Checking Time (Hr)
                    </th>
                    {userType === "admin" || userType === "department-manager" ? (
                      <>
                        <th className="px-2 py-1 border border-gray-600">
                          Execution including <br /> rework Time (Hr)
                        </th>
                        <th className="px-2 py-1 border border-gray-600">
                          Checking including <br /> rework Time (Hr)
                        </th>
                        <th className="px-2 py-1 border border-gray-600">
                          Actions
                        </th>
                      </>
                    ) : null}
                  </tr>
                </thead>

                <tbody>
                  {wbActivity?.map((taskItem, index) => (
                    <tr key={index} className="bg-green-100">
                      <td className="px-2 py-1 border border-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-2 py-1 border border-gray-600">
                        {taskItem?.name}
                      </td>
                      {userType === "admin" || userType === "department-manager" ? (
                        <td className="px-2 py-1 border border-gray-600">
                          {taskItem?.totalQtyNo}
                        </td>
                      ):null}

                      <td className="px-2 py-1 border border-gray-600">
                        {(taskItem?.totalExecHr / 60).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 border border-gray-600">
                        {(taskItem?.totalCheckHr / 60).toFixed(2)}
                      </td>
                      {userType === "admin" || userType === "department-manager" ? (
                        <>
                          <td className="px-2 py-1 border border-gray-600">
                            {Math.max(0, ((taskItem?.totalExecHr * percentage) / 60)).toFixed(2)}
                          </td>
                          <td className="px-2 py-1 border border-gray-600">
                            {Math.max(0, ((taskItem?.totalCheckHr * percentage) / 60)).toFixed(2)}
                          </td>
                          <td className="px-2 py-1 border border-gray-600">
                            <Button
                              onClick={() => handleSelectedWB(taskItem?.id)}
                            >
                              Open
                            </Button>
                          </td>
                        </>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedTaskId && (
        <SelectedWBTask
          projectId={projectId}
          projectStage={selectedStage}
          selectedTaskId={selectedTaskId}
          selectedTask={selectedTask}
          selectedActivity={selectedActivity}
          onClose={handleSelectedWBClose}
        />
      )}
    </div>
    // </div>
  );
};

export default AddWB;
