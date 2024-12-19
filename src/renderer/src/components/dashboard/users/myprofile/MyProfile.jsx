/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import Service from "../../../../api/configAPI";
import Header from "../../Header";
// import { useSelector } from "react-redux";

const MyProfile = () => {
const [userData,setUserData]=useState()
const token = sessionStorage.getItem("token");

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const usersData = await Service.getCurrentUser(token);
      setUserData(usersData);
      console.log(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  fetchUsers();
}, []);
  return (
    <div className="w-full h-[89vh] overflow-y-hidden mx-5">
      <div className="flex w-full justify-center items-center">
        <div className="text-3xl font-bold text-white bg-teal-500/50 shadow-xl px-5 py-1 mt-2 rounded-lg">
          My Profile
        </div>
      </div>
      <div className="bg-white mt-2 shadow-md rounded-lg p-4">
        <p><strong>Name:</strong> {userData?.name}</p>
        <p><strong>Employee ID:</strong> {userData?.username}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
      </div>
    </div>
  );
};

export default MyProfile;