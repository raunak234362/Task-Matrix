/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useId } from "react";
import { Select as SelectOpt, Option } from "@material-tailwind/react";
function Select({ options = [], label, name, className, onChange, ...props }, ref) {
  const id = useId();

  const handleChange = (event) => {
    if (onChange && typeof onChange === 'function') {
      onChange(name, event);
    }
  }


  return (
    <div className="w-full">
      <SelectOpt
        {...props}
        variant="outlined"
        id={id}
        label={label}
        ref={ref}
        name={name}
        className={` rounded-md bg-white  duration-200 w-full ${className}`}
        onChange={handleChange}
      >
        {options.map((option) => (
          option && (
            <Option key={option.value} value={option.value} className="text-black">
              {option.label}
            </Option>
          )
        ))}
      </SelectOpt>
    </div>
  );
};

export default React.forwardRef(Select);