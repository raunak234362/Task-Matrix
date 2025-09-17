import App from "../App";
import {
  ChangePassword,
  Chats,
  Home,
  Login,
  MyProfile,
  ProjectTab,
  TaskTab,
  UserTab,
} from "../components";
import RequireAuth from "../middleware/RequireAuth";
import EstimationTab from "../pages/estimation/EstimationTab";

const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/change-password/",
    element: <ChangePassword />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/dashboard",
        element: <App />,
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "projects",
            element: <ProjectTab />,
          },
          {
            path: "chats",
            element: <Chats />,
          },
          {
            path: "tasks",
            element: <TaskTab />,
          },
          {
            path: "estimation",
            element: <EstimationTab />,
          },
          {
            path: "user",
            element: <UserTab />,
          },
          {
            path: "profile",
            element: <MyProfile />,
          }
        ],
      },
    ],
  },
];

export default routes;
