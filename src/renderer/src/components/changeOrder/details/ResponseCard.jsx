/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useCallback, useMemo, useState } from "react";
import Button from "../../fields/Button";

const ResponseCard = ({ co }) => {
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const userType = useMemo(() => sessionStorage.getItem("userType") || "", []);

  const response = useMemo(() => co?.coResponse || {}, [co]);

  const handleViewModalOpen = useCallback(() => {
    if (response?.id) {
      console.log("Opening modal for response ID:", response.id);
      setSelectedResponseId(response.id);
    }
  }, [response]);

  const handleViewModalClose = useCallback(() => {
    setSelectedResponseId(null);
  }, []);

  return (
    <div className="p-5 bg-gray-50 rounded-lg shadow-inner min-h-[100px]">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Change Order Response
      </h3>
      {response && Object.keys(response).length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">
                Change Order Subject:
              </span>
              <span className="text-gray-600">{co?.remarks || "N/A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">Status:</span>
              <span className="text-gray-600">
                {userType === "client"
                  ? response.Status || "N/A"
                  : response.Status || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">Description:</span>
              <span className="text-gray-600">
                {response.description || "N/A"}
              </span>
            </div>
            {/* <div className="flex flex-col">
              <span className="font-medium text-gray-700">Response ID:</span>
              <span className="text-gray-600">{response.id || "N/A"}</span>
            </div> */}
          </div>
          {/* <div className="mt-4">
            <Button
              onClick={handleViewModalOpen}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1 px-4 rounded"
              disabled={!response.id}
            >
              View
            </Button>
          </div> */}
        </div>
      ) : (
        <div>
          {userType === "client" ? (
            <p className="text-red-500 text-center">Your Response is Pending</p>
          ) : (
            <p className="text-gray-500 text-center">No response found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResponseCard;
