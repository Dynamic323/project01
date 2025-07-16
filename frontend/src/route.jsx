import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import Layout from "./Guest/Layout";
import App from "./App";
import Register from "./Guest/Pages/Form/Register";
import Login from "./Guest/Pages/Form/Login";
import User_Layout from "./User/User_Layout";
import ProtectedRoute from "./Middleware/ProtectedRoute";
import Dashboard from "./User/Dashboard";


export const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <Layout />
    ),
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <User_Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path:"",
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);
