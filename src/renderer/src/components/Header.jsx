/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import LOGO from "../assets/logo.png";
import Service from "../api/configAPI";
const Header = ({title}) => {
  const username = sessionStorage.getItem("username");
  const [userData, setUserData] = useState()
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("userType");

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
    <div className="flex items-center justify-between w-full bg-white bg-opacity-50 border-4 md:px-5 rounded-xl text-slate-800">
      <div className={`flex items-center p-1 transition-all duration-300 `}>
       
        <img src={LOGO} alt="" className="w-20 md:w-32" />
      </div>
      <h1 className="mx-auto text-2xl">{title}</h1>
      <div className="flex flex-col text-lg">
        <div className="font-bold">
          {role.toLocaleUpperCase()} - {userData?.f_name} {userData?.m_name} {userData?.l_name}
          {}
        </div>
      </div>
    </div>
  );
};

export default Header;
