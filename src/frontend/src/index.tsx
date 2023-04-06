import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./pages/root";
import ErrorPage from "./pages/error-page";
import Login from "./pages/login";
import About from "./pages/about";
import Sandbox from "./pages/sandbox";
import Problem from "./pages/problem";
import ProblemList from "./pages/problemList";
import Upload from "./pages/upload";
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
            path: "problems",
            element: <ProblemList />,
          },
          {
            path: "problem/:id",
            element: <Problem />,
          },
          {
            path: "sandbox",
            element: <Sandbox />,
          },
          {
            path: "upload",
            element: <Upload />,
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
