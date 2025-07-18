/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import Service from "../../../api/configAPI";
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

console.log(userData);
  return (
    <div className="w-full h-[89vh] overflow-y-hidden mx-5">
      <div className="flex items-center justify-center w-full">
        <div className="px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-teal-500/50">
          My Profile
        </div>
      </div>
      <div className="p-4 mt-2 bg-white rounded-lg shadow-md">
        <p>
          <strong>Name:</strong> {userData?.f_name}
          {userData?.m_name} {userData?.l_name}
        </p>
        <p>
          <strong>Employee ID:</strong> {userData?.username}
        </p>
        <p>
          <strong>Email:</strong> {userData?.email}
        </p>
        <p>
          <strong>Phone Number:</strong> {userData?.phone}
        </p>
      </div>
    </div>
  );
};

export default MyProfile;