import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import AllOccupants from "../allOccupants/AllOccupants";
import AddOccupant from "../AddOccupant/AddOccupant";

function AdminOccupants() {
  let { user } = useSelector((store) => store.login);
  let [ocuupantsFetched, setOccupantsFetched] = useState(0);
  let [occupants, setOccupants] = useState([]);
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
        .get(`${process.env.REACT_APP_SERVER_URL}/admin/vacant-flats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFlats(res.data.payload);
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

  const getOccupants = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/admin/occupants`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setOccupants(res.data);
          setOccupantsFetched(1);
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
        setFlatsFecthed(1);
      }
    }
  };

  useEffect(() => {
    getFlats();
    getOccupants();
  }, []);

  const addOccupant = useCallback(() => {
    getFlats();
    getOccupants();
  });

  const updateOccupant = useCallback((updatedOccupant) => {
    let newOccupantDetails = occupants.map((occupant) => {
      if (occupant.occupant_id === updatedOccupant.occupant_id) {
        occupant.Occupant = updatedOccupant;
      }

      return occupant;
    });

    setOccupants(newOccupantDetails);
  });

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
        <div className="container mt-5 p-5">
          <div className="row">
            <div className="col col-12 col-lg-6 ">
              <AddOccupant flats={flats} addOccupant={addOccupant} />
            </div>
            <div className="col col-12 col-lg-6 ">
              {/* <ChangeOwner flats={flats} owners={owners} /> */}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-12 ">
              <AllOccupants
                occupants={occupants}
                updateOccupant={updateOccupant}
                deleteOccupant={addOccupant}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOccupants;
