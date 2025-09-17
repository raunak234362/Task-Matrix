/* eslint-disable react/prop-types */
import { CustomSelect } from "../../index";
import DateFilter from "../../../util/DateFilter";

const FilterPanel = ({
    isFilterOpen,
    userData,
    filterUserId,
    setFilterUserId,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    dateFilter,
    setDateFilter,
    uniqueTypes,
}) => {
    if (!isFilterOpen) return null;

    console.log("FilterPanel: dateFilter =", dateFilter); // Debug: Log dateFilter state

    return (
        <div className="grid grid-cols-1 gap-4 p-4 mb-6 rounded-lg bg-gray-50 md:grid-cols-4">
            <div>
                <CustomSelect value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)}>
                    <option value="all">All Users</option>
                    {userData.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.f_name} {user.l_name}
                        </option>
                    ))}
                </CustomSelect>
            </div>
            <div>
                <CustomSelect
                    label="Stage"
                    name="stage"
                    color="blue"
                    options={[
                        { label: "Select Stage", value: "all" },
                        { label: "(RFI) Request for Information", value: "RFI" },
                        { label: "(IFA) Issue for Approval", value: "IFA" },
                        { label: "(BFA) Back from Approval/Returned App", value: "BFA" },
                        { label: "(BFA-M) Back from Approval - Markup", value: "BFA_M" },
                        { label: "(RIFA) Re-issue for Approval", value: "RIFA" },
                        { label: "(RBFA) Return Back from Approval", value: "RBFA" },
                        { label: "(IFC) Issue for Construction/DIF", value: "IFC" },
                        { label: "(BFC) Back from Construction/Drawing Revision", value: "BFC" },
                        { label: "(RIFC) Re-issue for Construction", value: "RIFC" },
                        { label: "(REV) Revision", value: "REV" },
                        { label: "(CO#) Change Order", value: "CO#" },
                    ]}
                    value={filterStatus}
                    onChange={(value) => setFilterStatus(value)}
                />
            </div>
            <div>
                <CustomSelect
                    label="Task Type"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="all">All Types</option>
                    {uniqueTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </CustomSelect>
            </div>
            <div>
                <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
            </div>
        </div>
    );
};

export default FilterPanel;