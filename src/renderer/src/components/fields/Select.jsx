/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react';
import Select from 'react-select'; // Import react-select

const CustomSelect = ({ options = [], label, name, className, onChange, ...props }) => {
  const handleChange = (selectedOption) => {
    if (onChange && typeof onChange === 'function') {
      onChange(name, selectedOption); // Pass the selected option
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block mb-2 text-gray-700">{label}</label>}
      <Select
        {...props}
        options={options}
        onChange={handleChange}
        className="react-select-container"
        classNamePrefix="react-select"
        isSearchable
        defaultValue={props.defaultValue}
      />
    </div>
  );
};

export default CustomSelect;
