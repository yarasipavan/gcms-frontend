import React from "react";
import SideBar from "../sideBar/SideBar";
import { Outlet } from "react-router-dom";

function Occupant() {
  return (
    <div className="d-flex  align-items-stretch">
      <div className="col-auto bg-dark">
        <SideBar />
      </div>
      <div className="col">
        <Outlet />
      </div>
    </div>
  );
}

export default Occupant;
