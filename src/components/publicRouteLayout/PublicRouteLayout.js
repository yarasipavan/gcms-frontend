import React from "react";
import { Outlet } from "react-router-dom";
import "./publicRouteLayout.css";
function PublicRouteLayout() {
  return (
    <div className="public w-100 vh-100">
      <div className="container pt-5">
        <div className="row">
          <div className="card shadow col col-10 col-md-8 col-lg-4 mx-auto mt-5 p-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicRouteLayout;
