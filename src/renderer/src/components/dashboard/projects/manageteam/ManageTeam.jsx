import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import {Button, Header, TeamView} from "../../../index"
const ManageTeam = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam]=useState(null);
  const [isModalOpen, setIsModalOpen]=useState(false);

  useEffect((token) => {
    const fetchTeams = async () => {
      try {
        const teamData = await Service.getAllTeam(token);
        setTeams(teamData);
        console.log(teamData)
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  },[]);

  const handleViewClick = async (teamId) => {
    try {
      const team = await Service.getTeam(teamId);
      setSelectedTeam(team);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  }
  const handleCloseModal=()=>{
    setIsModalOpen(false);
    setSelectedTeam(null);
  }

  return (
    <div>
      <Header title={"Manage Team"}/>
      <table className="mt-10 min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              S.no
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Leader
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Manager
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Members
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teams?.map((team, index)=>(
            <tr key={team.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {index+1}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {team?.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {team?.leader?.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {team?.created_by?.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                      {team?.member?.length > 0 ? team.members.length : <Button onClick={()=>handleViewClick(team.id)}>View/Add</Button>}
              </td>
             </tr>
          ))}
          </tbody>
        </table>
        {selectedTeam && (
          <TeamView
            team={selectedTeam}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
    </div>
  );
};

export default ManageTeam;
