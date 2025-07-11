import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./Guest/Pages/Form/Login";
import Layout from "./Guest/Layout";
import { Form } from "./Guest/Pages/Form/Index";
import { AuthProvider } from "./context/Authcontext";
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      {
        path: "",
        index: true,
        element: <App />,
      },
      {
        path: "register",
        element: <Form.Register />,
      },
      {
        path: "login",
        element: <Form.Login />,
      },
    ],
  },
]);
