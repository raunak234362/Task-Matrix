/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useId, useState } from 'react'
// import { Input as InputField, Textarea } from '@material-tailwind/react'
import { FiEye, FiEyeOff } from "react-icons/fi";

function Input(
  { label, type = 'text', className, placeholder,  ...props },
  ref,
) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full items-center">
       {label && (
      <label className="block mb-1 font-bold text-lg text-black" htmlFor={id}>
        {label}
      </label>
    )}
      {type === 'textarea' ? (
        <textarea
          label={label}
          className={`px-3 py-1 w-full rounded-lg bg-white text-gray-700 border-2 border-gray-800 focus:border-gray-600 focus:bg-slate-300 focus:bg-opacity-60 duration-200 ${className}`}
          ref={ref}
          placeholder={placeholder}
          {...props}
          id={id}
        />
      ) : (
        <div className="relative w-full">
          <input
            // variant={variant}
            label={label}
            type={showPassword && type === 'password' ? 'text' : type}
            className={`px-3 py-1 w-full rounded-lg bg-white border-2 border-gray-400 text-gray-700 focus:bg-slate-300 focus:bg-opacity-60 duration-200 ${className}`}
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
