/* eslint-disable prettier/prettier */

import { useNavigate } from "react-router-dom";

const LoginPageRedirect = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">You need to re-login</h2>
        <p className="text-gray-600 mb-4">Your session has expired or you are not authenticated. Please log in again.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default LoginPageRedirect;