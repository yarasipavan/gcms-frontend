import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";

import AddFlat from "../addFlat/AddFlat";
import UpdateFlat from "../updateFlat/UpdateFlat";
import AllFlats from "../allFlats/AllFlats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function Flats() {
  let { user } = useSelector((store) => store.login);
  let [flatsFecthed, setFlatsFecthed] = useState(0);
  let [flats, setFlats] = useState([]);
  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");
  let token = localStorage.getItem("token");
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const getFlats = () => {
    //get gdo heads
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

  useEffect(() => {
    getFlats();
  }, []);

  const addFlat = useCallback((newFlat) => {
    console.log("new flat", newFlat);
    setFlats([...flats, newFlat]);
  });

  const updateFlat = useCallback((old_flat, updatedFlat) => {
    let newFlatDetails = flats.map((flat) => {
      if (
        flat.block == old_flat.block &&
        flat.flat_number == old_flat.flat_number
      ) {
        flat = updatedFlat;
      }
      return flat;
    });
    setFlats(newFlatDetails);
  });

  console.log(flats);
  return (
    <div>
      {!flatsFecthed ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : errorMessage ? (
        errorMessage
      ) : (
        <div className="container  p-5">
          <div className="row ">
            <div className="col col-12 col-lg-6 mt-5 ">
              <AddFlat addFlat={addFlat} />
            </div>
            <div className="col col-12 mt-5 col-lg-6 ">
              <UpdateFlat flats={flats} updateFlat={updateFlat} />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col  ">
              <AllFlats flats={flats} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flats;
