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
  GaantChart,
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

const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <App />,
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
          {
            path: "gaant-chart",
            element: <GaantChart />,
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
