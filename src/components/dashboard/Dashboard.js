import React, { useState, useEffect } from "react";
import { BsFillBuildingFill } from "react-icons/bs";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import { FaHouseDamage } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonMilitaryPointing } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import BillBarChart from "../billBarChart/BillBarChart";

function Dashboard() {
  let { user } = useSelector((store) => store.login);
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let token = localStorage.getItem("token");

  // states
  let [dashboard, setDashboard] = useState({});
  let [dashboardFetch, setDashboardFetch] = useState(0);
  let [dashboardError, setDashboardError] = useState("");

  const getDashboard = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setDashboard(res.data);
          setDashboardError("");
        });
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        //logout completely and navigate to login
        dispatch(logout());
        navigate("/");
      } else {
        if (err.response?.data?.alertMsg)
          setDashboardError(err.response.data.alertMsg);
        //set error message
        else setDashboardError(err.message);
      }
    } finally {
      setDashboardFetch(1);
    }
  };

  useEffect(() => {
    if (user.isfirstlogin) {
      navigate("/admin/change-password");
    }
  }, []);
  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <div className="container mt-5">
      {!dashboardFetch ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : dashboardError ? (
        <p className="text-danger text-center">{dashboardError}</p>
      ) : (
        <div className="row ">
          <div className="col-10 col-md-6 col-lg-4  text-white  rounded p-3 ">
            <div className="row m3 bg-success rounded">
              <div className="col-8">
                <p className="display-6">Flats </p>
                <p className="display-4">
                  <BsFillBuildingFill />
                </p>
              </div>
              <div className="col-4 d-flex justify-items-center">
                <p className="display-4 my-auto">{dashboard.flats}</p>
              </div>
            </div>
          </div>
          <div className="col-10 col-md-6 col-lg-4  text-white  rounded p-3 ">
            <div className="row m3 bg-primary rounded">
              <div className="col-8">
                <p className="display-6"> Flats Occupied </p>
                <p className="display-4">
                  <MdOutlineFamilyRestroom />
                </p>
              </div>
              <div className="col-4 d-flex justify-items-center">
                <p className="display-4 my-auto">{dashboard.occupied_flats}</p>
              </div>
            </div>
          </div>

          <div className="col-10 col-md-6 col-lg-4  text-white  rounded p-3 ">
            <div className="row m3 bg-dark rounded">
              <div className="col-8">
                <p className="display-6">Vacant Flats </p>
                <p className="display-4">
                  <FaHouseDamage />
                </p>
              </div>
              <div className="col-4 d-flex justify-items-center">
                <p className="display-4 my-auto">{dashboard.vacant_flats}</p>
              </div>
            </div>
          </div>
          <div className="col-10 col-md-6 col-lg-4  text-white  rounded p-3">
            <div className="row m3 bg-warning rounded">
              <div className="col-8">
                <p className="display-6">Security </p>
                <p className="display-4">
                  <FontAwesomeIcon icon={faPersonMilitaryPointing} />
                </p>
              </div>
              <div className="col-4 d-flex justify-items-center">
                <p className="display-4 my-auto">{dashboard.security}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mt-5">
        <BillBarChart />
      </div>
    </div>
  );
}

export default Dashboard;
