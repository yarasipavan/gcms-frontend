import React, { useState, memo, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { logout } from "../../slices/login.slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
function VisitorsRecord() {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let token = localStorage.getItem("token");
  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");
  let [visitors, setVisitors] = useState([]);
  let { user } = useSelector((store) => store.login);
  let [visitorsFetched, setVisitorsFetched] = useState(0);
  let [startDateTime, setStartDateTime] = useState("");
  let [endDateTime, setEndDateTime] = useState("");
  let [total, setTotal] = useState(0);
  let [activePage, setActivePage] = useState(1);
  let [limit, setLimit] = useState(5);
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  let startTime = watch("start_time");

  const onSubmit = async (formObj) => {
    setVisitorsFetched(1);
    if (!formObj.end_time) {
      delete formObj.end_time;
      setEndDateTime("");
    } else {
      setEndDateTime(formObj.end_time);
    }
    setStartDateTime(formObj.start_time);
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/security/visitors-record-on-time?limit=${limit}`,
        formObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.alertMsg) {
        throw new Error(res.data.alertMsg);
      } else {
        setVisitors(res.data.visitors);
        setTotal(res.data.total);
        setErrorMessage("");
        reset();
        setVisitorsFetched(2);
      }
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
  const totalPages = (total) => {
    const pages = [];

    for (let i = 1; i <= Math.ceil(total / limit); i++) pages.push(i);
    return pages;
  };

  const getVisitorsOfPage = async (page) => {
    setActivePage(page);
    let body = {};
    body.start_time = startDateTime;
    if (endDateTime) body.end_time = endDateTime;
    //  call the page
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/security/visitors-record-on-time?page=${page}&limit=${limit}`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.alertMsg) {
        throw new Error(res.data.alertMsg);
      } else {
        setVisitors(res.data.visitors);
        setTotal(res.data.total);
        setErrorMessage("");
        reset();
        setVisitorsFetched(2);
      }
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

  const handleChangeLimit = (event) => {
    console.log(Number(event.target.value));
    setLimit(Number(event.target.value));
  };
  useEffect(() => {
    getVisitorsOfPage(1);
  }, [limit]);

  return (
    <div className="mt-5 text-center">
      <h4>Visitors Record</h4>

      <div className="container">
        <div className="row">
          <div className="col col-10 col-md-8 mx-auto">
            <form className="  mx-auto" onSubmit={handleSubmit(onSubmit)}>
              <div className="text-start row">
                {/* start_date */}
                <div className="mt-3 col-12 col-md-6 mx-auto">
                  <label className="mb-1 fw-bold" htmlFor="start_time">
                    From Time
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control "
                    {...register("start_time", { required: true })}
                  ></input>

                  {errors.start_time?.type === "required" && (
                    <p className="text-danger">From time is required</p>
                  )}
                </div>
                <div className="mt-3 col-12 col-md-6 mx-auto">
                  <label className="mb-1 fw-bold" htmlFor="end_time">
                    To Time
                  </label>
                  (Optional)
                  <input
                    type="datetime-local"
                    className="form-control "
                    min={startTime}
                    id="end_time"
                    {...register("end_time")}
                  ></input>
                </div>

                <div className="mt-3 mb-3 col-8 col-md-4 mx-auto">
                  <button className="btn btn-primary d-block form-control pt-2 pb-">
                    Get Visitors Record
                  </button>
                </div>
              </div>
            </form>
            {errorMessage && (
              <p className="text-danger text-center">{errorMessage}</p>
            )}
          </div>
        </div>
        {visitorsFetched === 2 && (
          <div className="row">
            <div className="col">
              <button
                className="btn btn-outline-primary  me-5 mt-5 "
                onClick={() => window.print()}
              >
                Print
              </button>
              <div className="col mt-5 ms-5 ">
                <nav aria-label="Page navigation example">
                  <ul className="pagination  ">
                    <span className="me-5 ">
                      <select className="p-2" onChange={handleChangeLimit}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </select>
                    </span>
                    {activePage != 1 && (
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => getVisitorsOfPage(activePage - 1)}
                        >
                          {"<<"}
                        </button>
                      </li>
                    )}
                    {totalPages(total).map((page) => (
                      <li
                        key={page}
                        className={`page-item ${
                          page == activePage ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link "
                          onClick={() => getVisitorsOfPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    {activePage != Math.ceil(total / limit) && (
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => getVisitorsOfPage(activePage + 1)}
                        >
                          {">>"}
                        </button>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
              <Table
                responsive="lg"
                striped
                hover
                bordered
                className="mt-3"
                id="section-to-print"
              >
                <thead style={{ fontSize: "0.9rem" }}>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Aadhar number</th>
                    <th>Purpose</th>
                    <th>Visited to</th>
                    <th>Visited At</th>
                    <th>Returned At</th>
                    <th>Security Id</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "0.9rem" }}>
                  {visitors.map((visitor) => (
                    <tr key={visitor.id}>
                      <td>{visitor.id}</td>
                      <td>{visitor.visitor_name}</td>
                      <td>{visitor.visitor_aadhar}</td>
                      <td>{visitor.visitor_name}</td>
                      <td>
                        {visitor.block ? (
                          <>
                            {visitor.block} - {visitor.flat_number}
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{visitor.visited_at}</td>
                      <td>{visitor.returned_at}</td>
                      <td>{visitor.authorized_by}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VisitorsRecord;
