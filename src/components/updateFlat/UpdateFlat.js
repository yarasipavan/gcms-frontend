import React, { useState, memo } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { logout } from "../../slices/login.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";

function UpdateFlat({ flats, updateFlat }) {
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
    const old_flat = JSON.parse(formObj.old_flat);
    // delete old flat from formObj
    delete formObj.old_flat;
    console.log("form obj", formObj);

    // convert flat number into number formate
    formObj.flat_number = Number(formObj.flat_number);
    //call the api
    try {
      let res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/admin/flat/block/${old_flat.block}/flat_number/${old_flat.flat_number}`,
        formObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      updateFlat(old_flat, res.data.payload);
      setErrorMessage("");
      reset();
    } catch (err) {
      if (err.response.status === 401) {
        //logout completely and navigate to login
        dispatch(logout());
        navigate("/");
      } else {
        console.log(err.response.data.alertMsg);
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
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h4>Update flat</h4>
          </Accordion.Header>
          <Accordion.Body>
            <div className=" mx-auto  rounded pt-3">
              <h6 className="text-center">Update Flat</h6>
              <form className=" w-75 mx-auto" onSubmit={handleSubmit(onSubmit)}>
                {/* select flat */}
                <div className="mt-3">
                  <label className="mb-1" htmlFor="old_flat">
                    Block
                  </label>
                  <select
                    className="form-control"
                    {...register("old_flat", { required: true })}
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

                  {errors.old_flat?.type === "required" && (
                    <p className="text-danger">Select flat to update</p>
                  )}
                </div>

                <div className="mt-3">
                  <label className="mb-1" htmlFor="block">
                    Block
                  </label>
                  <input
                    type="text"
                    className="form-control "
                    {...register("block", { required: true })}
                  ></input>

                  {errors.block?.type === "required" && (
                    <p className="text-danger">Please Enter block name</p>
                  )}
                </div>
                <div className="mt-3">
                  <label className="mb-1" htmlFor="flat_number">
                    Flat Number
                  </label>
                  <input
                    type="number"
                    className="form-control "
                    {...register("flat_number", { required: true })}
                  ></input>
                  {errors.flat_number?.type === "required" && (
                    <p className="text-danger">Please enter flat number</p>
                  )}
                </div>

                <div className="mt-3 mb-3">
                  <button className="btn btn-primary d-block form-control pt-2 pb-">
                    Update Flat
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

export default UpdateFlat;
