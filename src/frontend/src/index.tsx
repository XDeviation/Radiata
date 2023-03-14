import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./pages/root";
import ErrorPage from "./pages/error-page";
import Login from "./pages/login";
import About from "./pages/about";
import Problem from "./pages/problem";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            path: "about",
            element: <About />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "problem",
            element: <Problem />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
