/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import LOGO from "../../assets/logo.png";
const Header = ({title}) => {
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("userType");
  return (
    <div className="sticky w-full z-50 top-0 flex font-bold justify-between items-center uppercase bg-slate-500 text-white rounded-md px-3 py-2 ">
        
        <div>
          <img src={LOGO} alt="logo" className=" h-14 object-cover bg-white/50 shadow-white shadow-sm rounded-xl py-0" />
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
