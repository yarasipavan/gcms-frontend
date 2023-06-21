import React from "react";
import SideBar from "../sideBar/SideBar";
import TopMenuBar from "../topMenuBar/TopMenuBar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/login.slice";
import { useNavigate } from "react-router-dom";

function Security() {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let { user } = useSelector((store) => store.login);
  if (user.role != "security") {
    dispatch(logout());
    navigate("/");
  }

  return (
    <div className="d-flex  align-items-stretch">
      <div className="col-auto bg-dark d-none d-lg-block">
        <SideBar />
      </div>
      <div className="col">
        <div className="col-auto bg-dark d-block d-lg-none">
          <TopMenuBar />
        </div>
        <div className="container mt-5">
          <div className="row">
            <div className="col">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Security;
