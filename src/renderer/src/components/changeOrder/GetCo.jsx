/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import CoDetail from "./details/CoDetail";
// import CoListTable from "./details/CoListTable";
// import SendCoTable from "./SendCoTable";
// import { openCoListTableInNewTab } from "../../util/coTableUtils";
import Button from "../fields/Button";
import Service from "../../api/configAPI";
import toast from "react-hot-toast";
import ClientResponse from "./details/ClientResponse";
import ResponseCard from "./details/ResponseCard";

const GetCo = ({ initialSelectedCO, onClose, fetchCO }) => {
  const [selectedCO, setSelectedCO] = useState(initialSelectedCO);
  const userType = sessionStorage.getItem("userType");
  // When initialSelectedCO changes, sync state
  useEffect(() => {
    setSelectedCO(initialSelectedCO);
  }, [initialSelectedCO]);

  console.log(selectedCO);

  // Function to refresh selectedCO from backend after editing
  const refreshSelectedCO = async () => {
    try {
      const freshData = await fetchCO(); // fetchCO returns updated list or item
      console.log("Refreshed CO Data:", freshData);
      const updatedCO = freshData?.find((co) => co.id === selectedCO.id);
      if (updatedCO) setSelectedCO(updatedCO);
    } catch (error) {
      console.error("Failed to refresh selected CO:", error);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await Service.updateCO(selectedCO.id, {
        isAproovedByAdmin: true,
      });
      console.log("CO approved:", response);
      toast.success("CO approved & sent to Client successfully");
      refreshSelectedCO();
    } catch (error) {
      toast.error("Error approving CO");
      console.error("Error approving CO:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto p-2 md:p-1 rounded-lg shadow-lg w-11/12 md:w-10/12">
        <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-t-md">
          <div className="text-lg text-white font-medium">
            <span className="font-bold">Subject:</span>{" "}
            {selectedCO?.remarks || "N/A"}
          </div>
          <button
            className="p-2 text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pt-5 pb-6 overflow-y-auto h-full space-y-6">
          <div
            className={`grid gap-4 ${
              userType === "client"
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            <CoDetail
              selectedCO={selectedCO}
              fetchCO={refreshSelectedCO} // Paimport React from 'react'ss refresh to CoDetail
            />
            {userType === "admin" && !selectedCO?.isAproovedByAdmin && (
              <div className="border-t pt-4">
                <Button onClick={handleApprove}>Approve & Procceed</Button>
              </div>
            )}
            {userType === "client" && (
              <ClientResponse coId={selectedCO.id} responseId={selectedCO.id} />
            )}
          </div>
          {Array.isArray(selectedCO?.CoRefersTo) &&
          selectedCO.CoRefersTo.length > 0 ? (
            // <div>
            //   <div className="flex justify-between items-center mb-2">
            //     <h3 className="text-lg font-semibold">
            //       Related Change Orders
            //     </h3>
            //     <Button
            //       onClick={() => openCoListTableInNewTab(selectedCO)}
            //       className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 flex items-center gap-2"
            //     >
            //       <span>🔗</span>
            //       Open in New Tab
            //     </Button>
            //   </div>
            //   <CoListTable
            //     selectedCO={selectedCO}
            //     fetchCO={refreshSelectedCO}
            //   />
            // </div>
            <div>
              <ResponseCard co={selectedCO} />
            </div>
          ) : (
            // <SendCoTable data={selectedCO} fetchCO={fetchCO} />
            <span className="text-gray-400 text-sm">
              No related Change Order Reference List available
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetCo;
