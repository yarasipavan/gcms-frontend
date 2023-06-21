import React, { useState, memo, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import { useForm } from "react-hook-form";
import Accordion from "react-bootstrap/Accordion";

function AddVisitor() {
  let { user } = useSelector((store) => store.login);
  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");
  let token = localStorage.getItem("token");
  let [flats, setFlats] = useState([]);
  let [detailsObj, setDetailsObj] = useState({});
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  let dispatch = useDispatch();
  let navigate = useNavigate();

  let visitingTo = watch("visiting_to");

  const getFlats = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/security/flat-details`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFlats(res.data);
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
      }
    }
  };

  useEffect(() => {
    if (user.isfirstlogin) {
      navigate("/security/change-password");
    } else {
      getFlats();
    }
  }, []);

  const onSubmit = async (formObj) => {
    if (formObj.visiting_to == "") {
      delete formObj.visiting_to;
    } else {
      formObj.visiting_to = JSON.parse(formObj.visiting_to);
      formObj.flat_number = formObj.visiting_to.flat_number;
      formObj.block = formObj.visiting_to.block;
      delete formObj.visiting_to;
    }
    // change phone and aadhar type to number
    formObj.phone = Number(formObj.phone);
    formObj.visitor_aadhar = Number(formObj.visitor_aadhar);
    //call the api
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/security/visitor-record`,
        formObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
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
        } else {
          setErrorMessage(err.message);
        }
        setMessage("");
      }
    }
  };

  const getFlatDetails = (block, flat) => {
    let result = {};
    setDetailsObj({});
    flats?.map((details) => {
      if (details.block == block && details.flat_number == flat) {
        result.owner_name = details.Owner.name;
        result.owner_phone = details.Owner.phone;
        if (details.Occupant) {
          result.occupant_name = details.Occupant.occupant_name;

          result.occupant_phone = details.Occupant.phone;
        }
      }
    });
    return result;
  };

  const handleChangeVisitingTo = (event) => {
    let details = {};
    if (event.target.value) {
      const visiting_to = JSON.parse(event.target.value);
      console.log(visiting_to);
      details = getFlatDetails(visiting_to.block, visiting_to.flat_number);
    }
    setDetailsObj(details);
  };

  return (
    <div>
      {errorMessage ? (
        <p className="text-danger text-center">{errorMessage}</p>
      ) : (
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4>Add Visitor</h4>
            </Accordion.Header>
            <Accordion.Body>
              <form
                className=" w-100  mx-auto mb-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    {/* visitor name */}
                    <div className="mt-3">
                      <label className="mb-1" htmlFor="visitor_name">
                        Visitor Name
                      </label>
                      <input
                        type="text"
                        placeholder="visitor name"
                        className="form-control"
                        id="visitor_name"
                        {...register("visitor_name", {
                          required: "name is required",
                          minLength: {
                            value: 3,
                            message: "name must contain atleast 3 characters",
                          },
                        })}
                      />
                      {errors.visitor_name?.type === "required" && (
                        <p className="text-danger">Enter visitor name</p>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    {/* aadhar */}
                    <div className="mt-3">
                      <label className="mb-1" htmlFor="visitor_aadhar">
                        Visitor aadhar number
                      </label>
                      <input
                        type="number"
                        placeholder="aadhar number"
                        id="visitor_aadhar"
                        className="form-control"
                        {...register("visitor_aadhar", {
                          required: "Enter aadhar number",
                          pattern: {
                            value: /^\d{12}$/,
                            message: "Enter 12 digits Aadhaar number",
                          },
                        })}
                      />
                      {errors.visitor_aadhar && (
                        <p className="text-danger">
                          {errors.visitor_aadhar.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    {/* visiting_to occupant od */}
                    <div className="mt-3">
                      <label className="mb-1" htmlFor="visiting_to">
                        Visiting to
                      </label>
                      (Optional)
                      <select
                        defaultValue={""}
                        className="form-control mt-1"
                        id="visiting_to"
                        {...register("visiting_to")}
                        onChange={handleChangeVisitingTo}
                      >
                        <option value={""}> -- select -- </option>
                        {flats?.map((flat, index) => (
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
                  </div>

                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    {/* phone*/}
                    <div className="mt-3">
                      <label className="mb-1" htmlFor="phone">
                        Phone
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
                  </div>

                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    {/*purpose */}
                    <div className="mt-3">
                      <label className="mb-1" htmlFor="purpose">
                        Purpose
                      </label>
                      <textarea
                        className="form-control "
                        id="purpose"
                        {...register("purpose", { required: true })}
                      ></textarea>
                      {errors.purpose?.type === "required" && (
                        <p className="text-danger">Please enter the purpose</p>
                      )}
                    </div>
                  </div>
                  {detailsObj.owner_name ? (
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                      <div className="mt-3">
                        <div className="row border">
                          <div className="col col-12 col-md-6">
                            <h5>Owner Details:</h5>
                            <p>Name: {detailsObj.owner_name}</p>
                            <p>Number: {detailsObj.owner_phone}</p>
                          </div>
                          <div className="col col-12 col-md-6">
                            <h5>Occupant Details:</h5>
                            {detailsObj.occupant_name ? (
                              <>
                                <p>Name: {detailsObj.occupant_name}</p>
                                <p>Number: {detailsObj.occupant_phone}</p>
                              </>
                            ) : (
                              <p className="text-danger">No Occupant</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="mt-4 ">
                  <button className="btn btn-primary d-block mx-auto  ">
                    Add Visitor
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
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
    </div>
  );
}

export default AddVisitor;
