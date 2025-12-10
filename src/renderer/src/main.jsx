/* eslint-disable prettier/prettier */

import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import "./index.css";
import { ToastContainer } from "react-toastify";
import routes from "./routes/routes.jsx";


const router = createHashRouter(routes)

createRoot(document.getElementById("root")).render(
  <>
    <ToastContainer />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </>,
);
