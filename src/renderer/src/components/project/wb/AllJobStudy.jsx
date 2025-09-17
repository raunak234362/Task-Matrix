import { useEffect, useState } from "react";
import Service from "../../../config/Service";
import { Button } from "../../index";
import EditJobStudy from "./EditJobStudy";
/* eslint-disable react/prop-types */
const AllJobStudy = ({ projectId }) => {
  const [jobStudy, setJobStudy] = useState([]);
  const [selectedJobStudy, setSelectedJobStudy] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  console.log(projectId);

  useEffect(() => {
    const fetchJobStudy = async () => {
      const response = await Service?.allJobStudy(projectId);
      setJobStudy(response);
      console.log(response);
    };
    fetchJobStudy();
  }, [projectId]);
  

  const handleOpenJobStudy = (jobStudyId) => {
    const job = jobStudy.find((j) => j.id === jobStudyId);
    setSelectedJobStudy(job);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setSelectedJobStudy(null);
  };

  return (
    <div>
      <div className="flex justify-center items-center font-bold">
        Job Study
      </div>
      <div className="md:w-[80vw] overflow-x-auto w-full">
        <table className="w-full border-collapse border border-gray-600 text-center text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-600 px-2 py-1">Sl.No</th>
              <th className="border border-gray-600 px-2 py-1">
                Description of WBS
              </th>
              <th className="border border-gray-600 px-2 py-1">Qty. (No.)</th>
              <th className="border border-gray-600 px-2 py-1">
                Execution Time (Hr)
              </th>
              <th className="border border-gray-600 px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobStudy.map((job, index) => (
              <tr key={job.id}>
                <td className="border border-gray-600 px-2 py-1">
                  {index + 1}
                </td>
                <td className="border border-gray-600 px-2 py-1">
                  {job.description}
                </td>
                <td className="border border-gray-600 px-2 py-1">
                  {job.QtyNo}
                </td>
                <td className="border border-gray-600 px-2 py-1">
                  {job.execTime}
                </td>
                <td className="border border-gray-600 px-2 py-1">
                  <Button onClick={() => handleOpenJobStudy(job.id)}>
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditing && selectedJobStudy && (
        <EditJobStudy jobStudy={selectedJobStudy} onClose={handleCloseEdit} />
      )}
    </div>
  );
};

export default AllJobStudy;
