import "./App.css";

import Home from "./components/home/Home";
import Login from "./components/login/Login";
import PublicRouteLayout from "./components/publicRouteLayout/PublicRouteLayout";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from "./components/admin/Admin";
import Dashboard from "./components/dashboard/Dashboard";
import Flats from "./components/flats/Flats";
import AdminOwner from "./components/admin_owner/AdminOwner";
import AdminOccupants from "./components/adminOccupants/AdminOccupants";
import AdminSecurity from "./components/adminSecurity/AdminSecurity";
import Occupant from "./components/occupant/Occupant";
import Usingservices from "./components/usingServices/Usingservices";
import NotUsingServices from "./components/notUsingServices/NotUsingServices";
import OccupantBill from "./components/occupantBill/OccupantBill";

function App() {
  const browserRouterObj = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "portal",
      element: <PublicRouteLayout />,
      children: [
        {
          path: "",
          element: <Login />,
        },
        {
          path: "login",
          element: <Login />,
        },
        ,
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
      ],
    },
    {
      path: "admin",
      element: <Admin />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "flats",
          element: <Flats />,
        },
        {
          path: "owners",
          element: <AdminOwner />,
        },
        {
          path: "occupants",
          element: <AdminOccupants />,
        },
        {
          path: "security",
          element: <AdminSecurity />,
        },
        {
          path: "bills",
          element: <OccupantBill />,
        },
      ],
    },
    {
      path: "occupant",
      element: <Occupant />,
      children: [
        {
          path: "",
          element: <Usingservices />,
        },
        {
          path: "using-services",
          element: <Usingservices />,
        },
        {
          path: "not-using-services",
          element: <NotUsingServices />,
        },
        {
          path: "bills",
          element: <OccupantBill />,
        },
      ],
    },
  ]);
  return <RouterProvider router={browserRouterObj}></RouterProvider>;
}

export default App;
