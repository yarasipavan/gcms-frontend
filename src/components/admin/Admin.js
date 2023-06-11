import React from "react";
import SideBar from "../sideBar/SideBar";
import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <div>
      <div className="d-flex  align-items-stretch">
        <div className="col-auto bg-dark">
          <SideBar />
        </div>
        <div className="col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Admin;
