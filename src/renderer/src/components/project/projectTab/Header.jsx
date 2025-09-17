/* eslint-disable react/prop-types */
import { X } from 'lucide-react';
import DateFilter from '../../../util/DateFilter';

const Header = ({ projectData, filterStage, setFilterStage, dateFilter, setDateFilter, filteredData, onClose, formatDate }) => {
    return (
        <div className="sticky top-0 z-10 flex md:flex-row flex-col items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
            <div className="flex flex-col gap-3 md:flex-row items-center md:items-center">
                <div className="text-lg font-bold text-white rounded-lg md:text-xl">
                    {projectData?.name || "Unknown Project"}
                </div>
                <span className="text-xs text-white md:text-sm">
                    {formatDate(projectData?.startDate)} - {formatDate(projectData?.endDate)}
                </span>
            </div>
            <div className="flex items-center gap-2">
                {/* Stage Filter */}
                <div>
                    <select
                        name="stage"
                        value={filterStage}
                        onChange={(e) => {
                            console.log("Selected Stage:", e.target.value)
                            setFilterStage(e.target.value)
                        }}
                        className="w-full p-2 border rounded text-sm"
                    >
                        <option value="all">All Stages</option>
                        <option value="RFI">(RFI) Request for Information</option>
                        <option value="IFA">(IFA) Issue for Approval</option>
                        <option value="BFA">(BFA) Back from Approval</option>
                        <option value="BFA_M">(BFA-M) Back from Approval - Markup</option>
                        <option value="RIFA">(RIFA) Re-issue for Approval</option>
                        <option value="RBFA">(RBFA) Return Back from Approval</option>
                        <option value="IFC">(IFC) Issue for Construction</option>
                        <option value="BFC">(BFC) Back from Construction</option>
                        <option value="RIFC">(RIFC) Re-issue for Construction</option>
                        <option value="REV">(REV) Revision</option>
                        <option value="CO">(CO#) Change Order</option>
                    </select>
                </div>

                <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} filteredData={filteredData} />
                <button
                    className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

    );
};

export default Header;