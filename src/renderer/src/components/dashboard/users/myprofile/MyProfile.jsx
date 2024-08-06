/* eslint-disable react-hooks/exhaustive-deps */
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
    <div>
      <Header title={"My Profile"}/>
      <div className="bg-white shadow-md rounded-lg p-4">
        <p><strong>Name:</strong> {userData?.name}</p>
        <p><strong>Employee ID:</strong> {userData?.username}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
      </div>
    </div>
  );
};

export default MyProfile;