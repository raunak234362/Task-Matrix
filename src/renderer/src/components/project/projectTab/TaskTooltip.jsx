/* eslint-disable react/prop-types */
const TaskTooltip = ({ hoveredTask, formatDate, statusColors }) => {
    if (!hoveredTask) return null;

    return (
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2">
            <div className="max-w-md p-4 bg-white border rounded-lg shadow-xl">
                <h3 className="mb-2 text-lg font-bold">{hoveredTask.name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Assigned to:</div>
                    <div className="font-medium">{hoveredTask.username || "Unassigned"}</div>
                    <div className="text-gray-600">Timeline:</div>
                    <div className="font-medium">
                        {formatDate(hoveredTask.startDate)} - {formatDate(hoveredTask.endDate)}
                    </div>
                    <div className="text-gray-600">Duration:</div>
                    <div className="font-medium">{hoveredTask.duration} days</div>
                    <div className="text-gray-600">Status:</div>
                    <div className="font-medium">
                        <span
                            className="inline-block px-2 py-1 text-xs rounded-full"
                            style={{
                                backgroundColor: statusColors[hoveredTask.status] || "#ccc",
                                color: hoveredTask.status === "ASSIGNED" ? "#333" : "#fff",
                            }}
                        >
                            {hoveredTask.status}
                        </span>
                    </div>
                    <div className="text-gray-600">Progress:</div>
                    <div className="font-medium">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="h-2.5 rounded-full"
                                style={{
                                    width: `${hoveredTask.progress}%`,
                                    backgroundColor: statusColors[hoveredTask.status] || "#ccc",
                                }}
                            ></div>
                        </div>
                        <span className="text-xs">{hoveredTask.progress}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskTooltip;