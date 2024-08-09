/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import { Header, Button, ManageFabricator } from "../../../index";

const AllFabricators = () => {
const [fabricators, setFabricators] = useState([]);
const [selectedFabricator, setSelectedFabricator] = useState(null);
const [filteredFab, setFilteredFab] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');

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

useEffect(() => {
  const results = fabricators.filter(fab =>
    fab.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredFab(results);
}, [searchTerm, fabricators]);

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
    <div className="flex justify-between mt-4">
              <input
                type="text"
                placeholder="Search by Fabricator name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              />
             
            </div>
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
        {filteredFab?.map((fabricator, index) => (
        <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap">
            {fabricator?.name}
            </td>
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
