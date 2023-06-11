import React, { useState, memo } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { logout } from "../../slices/login.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";

function AddOwner({ addOwner, flats }) {
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
    // convert Phone number into number formate
    formObj.phone = Number(formObj.phone);
    // parse the Flats Obj
    formObj.Flats = formObj.Flats.map((flat) => {
      let block_flat = JSON.parse(flat);
      return block_flat;
    });
    console.log(formObj);
    //call the api
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/admin/owner`,
        formObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      addOwner(res.data.payload);
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
            <h4>Add Owner</h4>
          </Accordion.Header>
          <Accordion.Body>
            <div className=" mx-auto  rounded pt-3">
              <h6 className="text-center" style={{}}>
                Add Owner
              </h6>
              <form className=" w-75 mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-3">
                  <label className="mb-1 fw-bold" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control "
                    placeholder="Name"
                    {...register("name", { required: true })}
                  ></input>

                  {errors.name?.type === "required" && (
                    <p className="text-danger">Please enter name</p>
                  )}
                </div>
                <div className="mt-3">
                  <label className="mb-1 fw-bold" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control "
                    placeholder="abc@abc.vom"
                    {...register("email", { required: true })}
                  ></input>
                  {errors.email?.type === "required" && (
                    <p className="text-danger">Please enter email</p>
                  )}
                </div>
                {/* phone */}
                <div className="mt-3">
                  <label className="mb-1 fw-bold" htmlFor="phone">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    className="form-control "
                    placeholder="9121xxxxxx"
                    {...register("phone", { required: true })}
                  ></input>
                  {errors.phone?.type === "required" && (
                    <p className="text-danger">Please enter phone number</p>
                  )}
                </div>
                {/* flats */}

                <div className="mt-3">
                  <label className="mb-1 fw-bold" htmlFor="Flats">
                    Flats
                  </label>
                  (optional)
                  <select
                    multiple
                    size={"4"}
                    className="form-control"
                    {...register("Flats")}
                  >
                    <option disabled value={null}>
                      --select flats--
                    </option>
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
                </div>
                <div className="mt-3 mb-3">
                  <button className="btn btn-primary d-block form-control pt-2 pb-">
                    Add Owner
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

export default AddOwner;
