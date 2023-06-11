import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";

import { useSelector, useDispatch } from "react-redux";
import NavDropdown from "react-bootstrap/NavDropdown";
import { logout } from "../../slices/login.slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonMilitaryPointing } from "@fortawesome/free-solid-svg-icons";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faPeopleRoof } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { AiFillStop } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";

function SideBar() {
  let { user } = useSelector((store) => store.login);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const logoutFn = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <div className=" sidebar d-flex  flex-column bg-dark text-white p-4 vh-100">
      <div>
        <a className="d-flex align-items-center text-white">
          <i className="bi bi-buildings-fill fs-5 me-2"></i>
          <span className="fs-4 d-none d-md-inline">Gated Community</span>
        </a>
        <hr className="text-secondary mt-2" />
        <ul className="nav nav-pills flex-column p-0 m-0">
          {user?.role === "admin" ? (
            <>
              <li className="nav-item p-1">
                <Link to="" className="nav-link text-white">
                  <i className="bi bi-speedometer me-2 fs-5"></i>
                  <span className="fs-5 d-none d-md-inline">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item p-1">
                <Link to="flats" className="nav-link text-white">
                  <i className="bi bi-houses-fill me-2 fs-5"></i>
                  <span className="fs-5 d-none d-md-inline">Flats</span>
                </Link>
              </li>
              <li className="nav-item p-1">
                <Link to="owners" className="nav-link text-white">
                  <i className="bi bi-person-fill me-2 fs-5"></i>
                  <span className="fs-5 d-none d-md-inline">Owners</span>
                </Link>
              </li>
              <li className="nav-item p-1">
                <Link to="occupants" className="nav-link text-white">
                  <FontAwesomeIcon icon={faPeopleRoof} className="me-2 fs-5" />
                  <span className="fs-5 d-none d-md-inline">Occupants</span>
                </Link>
              </li>
              <li className="nav-item p-1">
                <Link to="security" className="nav-link text-white">
                  <FontAwesomeIcon
                    icon={faPersonMilitaryPointing}
                    className="me-2 fs-5"
                  />
                  <span className="fs-5 d-none d-md-inline">Security</span>
                </Link>
              </li>
              <li className="nav-item p-1">
                <Link to="bills" className="nav-link text-white">
                  <FontAwesomeIcon
                    icon={faFileInvoiceDollar}
                    className="me-2 fs-5"
                  />
                  <span className="fs-5 d-none d-md-inline"> Bills</span>
                </Link>
              </li>
              <li className="nav-item p-1">
                <Link to="" className="nav-link text-white">
                  <FontAwesomeIcon icon={faBook} className="me-2 fs-5" />
                  <span className="fs-5 d-none d-md-inline">
                    {" "}
                    Visitors record
                  </span>
                </Link>
              </li>
            </>
          ) : user.role === "occupant" ? (
            <>
              <li className="nav-item p-1">
                <Link to="using-services" className="nav-link text-white">
                  <FontAwesomeIcon icon={faCircleCheck} className="me-2 fs-5" />
                  <span className="fs-5 d-none d-md-inline">
                    {" "}
                    Using services
                  </span>
                </Link>
              </li>
              <li className="nav-item p-1">
                <Link to="not-using-services" className="nav-link text-white">
                  {/* <FontAwesomeIcon icon={faCircleCheck} className="me-2 fs-5" /> */}
                  <span className="me-2 fs-5">
                    <AiFillStop />
                  </span>
                  <span className="fs-5 d-none d-md-inline">
                    {" "}
                    Not using services
                  </span>
                </Link>
              </li>
              <li className="nav-item p-1">
                <Link to="bills" className="nav-link text-white">
                  <FontAwesomeIcon
                    icon={faFileInvoiceDollar}
                    className="me-2 fs-5"
                  />
                  <span className="fs-5 d-none d-md-inline">Bills</span>
                </Link>
              </li>
            </>
          ) : (
            ""
          )}
        </ul>
      </div>
      <div>
        <hr className="text-secondary"></hr>

        {/* <span>{user.username}</span> */}
        <span className="d-none d-md-inline">
          <NavDropdown title={`${user.username}`} id="basic-nav-dropdown">
            <NavDropdown.Item>Change Password</NavDropdown.Item>
            <NavDropdown.Item>Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logoutFn}>Logout</NavDropdown.Item>
          </NavDropdown>
        </span>
        <span className="d-inline d-md-none me-2 fs-5">
          <NavDropdown title={<FaUserCircle />} id="basic-nav-dropdown">
            <NavDropdown.Item>Change Password</NavDropdown.Item>
            <NavDropdown.Item>Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logoutFn}>Logout</NavDropdown.Item>
          </NavDropdown>
        </span>
      </div>
    </div>
  );
}

export default SideBar;
