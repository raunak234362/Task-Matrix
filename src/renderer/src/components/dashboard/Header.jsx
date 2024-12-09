/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import LOGO from "../../assets/logo.png";
const Header = ({title}) => {
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("userType");
  return (
    <div className="flex md:px-5 rounded-xl justify-between items-center w-full bg-white bg-opacity-50 text-slate-800  border-4">
        
        <div className={`flex items-center p-1 transition-all duration-300 `}>
          {/* <div
          className={`fixed inset-0 z-10 transition-opacity duration-300 `}
          onClick={toggleSidebar}
        ></div> */}
          <img src={LOGO} alt="" className="md:w-32 w-20" />
        </div>
        <h1 className="text-2xl mx-auto">
            {title}
        </h1>
        <div className="text-lg flex flex-col">
          <div className="font-bold">
            {role.toLocaleUpperCase()} - {username}
          </div>
          
        </div>
      </div>
    
  );
};

export default Header;
