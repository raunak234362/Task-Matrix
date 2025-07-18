/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import Service from "../../../api/configAPI";
import { Button, Header, TeamView } from "../../index";

const ManageTeam = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamData = await Service.getAllTeam();
        setTeams(teamData);
        setFilteredTeams(teamData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredTeams(filtered);
  }, [searchTerm, teams]);

  const handleViewClick = async (teamId) => {
    try {
      const team = await Service.getTeam(teamId);
      setSelectedTeam(team);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const sortedTeams = [...filteredTeams].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredTeams(sortedTeams);
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw] p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by team name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-full md:w-1/4"
        />
      </div>
      <div className="mt-5 bg-white h-[60vh] overflow-auto rounded-lg">
        <table className="h-fit md:w-full w-[90vw] border-collapse text-center md:text-lg text-xs rounded-xl">
          <thead>
            <tr className="bg-teal-200/70">
              <th >
                S.no
              </th>
              <th
                
                onClick={() => handleSort("name")}
              >
                Team Name
                {sortConfig.key === "name" && (
                  <span>{sortConfig.direction === "asc" ? " " : " "}</span>
                )}
              </th>
              <th >
                Team Leader
              </th>
              <th >
                Team Manager
              </th>
              <th >
                Team Members
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeams.map((team, index) => (
              <tr
                key={team.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-200/50"}
              >
                <td className="border px-2 py-1">
                  <div className="flex items-center">
                    <div>
                      <div >
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border px-2 py-1">
                  <div className="flex items-center">
                    <div>
                      <div
                        
                      >
                        {team?.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border px-2 py-1">
                  <div className="flex items-center">
                    <div>
                      <div>
                        {team?.leader?.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td  className="border px-2 py-1">
                  <div className="flex items-center">
                    <div>
                      <div>
                        {team?.created_by?.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td  className="border justify-center items-center flex px-2 py-1">
                  {team?.members?.length > 0 ? (
                    team.members.length
                  ) : (
                    <Button onClick={() => handleViewClick(team.id)}>
                      View/Add
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
