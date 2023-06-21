import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import { set, useForm } from "react-hook-form";

function GenerateCredentials() {
  let { user } = useSelector((store) => store.login);
  let [credentials, setCredentials] = useState([]);
  let [errorMessage, setErrorMessage] = useState("");
  let [fetched, setFetched] = useState(0);
  let [sent, setSent] = useState(0); // 0-initials 1-sending mail
  let [message, setMessage] = useState("");
  let token = localStorage.getItem("token");
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const getCredentials = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/admin/credentials-details`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCredentials(res.data);
          setFetched(1);
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
        setFetched(1);
      }
    }
  };

  useEffect(() => {
    getCredentials();
  }, []);

  const onSubmit = async (formObj) => {
    setMessage("");
    setErrorMessage("");
    setSent(1);
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/admin/generate-credentials/${formObj.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
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
      }
    } finally {
      setSent(0);
    }
  };

  return (
    <div className="mt-5 text-center ">
      <h4>Generate credentials</h4>
      <form
        className=" col-12 col-md-8 mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-start">
          <>
            {/*  id */}
            <div className="mt-3 col-8 col-md-8 mx-auto">
              <label className="mb-1 fw-bold" htmlFor="id">
                Select username
              </label>

              <select
                defaultValue={""}
                id="id"
                className="form-control "
                {...register("id", { required: true })}
              >
                <option disabled value={""}>
                  --select user--
                </option>
                {credentials?.map((user, index) => (
                  <option key={index} value={user.id}>
                    {user.username} - {user.user_id}
                    {"("}
                    {user.role}
                    {")"}
                  </option>
                ))}
              </select>

              {errors.id?.type === "required" && (
                <p className="text-danger">Select user</p>
              )}
            </div>
          </>

          <div className="mt-3 mb-3 col-8 col-md-4 mx-auto">
            <button
              className={
                sent
                  ? "disabled btn btn-primary d-block  form-control pt-2"
                  : "btn btn-primary d-block  form-control pt-2"
              }
            >
              {sent ? "Sending......" : "Send mail"}
            </button>
          </div>
        </div>
      </form>
      {errorMessage && (
        <p className="text-danger text-center">{errorMessage}</p>
      )}
      {message && <p className="text-success text-center fw-bold">{message}</p>}
    </div>
  );
}

export default GenerateCredentials;
