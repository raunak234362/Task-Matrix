import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import { Header, Button, ManageFabricator } from "../../../index";

const AllFabricators = () => {
const [fabricators, setFabricators] = useState([]);
const [selectedFabricator, setSelectedFabricator] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

useEffect((token) => {
const fetchFabricators = async () => {
    try {
    const fabricatorsData = await Service.getAllFabricator(token);
    setFabricators(fabricatorsData);
    } catch (error) {
    console.error("Error fetching fabricators:", error);
    }
};


fetchFabricators();
}, []);

const handleViewClick = async (fabricatorId) => {
    
    try {
      const fabricator = await Service.getFabricator(fabricatorId);
      setSelectedFabricator(fabricator);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFabricator(null);
  };

return (
<div>
    <Header title={"All Fabricator"} />
    <table className="mt-10 min-w-full divide-y divide-gray-200">
    <thead className="bg-slate-200">
        <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            S.no
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Fabricator Name
        </th>
        
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            No. of Contact Person
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Option
        </th>
        </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
        {fabricators?.map((fabricator, index) => (
        <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap">
            {fabricator?.name}
            </td>

            {/* <td className="px-6 py-4 whitespace-nowrap">
            {fabricator?.country}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
            {fabricator?.state}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
            {fabricator?.city}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
            {fabricator?.zipCode}
            </td> */}
            <td className="px-20 py-4 whitespace-nowrap">
            {fabricator?.connections}
            </td>
            <td className="py-4 mx-auto whitespace-nowrap">
            <Button
            onClick={() => {
                handleViewClick(fabricator?.id)
            }}
            >Edit</Button>
            </td>
        </tr>
        ))}
    </tbody>
    </table>
    {selectedFabricator && (
        <ManageFabricator
          fabricator={selectedFabricator}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
</div>
);
};

export default AllFabricators;
