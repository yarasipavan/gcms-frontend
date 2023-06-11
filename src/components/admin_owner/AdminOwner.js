import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import AddOwner from "../addOwner/AddOwner";
import AllOwners from "../AllOwners/AllOwners";
import ChangeOwner from "../changeOwner/ChangeOwner";

function AdminOwner() {
  let { user } = useSelector((store) => store.login);
  let [ownersFetched, setOwnersFetched] = useState(0);
  let [owners, setOwners] = useState([]);
  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");
  let [flats, setFlats] = useState([]);
  let [flatsFecthed, setFlatsFecthed] = useState(0);
  let token = localStorage.getItem("token");
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const getFlats = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/admin/flats-details`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFlats(res.data);
          setFlatsFecthed(1);
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
        setFlatsFecthed(1);
      }
    }
  };

  const getOwners = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/admin/owners`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setOwners(res.data);
          setOwnersFetched(1);
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
        setOwnersFetched(1);
      }
    }
  };

  useEffect(() => {
    getOwners();
    getFlats();
  }, []);

  const addOwner = useCallback((owner) => {
    setOwners([...owners, owner]);
  });

  const updateOwner = useCallback((updatedOwner) => {
    let newOwnersDetails = owners.map((owner) => {
      if (owner.owner_id === updatedOwner.owner_id) {
        owner = updatedOwner;
      }
      // console.log(owner);
      return owner;
    });

    setOwners(newOwnersDetails);
  });
  return (
    <div>
      {!ownersFetched || !flatsFecthed ? (
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
              <AddOwner addOwner={addOwner} flats={flats} />
            </div>
            <div className="col col-12 col-lg-6 ">
              <ChangeOwner flats={flats} owners={owners} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col  col-12">
              <AllOwners owners={owners} updateOwner={updateOwner} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOwner;
