import { useEffect } from "react";
import Service from "../../../api/configAPI";

/* eslint-disable react/prop-types */
const GetEstimation = ({ task, setDisplay }) => {
  const fetchEstimationDetails = async () => {
    try {
      const response = await Service.getEstimationTaskById(task);
      console.log("Estimation details:", response);
    } catch (error) {
      console.error("Error fetching estimation details:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    fetchEstimationDetails();
  }, []);

  function handleClose() {
    setDisplay(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-screen overflow-x-auto mx-5 p-5 rounded-lg shadow-lg w-11/12">
        <div className="sticky top-0 z-10 flex items-center justify-between p-3 mb-4 bg-white border-b shadow-md">
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl text-teal-500 font-bold">
              <span className="font-bold">Task:</span> {task?.name}
            </div>
            <div className="mr-4 text-lg gap-5 flex items-center">
              <button
                className="px-5 py-2 text-white transition-colors duration-300 rounded-lg bg-teal-600 hover:bg-teal-700"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetEstimation;
