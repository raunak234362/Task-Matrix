/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */


const Button = ({ children, type = "button", className = " bg-teal-500/50 text-white text-xl", ...props }) => {
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
