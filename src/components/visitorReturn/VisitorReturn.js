import React, { useState, memo, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import { useForm } from "react-hook-form";
import Accordion from "react-bootstrap/Accordion";

function VisitorReturn() {
  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");
  let token = localStorage.getItem("token");
  let [visitors, setVisitors] = useState([]);
  let [fetch, setFetch] = useState(0);
  console.log("******", token);
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const getVisitors = () => {
    try {
      axios
        .get(
          `${process.env.REACT_APP_SERVER_URL}/security/not-vacated-visitors-record`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setVisitors(res.data);
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
    } finally {
      setFetch(1);
    }
  };

  const updateVisitors = (returnedVisitor) => {
    let newVisitorDetails = [];
    visitors?.map((visitor) => {
      if (visitor.id != returnedVisitor.id) newVisitorDetails.push(visitor);
    });
    setVisitors(newVisitorDetails);
  };
  useEffect(() => {
    getVisitors();
  }, []);
  const onSubmit = async (formObj) => {
    let id = Number(formObj.id);
    try {
      let res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/security/return/visitor_id/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      updateVisitors(res.data.payload);
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

  return (
    <div>
      {!fetch ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : errorMessage ? (
        <p className="text-danger text-center">{errorMessage}</p>
      ) : (
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4>Note Return</h4>
            </Accordion.Header>
            <Accordion.Body>
              <form
                className=" w-100 mx-auto"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="text-start">
                  {/* visitor id */}
                  <div className="mt-3 col-8 col-md-4 mx-auto">
                    <label className="mb-1 fw-bold" htmlFor="id">
                      select Visistor
                    </label>

                    <select
                      defaultValue={""}
                      id="id"
                      className="form-control "
                      {...register("id", { required: true })}
                    >
                      <option disabled value={""}>
                        --select visitor--
                      </option>
                      {visitors?.map((visitor, index) => (
                        <option key={index} value={visitor.id}>
                          {visitor.visitor_name} - {visitor.id}
                        </option>
                      ))}
                    </select>

                    {errors.id?.type === "required" && (
                      <p className="text-danger">Select visitor</p>
                    )}
                  </div>

                  <div className="mt-3 mb-3 col-8 col-md-4 mx-auto">
                    <button className="btn btn-primary d-block form-control pt-2 pb-">
                      Note return
                    </button>
                  </div>
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

export default VisitorReturn;
