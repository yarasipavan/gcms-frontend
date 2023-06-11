import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";
import { toTitleCase } from "../custom_modules/toTitleCase";
function NotUsingServices() {
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
        .get(
          `${process.env.REACT_APP_SERVER_URL}/occupant/not-using-services`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
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
    getServices();
  }, []);

  // activate service
  let newServices = [];
  const activateService = (service) => {
    services.map((notUsingService) => {
      if (notUsingService != service) newServices.push(notUsingService);
    });
    setServices(newServices);
  };

  // activate service handle
  const handleActivate = async (service) => {
    const shouldStop = window.confirm(
      `Are you sure you want to start ${service} service`
    );
    if (shouldStop) {
      try {
        //update the details in db
        let startService = { services: [service] };
        let res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/occupant/add-services`,
          startService,
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );

        activateService(service);
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
          <h4 className="m-3">Not Using Services</h4>
          {!services.length ? (
            <p className="text-success">You actived all services</p>
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
                        className="btn btn-success"
                        onClick={() => handleActivate(service)}
                      >
                        <FontAwesomeIcon icon={faCircleCheck} /> Activate
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

export default NotUsingServices;
