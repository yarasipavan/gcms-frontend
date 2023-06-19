import React from "react";
import SideBar from "../sideBar/SideBar";
import TopMenuBar from "../topMenuBar/TopMenuBar";
import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <div>
      <div className="d-flex  align-items-stretch">
        <div className="col-auto bg-dark d-none d-lg-block">
          <SideBar />
        </div>

        <div className="col">
          <div className="col-auto bg-dark d-block d-lg-none">
            <TopMenuBar />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Admin;
