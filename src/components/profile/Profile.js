import React, { useEffect, useState } from "react";
import dummyImg from "../../images/dummy_profile.jpg";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/login.slice";
import { useNavigate } from "react-router-dom";

function Profile() {
  let [profile, setProfile] = useState({});
  let [fetched, setFetched] = useState(0);
  let [errorMsg, setErrorMsg] = useState("");
  let token = localStorage.getItem("token");
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const getProfile = () => {
    setFetched(0);
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/occupant/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setProfile(res.data.payload);
        });
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        //logout completely and navigate to login
        dispatch(logout());
        navigate("/");
      } else {
        if (err.response?.data?.alertMsg) {
          setErrorMsg(err.response.data.alertMsg);
        } else {
          setErrorMsg(err.message);
        }
        //set error message

        setFetched(1);
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  console.log(profile);

  return (
    <div className="p-3">
      <h4 className="text-center ">Profile</h4>
      {errorMsg ? (
        <p className="text-danger">{errorMsg}</p>
      ) : profile ? (
        <div className="container mt-5   ">
          <div className="row ">
            <div className="col-12 col-md-10 col-lg-7 mx-auto">
              <div className="row row-cols-2 shadow p-3">
                <div className="col col-12 col-lg-4 ps-2">
                  <img src={dummyImg} width={120} height={120} />
                </div>
                <div className="col col-12 col-lg-8 ps-2 ">
                  <div className="row ">
                    <div className="col ps-3">
                      {profile?.occupant_name?.toUpperCase()}
                    </div>
                  </div>
                  <hr></hr>
                  <div className="row">
                    <div className="col col-lg-6">
                      <div className="row ">
                        <div className="col ps-3 ">
                          <span className="fw-bold">Occupant Id: </span>{" "}
                          {profile?.occupant_id}
                        </div>
                      </div>
                      <div className="row ">
                        <div className="col ps-3 ">
                          <span className="fw-bold">Email: </span>{" "}
                          {profile?.email}
                        </div>
                      </div>
                      <div className="row ">
                        <div className="col ps-3">
                          <span className="fw-bold">Phone: </span>
                          {profile?.phone}
                        </div>
                      </div>
                      <div className="row ">
                        <div className="col ps-3">
                          <span className="fw-bold">Status: </span>
                          {1 ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </div>
                    <div className="col col-lg-6">
                      <div className="row ">
                        <div className="col ps-3 ">
                          <span className="fw-bold">Flat: </span>
                          {profile?.Flat?.block} - {profile?.Flat?.flat_number}
                        </div>
                      </div>
                      {profile?.Flat?.ownership === "tenant" && (
                        <>
                          <div className="row ">
                            <div className="col ps-3 ">
                              <span className="fw-bold">Owner Name: </span>
                              {profile?.Flat?.Owner?.name}
                            </div>
                          </div>
                          <div className="row ">
                            <div className="col ps-3 ">
                              <span className="fw-bold">Owner Phone: </span>
                              {profile?.Flat?.Owner?.phone}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Profile;
