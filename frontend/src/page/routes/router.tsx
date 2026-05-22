import { createBrowserRouter } from "react-router";
import Home from "../Home";
import Login from "../Login";

export const router = createBrowserRouter([
  {
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
    ],
  },
]);
