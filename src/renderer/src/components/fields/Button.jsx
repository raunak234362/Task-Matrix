/* eslint-disable react/prop-types */

const Button = ({children, type='button',className="",...props}) => {
    return (
    <button
    type={type}
    className={`${className} bg-blue-500 md:px-5 px-3 md:py-1 py-0  text-white md:text-lg text-sm rounded-xl`}
    {...props}
    >
        {children}
    </button>
  )
}

export default Button