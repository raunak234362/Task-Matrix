/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) {
      window.location.reload();
    }
  }, [token, userId]);

  if (!token || !userId) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
