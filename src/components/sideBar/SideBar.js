import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
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
import { BsTools } from "react-icons/bs";
import { BsArrowReturnLeft, BsArrowReturnRight } from "react-icons/bs";

function SideBar() {
  let { user } = useSelector((store) => store.login);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const logoutFn = () => {
    dispatch(logout());
    navigate("/");
  };
  const changePassword = () => {
    navigate("change-password");
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
                <NavLink to="dashboard" className="nav-link text-white">
                  <i className="bi bi-speedometer me-2 fs-5"></i>
                  <span className="fs-5 d-none d-md-inline">Dashboard</span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink to="flats" className="nav-link text-white">
                  <i className="bi bi-houses-fill me-2 fs-5"></i>
                  <span className="fs-5 d-none d-md-inline">Flats</span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink to="owners" className="nav-link text-white">
                  <i className="bi bi-person-fill me-2 fs-5"></i>
                  <span className="fs-5 d-none d-md-inline">Owners</span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink to="occupants" className="nav-link text-white">
                  <FontAwesomeIcon icon={faPeopleRoof} className="me-2 fs-5" />
                  <span className="fs-5 d-none d-md-inline">Occupants</span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink to="security" className="nav-link text-white">
                  <FontAwesomeIcon
                    icon={faPersonMilitaryPointing}
                    className="me-2 fs-5"
                  />
                  <span className="fs-5 d-none d-md-inline">Security</span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink to="bills" className="nav-link text-white">
                  <FontAwesomeIcon
                    icon={faFileInvoiceDollar}
                    className="me-2 fs-5"
                  />
                  <span className="fs-5 d-none d-md-inline"> Bills</span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink to="visitors-record" className="nav-link text-white">
                  <FontAwesomeIcon icon={faBook} className="me-2 fs-5" />
                  <span className="fs-5 d-none d-md-inline">
                    {" "}
                    Visitors record
                  </span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink to="services" className="nav-link text-white">
                  <span className="me-2 fs-5">
                    <BsTools />
                  </span>
                  <span className="fs-5 d-none d-md-inline"> Services</span>
                </NavLink>
              </li>
            </>
          ) : user.role === "occupant" ? (
            <>
              <li className="nav-item p-1">
                <NavLink to="using-services" className="nav-link text-white">
                  <FontAwesomeIcon icon={faCircleCheck} className="me-2 fs-5" />
                  <span className="fs-5 d-none d-md-inline">
                    {" "}
                    Using services
                  </span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink
                  to="not-using-services"
                  className="nav-link text-white"
                >
                  {/* <FontAwesomeIcon icon={faCircleCheck} className="me-2 fs-5" /> */}
                  <span className="me-2 fs-5">
                    <AiFillStop />
                  </span>
                  <span className="fs-5 d-none d-md-inline">
                    {" "}
                    Not using services
                  </span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink to="bills" className="nav-link text-white">
                  <FontAwesomeIcon
                    icon={faFileInvoiceDollar}
                    className="me-2 fs-5"
                  />
                  <span className="fs-5 d-none d-md-inline">Bills</span>
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item p-1">
                <NavLink to="add-visitor" className="nav-link text-white">
                  <span className="me-2 fs-5">
                    <BsArrowReturnRight />
                  </span>
                  <span className="fs-5 d-none d-md-inline">Add Visitor</span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink to="note-return" className="nav-link text-white">
                  <span className="me-2 fs-5">
                    <BsArrowReturnLeft />
                  </span>
                  <span className="fs-5 d-none d-md-inline">Return Note</span>
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink to="visitors-record" className="nav-link text-white">
                  <span className="me-2 fs-5">
                    <FontAwesomeIcon icon={faBook} className="me-2 fs-5" />
                  </span>
                  <span className="fs-5 d-none d-md-inline">
                    Visitors Record
                  </span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      <div>
        <hr className="text-secondary"></hr>

        {/* <span>{user.username}</span> */}
        <span className="d-none d-md-inline">
          <NavDropdown title={`${user.username}`} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={changePassword}>
              Change Password
            </NavDropdown.Item>
            {user.role === "occupant" && (
              <NavDropdown.Item onClick={() => navigate("profile")}>
                Profile
              </NavDropdown.Item>
            )}
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logoutFn}>Logout</NavDropdown.Item>
          </NavDropdown>
        </span>
        <span className="d-inline d-md-none me-2 fs-5">
          <NavDropdown title={<FaUserCircle />} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={changePassword}>
              Change Password
            </NavDropdown.Item>
            {user.role === "occupant" && (
              <NavDropdown.Item onClick={() => navigate("profile")}>
                Profile
              </NavDropdown.Item>
            )}
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logoutFn}>Logout</NavDropdown.Item>
          </NavDropdown>
        </span>
      </div>
    </div>
  );
}

export default SideBar;
