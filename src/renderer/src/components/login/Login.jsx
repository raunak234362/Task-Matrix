/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { Button, Input } from "../index";
import Logo from "../../assets/logo.png";
import Background from "../../assets/background-image.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin, setUserData } from "../../store/userSlice";
import AuthService from "../../api/authAPI";
import Service from "../../api/configAPI";
import { toast } from "react-toastify";
import socket from "../../socket";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    try {
      const user = await AuthService.login(data);
      console.log(user);
      if ("token" in user) {
        const token = user.token;
        sessionStorage.setItem("token", token);
        const userData = await Service.getCurrentUser();
        dispatch(setUserData(userData));
        socket.emit("joinRoom", userData.id);
        console.log(`🔐 Joined room: ${userData.id}`);
        console.log("UserData :", userData.id);
        let userType = "user";
        if (userData.role === "STAFF") {
          if (userData.is_superuser) {
            userType = "admin";
          } else if (userData.is_sales) {
            userType = "sales";
          } else if (userData.is_staff && userData.is_manager) {
            userType = "department-manager";
          } else if (userData.is_manager) {
            userType = "project-manager";
          } else if (userData.is_hr) {
            userType = "human-resource";
          }
        } else if (userData.role === "CLIENT") {
          userType = "client";
        } else if (userData.role === "VENDOR") {
          userType = "vendor";
        }

        sessionStorage.setItem("userType", userType);
        dispatch(authLogin(user));
        // dispatch(setUserData(userData.data))
        console.log(userData.is_firstLogin);
        if (userData?.is_firstLogin) navigate("/change-password/");
        else if (
          userType === "user" ||
          userType === "project-manager" ||
          userType === "admin" ||
          userType === "department-manager"
        )
          navigate("/admin/home");
          else if (userType === "human-resource") navigate("/admin/profile")
        // else if (userType === "client") navigate("/client");
        // else if (userType === "sales") navigate("/sales");
        // else if (userType === "staff") navigate("/staff");
        // else if(userType === 'department-manager') navigate('/department-manager')
        // else if (userType === "project-manager") navigate("/project-manager");
        // else if(userType === 'project-manager-officer') navigate('/project-manager')
        // else if (userType === "vendor") navigate("/vendor");
        else navigate("/");
      } else {
        toast.error("Invalid Credentials---------");
        navigate("/");
      }
    } catch (error) {
      toast.error("Invalid Credentials----------", error);
    }
  };

 

  return (
    <>
      <div className="fixed z-10 grid w-screen grid-cols-1 md:grid-cols-2">
        <div
          className={`md:flex md:my-0 mt-10 md:h-screen justify-center items-center`}
        >
          <div className="fixed z-10 flex items-center justify-center px-2 mx-20 bg-white border-4 md:w-auto bg-opacity-70 rounded-2xl md:py-14 md:px-20">
            <img src={Logo} alt="Logo" />
          </div>
        </div>
        <div className="flex items-center justify-center h-screen md:bg-green-400">
          <div className="bg-white md:bg-opacity-100 bg-opacity-60 h-fit w-[80%] md:w-2/3 rounded-2xl shadow-lg shadow-gray-600 border-4 border-white md:border-green-500 p-5">
            <h1 className="mb-10 text-4xl font-bold text-center text-gray-600">
              Login to <span className="text-teal-500">TASK MATRIX</span>
            </h1>
            <form
              onSubmit={handleSubmit(login)}
              className="flex flex-col w-full gap-5"
            >
              <div className="my-2">
                <Input
                  label="Username"
                  type="text"
                  placeholder="Username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
              </div>
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Username"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <div className="flex justify-center w-full my-5">
                <Button type="submit">Login</Button>
              </div>
            </form>

            {error && <p className="mt-2 text-red-500">{error}</p>}
          </div>
        </div>
        <div></div>
      </div>
      <img
        src={Background}
        alt="background"
        className="h-screen w-screen object-cover blur-[8px]"
      />
    </>
  );
};

export default Login;
