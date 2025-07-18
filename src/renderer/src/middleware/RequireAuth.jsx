// src/util/RequireAuth.jsx
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const RequireAuth = () => {
  const token = sessionStorage.getItem("token");
  const userInfo = useSelector((state) => state.userData.userData);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && userInfo?.is_firstLogin) {
      navigate("/change-password/");
    }
  }, [token, userInfo, navigate]);

  if (!token) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default RequireAuth;
