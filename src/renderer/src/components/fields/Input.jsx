/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */

import React, { useId, useState } from 'react'
import { Input as InputField, Textarea } from '@material-tailwind/react'
import { FiEye, FiEyeOff } from "react-icons/fi";

function Input(
  { label, type = 'text', className, placeholder, variant, ...props },
  ref,
) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full items-center">
      {type === 'textarea' ? (
        <Textarea
          label={label}
          className={`px-3 py-1 w-full rounded-lg bg-white text-gray-700 border-2 border-gray-300 focus:border-gray-600 focus:bg-slate-300 focus:bg-opacity-60 duration-200 ${className}`}
          ref={ref}
          placeholder={placeholder}
          {...props}
          id={id}
        />
      ) : (
        <div className="relative w-full">
          <InputField
            variant={variant}
            label={label}
            type={showPassword && type === 'password' ? 'text' : type}
            className={`px-3 py-1 w-full rounded-lg bg-white text-gray-700 focus:bg-slate-300 focus:bg-opacity-60 duration-200 ${className}`}
            ref={ref}
            placeholder={label}
            {...props}
            id={id}
          />
          {type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded"
            >
              {showPassword ? (
                <FiEye className="text-black" />
              ) : (
                <FiEyeOff className="text-black" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default React.forwardRef(Input)