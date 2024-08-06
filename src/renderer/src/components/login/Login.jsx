/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Button, Input } from "../index";
import Logo from "../../assets/logo.png";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../store/userSlice";
import AuthService from "../../api/authAPI";
import Service from "../../api/configAPI";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    try {
      const session = await AuthService.login(data);
      if (session && session.token) { // Check if session and token exist
        const token = session.token;
        const userData = await Service.getCurrentUser(token); 
        let userType = "";

        if (userData.is_superuser) {
          userType = "admin";
        } else if (userData.is_staff) {
          userType = "manager";
        } else {
          userType = "user";
        }

        sessionStorage.setItem("userType", userType);
        sessionStorage.setItem("username", userData?.username);
        sessionStorage.setItem("token", token); 
        dispatch(authLogin({ token, userType })); 
        if(userType != "user"){
          navigate("/dashboard");
        }else{
          navigate("/dashboard/my-profile");
        }
      } else {
        // Handle case where session or token is missing
        setError("Invalid credentials. Please check your username and password.");
      }
    } catch (error) {
      console.error("Login failed: ", error);
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    if (error.message.includes('429')) {
      setError("Too many requests. Please try again later.");
    } else if (error.message.includes('401')) {
      setError("Invalid credentials. Please check your username and password.");
    } else {
      setError("An error occurred during login.");
    }
  }

  return (
    <div className="bg-green-500 h-screen w-screen">
      <div className="flex justify-center items-center h-full bg-white bg-opacity-30">
        <div className="bg-white bg-opacity-70 border-4 border-white shadow-lg shadow-white/50 h-1/2 w-[40%] rounded-3xl flex flex-col justify-center items-center p-2">
          <div className="w-1/2 flex flex-col justify-center items-center gap-5">
            <img src={Logo} alt="Logo" className="w-1/2" />
            <h1 className="text-5xl font-semibold">Sign in</h1>
            <h1 className="text-xl">Use Your Domain Account</h1>
          </div>

          <form onSubmit={handleSubmit(login)} className="w-[75%]">
            <Input
              label="Username:"
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}

            <Input
              label="Password:"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <Button type="submit">Login</Button>
          </form>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
