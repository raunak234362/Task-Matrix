/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */

import React, { useId, useState } from 'react';
import { Checkbox } from "@material-tailwind/react";

function Toggle({
  label,
  className,
  placeholder,
  name,
  ...props
}, ref) {
  const id = useId();
  const [checked, setChecked] = useState(false);

  return (
    <div className="w-full flex flex-row items-center">
      {label && (
        <label className={`block mb-1 w-fit min-w-28 font-normal text-sm text-gray-700 ${checked? "font-semibold":""}`} htmlFor={id}>
          {label}
        </label>
      )}
      <Checkbox
        type="checkbox"
        // className={`w-4 flex flex-row rounded-full bg-white text-gray-700 border-2 border-gray-300 focus:border-gray-600 focus:bg-slate-300 focus:bg-opacity-60 duration-200 ${className}`}
        ref={ref}
        // placeholder={placeholder}
        id={id}
        name={name}
        checked={checked}
        onClick={() => {
          setChecked((prev) => {
            props.onChange({ target: { name, value: !prev } });
            return !prev;
          });
        }}
        {...props}
      />
      {
        checked && (
          <span className="text-green-500 font-bold">Selected</span>
        )
      }
    </div>
  );
}

export default React.forwardRef(Toggle);