/* eslint-disable react/prop-types */
import React, { useId } from "react";

function Select({ options, label, className, ...props }, ref) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 font-bold text-lg text-black" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        {...props}
        id={id}
        ref={ref}
        className={`px-3 py-1 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-700 w-full ${className}`}
        onChange={props.onChange}
      >
        
        {options?.map((option) => (
          <option key={option?.value} value={option?.value}>
            {option?.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
