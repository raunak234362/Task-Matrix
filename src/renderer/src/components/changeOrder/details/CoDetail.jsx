/* eslint-disable react/prop-types */
import { useCallback, useState } from "react";
import Button from "../../fields/Button";
import EditCoDetail from "./EditCoDetail";
import { openCoListTableInNewTab } from "../../../util/coTableUtils";

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value || "Not available"}</span>
  </div>
);

const CoDetail = ({ selectedCO, fetchCO }) => {
  const [editTab, setEditTab] = useState(false);
  const userType = sessionStorage.getItem("userType");

  const handleEdit = useCallback(() => {
    setEditTab(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditTab(false);
    fetchCO(); // Refresh details after closing edit form
  }, [fetchCO]);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
        <h3 className="text-lg font-semibold text-white">
          Change Order Request Details
        </h3>
        {userType !== "client" && <Button onClick={handleEdit}>Edit</Button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3">
        <InfoItem label="Subject" value={selectedCO?.remarks} />
        <InfoItem label="Description" value={selectedCO?.description} />
        <InfoItem label="Change Order No." value={selectedCO?.changeOrder} />
        <InfoItem
          label="Point of Contact"
          value={`${selectedCO?.Recipients?.f_name} ${selectedCO?.Recipients?.l_name}`}
        />
        <InfoItem label="Sent Date" value={selectedCO?.sentOn} />
        <InfoItem label="Status" value={selectedCO?.status} />
        <InfoItem
          label="Approved"
          value={selectedCO?.isAproovedByAdmin ? "Yes" : "No"}
        />
        <div className="flex justify-between">
          <span className="font-medium text-sm text-gray-700">Files:</span>
          <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
            {selectedCO?.files?.length ? (
              selectedCO.files.map((file) => (
                <ul key={file.id}>
                  <a
                    href={`${import.meta.env.VITE_BASE_URL}/api/RFQ/rfq/${
                      selectedCO.id
                    }/${file.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    {file.originalName || "Unnamed File"}
                  </a>
                </ul>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No files attached</span>
            )}
          </div>
        </div>
        <div>
          <button
            onClick={() => openCoListTableInNewTab(selectedCO)}
            className="text-teal-500 hover:underline text-lg"
          >
            Click to view Change Order Reference List
          </button>
        </div>
      </div>

      {userType !== "client" && editTab && (
        <EditCoDetail
          selectedCO={selectedCO}
          fetchCO={fetchCO}
          onClose={handleCloseEdit} // On close, refetch selectedCO to update display
        />
      )}
    </div>
  );
};

export default CoDetail;
