import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";
import { toTitleCase } from "../custom_modules/toTitleCase";

function Usingservices() {
  let { user } = useSelector((store) => store.login);
  let [servicesFetched, setServicesFetched] = useState(0);
  let [services, setServices] = useState([]);
  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");
  let token = localStorage.getItem("token");
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const getServices = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/occupant/using-services`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setServices(res.data);
          setServicesFetched(1);
          setErrorMessage("");
        });
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        //logout completely and navigate to login
        dispatch(logout());
        navigate("/");
      } else {
        //set error message
        setErrorMessage(err.message);
        setServicesFetched(1);
      }
    }
  };

  useEffect(() => {
    if (user.isfirstlogin) {
      navigate("/occupant/change-password");
    }
  }, []);
  useEffect(() => {
    getServices();
  }, []);

  let newServices = [];
  const removeService = (service) => {
    services.map((usingService) => {
      if (usingService != service) newServices.push(usingService);
    });
    setServices(newServices);
  };

  // pause / stop service
  const handleStop = async (service) => {
    const shouldStop = window.confirm(
      `Are you sure you want to stop ${service} service`
    );
    if (shouldStop) {
      try {
        //update the details in db
        let stopService = { service: service };
        let res = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/occupant/stop-service`,
          stopService,
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );
        removeService(service);
      } catch (err) {
        if (err.response?.status == 401) {
          dispatch(logout());
          navigate("/");
        } else {
          if (err.response?.data.alertMsg) {
            setErrorMessage(err.response.data.alertMsg);
          } else {
            setErrorMessage(err.message);
          }
        }
      }
    }
  };

  // function to title case the service name

  return (
    <div>
      {!servicesFetched ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : errorMessage ? (
        errorMessage
      ) : (
        <div className="col col-12 col-md-5 mx-auto mt-5 text-center">
          <h4 className="m-3">Using Services</h4>
          {!services.length ? (
            <p className="text-danger">You don't any active services</p>
          ) : (
            <Table responsive="lg" striped hover className="w-md-50 mx-auto">
              <thead style={{ fontSize: "0.9rem" }}>
                <tr>
                  <th>Service</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.9rem" }}>
                {services?.map((service, index) => (
                  <tr key={index}>
                    <td>{toTitleCase(service)}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleStop(service)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Stop service
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}

export default Usingservices;
