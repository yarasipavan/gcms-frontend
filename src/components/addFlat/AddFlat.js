import React, { useState, memo } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { logout } from "../../slices/login.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";

function AddFlat({ addFlat }) {
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
    //add date to formObj
    console.log("form obj", formObj);
    // convert flat number into number formate
    formObj.flat_number = Number(formObj.flat_number);
    //call the api
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/admin/flat`,
        formObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      addFlat(res.data.payload);

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
            <h4>Add Flat</h4>
          </Accordion.Header>
          <Accordion.Body>
            <div className=" mx-auto  rounded pt-3">
              <h6 className="text-center" style={{}}>
                Add Flat
              </h6>
              <form className=" w-75 mx-auto" onSubmit={handleSubmit(onSubmit)}>
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
                    Add Flat
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

export default AddFlat;
