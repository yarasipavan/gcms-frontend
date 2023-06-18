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
import Security from "./components/security/Security";
import AddVisitor from "./components/addVisitor/AddVisitor";
import VisitorReturn from "./components/visitorReturn/VisitorReturn";
import VisitorsRecord from "./components/visitorsRecord/VisitorsRecord";
import ChangePassword from "./components/changePassword/ChangePassword";
import Profile from "./components/profile/Profile";
import ResetPassword from "./components/resetPassword/ResetPassword";
import Services from "./components/services/Services";
import PaymentSuccess from "./components/payment/PaymentSuccess";
import PaymentFailure from "./components/payment/PaymentFailure";
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
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
        {
          path: "success",
          element: <PaymentSuccess />,
        },
        {
          path: "failure",
          element: <PaymentFailure />,
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
          path: "dashboard",
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
        {
          path: "visitors-record",
          element: <VisitorsRecord />,
        },
        {
          path: "services",
          element: <Services />,
        },
        {
          path: "change-password",
          element: <ChangePassword />,
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
        {
          path: "change-password",
          element: <ChangePassword />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "security",
      element: <Security />,
      children: [
        {
          path: "",
          element: <AddVisitor />,
        },
        {
          path: "add-visitor",
          element: <AddVisitor />,
        },
        {
          path: "note-return",
          element: <VisitorReturn />,
        },
        {
          path: "visitors-record",
          element: <VisitorsRecord />,
        },
        {
          path: "change-password",
          element: <ChangePassword />,
        },
      ],
    },
  ]);
  return <RouterProvider router={browserRouterObj}></RouterProvider>;
}
export default App;
