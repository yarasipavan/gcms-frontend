import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import AllSecurity from "../allSecurity/AllSecurity";
import AddSecurity from "../addSecurity/AddSecurity";

function AdminSecurity() {
  let { user } = useSelector((store) => store.login);
  let [securityFetched, setSecurityFetched] = useState(0);
  let [security, setSecurity] = useState([]);
  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");
  let token = localStorage.getItem("token");
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const getSecurity = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/admin/all-security`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setSecurity(res.data);
          setSecurityFetched(1);
          setErrorMessage("");
        });
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        //logout completely and navigate to login
        dispatch(logout());
        navigate("/");
      } else {
        //set error message
        setErrorMessage(err.message);
        setSecurityFetched(1);
      }
    }
  };
  useEffect(() => {
    getSecurity();
  }, []);

  const addSecurity = useCallback((newSecurity) => {
    setSecurity([newSecurity, ...security]);
  });

  const updateSecurity = useCallback((updatedSecurity) => {
    let newSecurityDetails = security.map((security) => {
      if (security.id == updatedSecurity.id) {
        security = updatedSecurity;
        console.log(updatedSecurity.id);
      }
      return security;
    });

    setSecurity(newSecurityDetails);
  });

  const deleteSecurity = useCallback((id) => {
    console.log(id);
    let newSecurityDetails = [];
    security.map((guard) => {
      if (guard.id != id) {
        newSecurityDetails.push(guard);
      }
    });
    setSecurity(newSecurityDetails);
  });
  return (
    <div>
      {!securityFetched ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : errorMessage ? (
        errorMessage
      ) : (
        <div className="container mt-5 p-5">
          <div className="row">
            <div className="col col-12 col-lg-6 ">
              <AddSecurity addSecurity={addSecurity} />
            </div>
            <div className="col col-12 col-lg-6 ">
              {/* <ChangeOwner flats={flats} owners={owners} /> */}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-12 ">
              <AllSecurity
                securities={security}
                updateSecurity={updateSecurity}
                deleteSecurity={deleteSecurity}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSecurity;
