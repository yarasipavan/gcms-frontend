import React, { useState, memo } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { logout } from "../../slices/login.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";

function ChangeOwner({ owners, flats }) {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let token = localStorage.getItem("token");

  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");

  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (formObj) => {
    // parse the flat obj
    formObj.flat = JSON.parse(formObj.flat);
    formObj.flat.owner_id = formObj.owner_id;
    console.log(formObj);
    //call the api
    try {
      let res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/admin/changeOwner`,
        formObj.flat,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      console.log(res.data.payload);
      setErrorMessage("");
      reset();
    } catch (err) {
      if (err.response?.status === 401) {
        //logout completely and navigate to login
        dispatch(logout());
        navigate("/");
      } else {
        if (err.response?.data?.alertMsg) {
          setErrorMessage(err.response.data.alertMsg);
          setMessage("");
        } else {
          setErrorMessage(err.message);
          setMessage("");
        }
      }
    }
  };
  return (
    <div>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h4>Change Owner</h4>
          </Accordion.Header>
          <Accordion.Body>
            <div className=" mx-auto  rounded pt-3">
              <h6 className="text-center" style={{}}>
                Change Owner
              </h6>
              <form className=" w-75 mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-3">
                  <label className="mb-1 fw-bold" htmlFor="flat">
                    Flat
                  </label>
                  <select
                    className="form-control"
                    {...register("flat", { required: true })}
                  >
                    <option value={null}>--select flat--</option>
                    {flats.map((flat, index) => (
                      <option
                        key={index}
                        value={JSON.stringify({
                          block: flat.block,
                          flat_number: flat.flat_number,
                        })}
                      >
                        {flat.block} - {flat.flat_number}
                      </option>
                    ))}
                  </select>

                  {errors.flat?.type === "required" && (
                    <p className="text-danger">
                      Select flat to change the owner
                    </p>
                  )}
                </div>

                {/* owner */}
                <div className="mt-3">
                  <label className="mb-1 fw-bold" htmlFor="owner_id">
                    Owner
                  </label>
                  <select
                    className="form-control"
                    {...register("owner_id", { required: true })}
                  >
                    <option disabled selected value={null}>
                      --select flat--
                    </option>
                    {owners.map((owner, index) => (
                      <option key={index} value={owner.owner_id}>
                        {owner.name} - {owner.owner_id}
                      </option>
                    ))}
                  </select>

                  {errors.owner_id?.type === "required" && (
                    <p className="text-danger">Select owner</p>
                  )}
                </div>

                <div className="mt-3 mb-3">
                  <button className="btn btn-primary d-block form-control pt-2 pb-">
                    change Owner
                  </button>
                </div>
              </form>

              <div className="mt-3">
                <p className="text-danger text-center fw-bold">
                  {errorMessage}
                </p>
              </div>

              <div className="mt-3">
                <p className="text-success text-center fw-bold">{message}</p>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default ChangeOwner;
