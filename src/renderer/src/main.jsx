/* eslint-disable prettier/prettier */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import {
  AddTask,
  Allprojects,
  AllTask,
  AllUser,
  ApproveAssignee,
  ChangePassword,
  Chats,
  Home,
  Login,
  MyProfile,
  MyTask,
  ProjectStats,
  ProjectTab,
  TaskRecord,
  TaskTab,
  UserTab,
} from "./components/index.js";

import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./util/ProtectedRoute.jsx";
import Estimation from "./components/dashboard/tasks/EstimationTask/Estimation.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/change-password/",
    element: <ChangePassword />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "home",
        element: <Home />,
      },

      {
        path: "project",
        element: <ProjectTab />,
        children: [
          {
            path: "all-project",
            element: <Allprojects />,
          },
          {
            path: "project-stats",
            element: <ProjectStats />,
          },
        ],
      },
      {
        path: "chats",
        element: <Chats />,
      },
      {
        path: "task",
        element: <TaskTab />,
        children: [
          {
            path: "add-task",
            element: <AddTask />,
          },
          {
            path: "all-task",
            element: <AllTask />,
          },
          {
            path: "my-task",
            element: <MyTask />,
          },
          {
            path: "approve-assignee",
            element: <ApproveAssignee />,
          },
          {
            path: "myTask-record",
            element: <TaskRecord />,
          },
          {
            path: "estimation",
            element: <Estimation />,
          }
        ],
      },
      {
        path: "user",
        element: <UserTab />,
        children: [
          {
            path: "all-user",
            element: <AllUser />,
          },

        ],
      },
      {
        path: "profile",
        element: <MyProfile />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
