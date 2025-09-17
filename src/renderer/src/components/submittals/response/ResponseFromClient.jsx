/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { X } from "lucide-react";
import SelectedResponseDetail from "./SelectedResponseDetail";
import SelectedResponseSend from "./SelectedResponseSend";
import Service from "../../../api/configAPI";
import { useEffect, useState } from "react";

const ResponseFromClient = ({ responseData, handleViewModalClose }) => {
  console.log("Response Data:", responseData);  
  const [fetchResponseDetails, setFetchResponseDetails] = useState();
  const fetchResponseData = async () => {
    try {
      const response = await Service.getSubmittalByProjectId(responseData.id);
      setFetchResponseDetails(response.data);
      return response;
    } catch (error) {
      console.error("Error fetching RFI response details:", error);
      return null;
    }
  };
  console.log(
    "Fetched Response Data:",
    fetchResponseDetails?.childResponses
  );
  const childResponse = fetchResponseDetails?.childResponses;
  useEffect(() => {
    fetchResponseData();
  }, []);

  console.log("Response Data:", responseData);
  const userType = sessionStorage.getItem("userType");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[70%] w-11/12 max-w-4xl rounded-lg shadow-lg overflow-hidden">
        <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
          <div className="text-lg text-white">
            <span className="font-bold">Recieved On:</span>{" "}
            {fetchResponseDetails?.createdAt
              ? (() => {
                  const date = new Date(fetchResponseDetails.createdAt);
                  const mm = String(date.getMonth() + 1).padStart(2, "0");
                  const dd = String(date.getDate()).padStart(2, "0");
                  const yyyy = date.getFullYear();
                  const hh = String(date.getHours()).padStart(2, "0");
                  const min = String(date.getMinutes()).padStart(2, "0");
                  return `${mm}:${dd}:${yyyy} ${hh}:${min}`;
                })()
              : ""}
          </div>
          <button 
            className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={handleViewModalClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pt-5 pb-6 overflow-y-auto h-full space-y-6">
          <SelectedResponseDetail responseDetail={responseData} /> {/* Parent Response */}
          {/* {userType !== "client" ? (
            fetchResponseDetails?.childResponses &&
            fetchResponseDetails.childResponses.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Responded Details
                </h3>
                <SelectedResponseDetail responseDetail={childResponse} />
              </div>
            ) : (
              <div>
                <SelectedResponseSend
                  rfiID={fetchResponseDetails?.rfiId}
                  responseId={fetchResponseDetails?.id}
                />
              </div>
            )
          ) : (
            <div>
              {childResponse ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Response Details
                  </h3>
                  <SelectedResponseDetail responseDetail={childResponse} />
                </div>
              ) : (
                <span className="text-gray-400 text-sm">
                  No child response available
                </span>
              )}
             
            </div>
          )} */}
          {/* <SelectedResponseSend
            rfqID={responseData.rfqID}
            responseId={responseData.id}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default ResponseFromClient;
