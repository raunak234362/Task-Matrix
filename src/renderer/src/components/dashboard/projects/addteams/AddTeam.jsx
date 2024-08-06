/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setTeamData } from "../../../../store/teamSlice";
import { Input, Button, Select, Header } from "../../../index";
import Service from "../../../../api/configAPI";

const AddTeam = () => {
  const [managerOptions, setManagerOptions] = useState([]);
  const [leaderOptions, setLeaderOptions] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
      const usersData = await Service.getAllUser(token);
      const options = usersData.map((user) => {
          return {
            label: user.name,
            value: user.id,
          };
        });
      setManagerOptions(options);
      setLeaderOptions(options)
      } catch (error) {
      console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = async (teamData) => {
    try {
      const data = await Service.addTeam({
        ...teamData,
      });
      dispatch(setTeamData(data));
      console.log("Document added:", data);
      alert("Successfully added new Team", teamData?.teamName);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <div>
      <Header title={"Add Team"}/>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5">
        <div className="p-5 flex flex-col justify-between gap-5">
          <div className="flex rounded-lg flex-col shadow-lg shadow-black/15 p-8">
            <div className="mt-5">
              <Input
                label="Team Name"
                name="name"
                className="w-full"
                {...register("name", { required: "Team Name is required" })}
              />
              {errors.teamName && <p>{errors.teamName.message}</p>}
            </div>

            {/* <div className="mt-5">
              <Select
                label="Team Manager"
                className="w-full"
                placeholder="Team Manager"
                name="created_by"
                options={managerOptions}
                {...register("created_by", {
                  required: "Team Manager is required",
                })}
              />
              {errors.created_by && <p>{errors.created_by.message}</p>}
            </div> */}

            <div className="mt-5">
              <Select
                label="Team Leader"
                placeholder="Team Leader"
                className="w-full"
                name="leader"
                options={leaderOptions}
                {...register("leader", {
                  required: "Team Leader is required",
                })}
              />
              {errors.teamLeader && <p>{errors.teamLeader.message}</p>}
            </div>
          <div className="mt-5 flex justify-between">
            <Button type="submit" className="bg-slate-500 text-white">
              Add Team
            </Button>
          </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTeam;
