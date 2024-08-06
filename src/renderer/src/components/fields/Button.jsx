import React from "react";

const Button = ({ children, type = "button", className = " bg-gray-500 text-white text-xl", ...props }) => {
  return (
    <button
      type={type}
      className={`${className} flex flex-row justify-start items-center rounded-xl px-5 mt-3 `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
