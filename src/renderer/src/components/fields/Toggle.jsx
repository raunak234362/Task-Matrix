import React, { useId, useState } from 'react';

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
    <div className="w-fit flex flex-row gap-3 items-center">
      {label && (
        <label className="block mb-1 w-44 font-bold text-lg text-black" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type="checkbox"
        className={`w-4 flex flex-row rounded-full bg-white text-gray-700 border-2 border-gray-300 focus:border-gray-600 focus:bg-slate-300 focus:bg-opacity-60 duration-200 ${className}`}
        ref={ref}
        placeholder={placeholder}
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
          <span className="text-green-700 font-medium">Selected</span>
        )
      }
    </div>
  );
}

export default React.forwardRef(Toggle);
