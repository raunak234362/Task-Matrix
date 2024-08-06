import React,{useId} from "react";

const MultiSelectCheckbox = ({ label, name, options, errors, register }) => {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 font-bold text-lg text-black" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="border p-3 rounded-lg max-h-60 overflow-y-auto">
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`${id}-${index}`}
              value={option}
              name={name} 
              ref={register} 
              className="mr-2"
            />
            <label htmlFor={`${id}-${index}`}>{option}</label>
          </div>
        ))}
      </div>
      
      {errors[name] && (
        <span className="text-red-500 text-sm">{errors[name].message}</span>
      )}
    </div>
  );
};

export default MultiSelectCheckbox;
