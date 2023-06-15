import React, { useState, memo } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { logout } from "../../slices/login.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";

function AddOccupant({ flats, addOccupant }) {
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
    watch,
  } = useForm();

  const selectedOwnership = watch("ownership");
  console.log(selectedOwnership);

  const onSubmit = async (formObj) => {
    // convert Phone number into number formate
    formObj.phone = Number(formObj.phone);
    // parse the Flats Obj
    formObj.flat = JSON.parse(formObj.flat);
    formObj.flat.ownership = formObj.ownership;
    if (formObj.rent) formObj.flat.rent = formObj.rent;

    // delete unwated
    delete formObj.ownership;
    delete formObj.rent;
    console.log(formObj);
    //call the api
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/admin/occupant`,
        formObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      console.log(res.data.payload);
      addOccupant();
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
            <h4>Add Occupant</h4>
          </Accordion.Header>
          <Accordion.Body>
            <div className=" mx-auto  rounded pt-3">
              <h6 className="text-center" style={{}}>
                Add Occupant
              </h6>
              <form className=" w-75 mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-3">
                  <label className="mb-1 fw-bold" htmlFor="occupant_name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="occupant_name"
                    className="form-control "
                    placeholder="Name"
                    {...register("occupant_name", {
                      required: "name is required",
                      minLength: {
                        value: 3,
                        message: "name must contain atleast 3 characters",
                      },
                    })}
                  ></input>

                  {errors.occupant_name && (
                    <p className="text-danger">
                      {errors.occupant_name.message}
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  <label className="mb-1 fw-bold" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
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
                    type="number"
                    placeholder="9121xxxxx"
                    className="form-control"
                    id="phone"
                    {...register("phone", {
                      required: "Phone number is required",
                      minLength: {
                        value: 10,
                        message: "Phone number must be at least 10 digits",
                      },
                      maxLength: {
                        value: 10,
                        message: "Phone number must not exceed 10 digits",
                      },
                      pattern: {
                        value: /^\d+$/,
                        message: "Phone number must only contain digits",
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className="text-danger">{errors.phone.message}</p>
                  )}
                </div>

                {/* flats */}

                <div className="mt-3">
                  <label className="mb-1 fw-bold" htmlFor="flat">
                    select Flat
                  </label>
                  <select
                    className="form-control"
                    {...register("flat", { required: true })}
                  >
                    <option selected disabled value={""}>
                      --select flat--
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
                  {errors.flat?.type === "required" && (
                    <p className="text-danger">Select flat</p>
                  )}
                </div>

                {/* ownership  */}
                <div className="mt-3">
                  <label className="mb-1 fw-bold" htmlFor="ownership">
                    select ownership
                  </label>

                  <select
                    className="form-control"
                    {...register("ownership", { required: true })}
                    name="ownership"
                  >
                    <option selected disabled value={""}>
                      --select ownership--
                    </option>
                    <option value="owner">Owner</option>
                    <option value="tenant">Tenant</option>
                  </select>
                  {errors.ownership?.type === "required" && (
                    <p className="text-danger">Select ownership</p>
                  )}
                </div>

                {selectedOwnership === "tenant" ? (
                  <div className="mt-3">
                    <label className="mb-1 fw-bold" htmlFor="rent">
                      Rent
                    </label>
                    (optional)
                    <input
                      type="number"
                      className="form-control "
                      placeholder="25000"
                      {...register("rent")}
                    ></input>
                  </div>
                ) : (
                  ""
                )}
                <div className="mt-3 mb-3">
                  <button className="btn btn-primary d-block form-control pt-2 pb-">
                    Add Occupant
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

export default AddOccupant;
