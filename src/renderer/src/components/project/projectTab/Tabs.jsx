/* eslint-disable react/prop-types */
const Tabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="mb-6 border-b">
            <div className="flex overflow-x-auto">
                <button
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                    onClick={() => setActiveTab("overview")}
                >
                    Overview
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "timeline" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                    onClick={() => setActiveTab("timeline")}
                >
                    Timeline
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "team" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                    onClick={() => setActiveTab("team")}
                >
                    Team
                </button>
            </div>
        </div>
    );
};

export default Tabs;