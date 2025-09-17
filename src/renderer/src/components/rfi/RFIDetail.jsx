/* eslint-disable react/prop-types */
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value || "Not available"}</span>
  </div>
);

const RFIDetail = ({ rfi, FileLinks, rfiId }) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
        <h3 className="text-lg font-semibold text-white">RFI Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3">
        <InfoItem label="Subject" value={rfi.subject} />
        <InfoItem label="Description" value={rfi.description} />
        <InfoItem
          label="Date"
          value={new Date(rfi.date).toLocaleDateString()}
        />
        <InfoItem label="Status" value={rfi.status ? "No Reply" : "Replied"} />
        <InfoItem
          label="Files"
          value={<FileLinks files={rfi.files} rfiId={rfiId} />}
        />
      </div>
    </div>
  );
};

export default RFIDetail;
