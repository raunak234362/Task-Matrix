/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */


const Button = ({ children, type = "button", className ="bg-teal-500 text-white", ...props }) => {
  return (
    <button
      type={type}
       className={`${className} md:px-5 px-3 md:py-1 py-0 md:text-md text-sm rounded-xl`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
