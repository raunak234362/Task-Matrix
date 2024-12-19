/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Button, Input } from "../index";
import Logo from "../../assets/logo.png";
import Background from "../../assets/background-image.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../store/userSlice";
import AuthService from "../../api/authAPI";
import Service from "../../api/configAPI";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    try {
      const session = await AuthService.login(data);
      if (session && session.token) {
        // Check if session and token exist
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
        if (userType != "user") {
          navigate("/admin/home");
        } else {
          navigate("/admin/home");
        }
      } else {
        // Handle case where session or token is missing
        setError(
          "Invalid credentials. Please check your username and password.",
        );
      }
    } catch (error) {
      console.error("Login failed: ", error);
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    if (error.message.includes("429")) {
      setError("Too many requests. Please try again later.");
    } else if (error.message.includes("401")) {
      setError("Invalid credentials. Please check your username and password.");
    } else {
      setError("An error occurred during login.");
    }
  };

  return (
    <>
      <div className="w-screen grid md:grid-cols-2 grid-cols-1 z-10 fixed">
        <div
          className={`md:flex md:my-0 mt-10 md:h-screen justify-center items-center`}
        >
          <div className="fixed bg-white md:w-auto bg-opacity-70 border-4 rounded-2xl md:py-14 md:px-20 px-2 mx-20 flex justify-center items-center z-10">
            <img src={Logo} alt="Logo" />
          </div>
        </div>
        <div className="md:bg-green-400 h-screen flex justify-center items-center">
          <div className="bg-white md:bg-opacity-100 bg-opacity-60 h-fit w-[80%] md:w-2/3 rounded-2xl shadow-lg shadow-gray-600 border-4 border-white md:border-green-500 p-5">
            <h1 className="text-4xl font-bold text-center text-gray-600 mb-10">
              Login to <span className="text-teal-500">TASK MATRIX</span>
            </h1>
            <form
              onSubmit={handleSubmit(login)}
              className="flex w-full flex-col gap-5"
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
              <div className="w-full flex my-5 justify-center">
                <Button type="submit">Login</Button>
              </div>
            </form>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
        <div>
      </div>
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
