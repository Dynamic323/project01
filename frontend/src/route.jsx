import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import Layout from "./Guest/Layout";
import App from "./App";
import Register from "./Guest/Pages/Form/Register";
import Login from "./Guest/Pages/Form/Login";
import User_Layout from "./User/User_Layout";
import ProtectedRoute from "./Middleware/ProtectedRoute";
import Dashboard from "./User/Dashboard";
import { HistoryPage } from "./User/HistoryPage";
import { SettingsPage } from "./User/SettingsPage";
import { FilesPage } from "./User/Pages/files-page";
import { StoragePage } from "./User/Pages/storage-page";
import Index from "./ViewContent/Index";
import { DashboardProvider } from "./context/DashboardContext";
import TextPage from "./User/Pages/text-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,  
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
      {
        path: "view/:id",
        element: <Index />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardProvider>
          <User_Layout />
        </DashboardProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        index: true,
        element: <Dashboard />,
      },
      {
        path: "files",
        element: <FilesPage />,
      },
      {
        path: "texts",
        element: <TextPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
      {
        path: "storage",
        element: <StoragePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
