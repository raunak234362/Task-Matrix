/* eslint-disable react/prop-types */
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col w-full">
    <span className="text-sm font-semibold text-gray-500 uppercase">
      {label}
    </span>
    <span className="mt-1 text-gray-700">{value || "Not available"}</span>
  </div>
);

const RFIDetail = ({ rfi, FileLinks, rfiId }) => {
  const statusText = rfi?.status === "replied" ? "Replied" : "No Reply";
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-200 rounded-xl shadow-md mb-6">
        <div className="flex items-end gap-4">
          <h3 className="text-xl font-bold text-white tracking-wide">
            RFI Information
          </h3>
          <h4 className="text-white font-bold">
            {new Date(rfi.date).toLocaleString()}
          </h4>
        </div>
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            statusText === "Replied"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {statusText}
        </span>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6">
        <InfoItem label="Subject" value={rfi.subject} />

        <div className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-gray-500 uppercase">
            Description:
          </span>
          <div
            className="text-gray-700 text-sm md:text-base leading-relaxed p-3 bg-gray-50 rounded-lg border border-gray-200"
            dangerouslySetInnerHTML={{ __html: rfi?.description || "N/A" }}
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-gray-500 uppercase">
            Files:
          </span>
          <div className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <FileLinks files={rfi.files} rfiId={rfiId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFIDetail;
