import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../../slices/login.slice";

function ChangePassword() {
  let navigate = useNavigate();
  let { status, errorMessage, user } = useSelector((store) => store.login);
  let [message, setMessage] = useState("");
  let [errMessage, setErrMessage] = useState("");
  let dispatch = useDispatch();
  let token = localStorage.getItem("token");
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (formObj) => {
    console.log(formObj);
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/change-password`,
        formObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);

      setErrMessage("");
      setMessage(res.data.message);
      reset();
    } catch (err) {
      if (err.response?.status === 401) {
        //logout completely and navigate to login
        dispatch(logout());
        navigate("/");
      } else {
        console.log(err.response?.data?.alertMsg);
        if (err.response?.data?.alertMsg) {
          setErrMessage(err.response.data.alertMsg);
          setMessage("");
        } else {
          setErrMessage(err.message);
          setMessage("");
        }
      }
    }
  };
  console.log(errMessage);

  return (
    <div>
      <div className="container pt-5">
        <div className="row">
          <div className="card shadow col col-sm-10 col-md-8 col-lg-4 mx-auto mt-5 p-5">
            <h4>Change password</h4>
            <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="current password"
                  className="form-control p-3 "
                  {...register("old_password", {
                    required: true,
                    minLength: 8,
                  })}
                />
                {errors.old_password && (
                  <p className="text-danger">
                    current password contains atleast 8 characters
                  </p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="New password"
                  className="form-control p-3 "
                  {...register("new_password", {
                    required: true,
                    minLength: 8,
                  })}
                />
                {errors.new_password && (
                  <p className="text-danger">
                    new password must contains atleast 8 characters
                  </p>
                )}
              </div>

              <div className="mb-3">
                <button className="btn btn-primary d-block form-control pt-3 pb-3">
                  Change Password
                </button>
              </div>

              <div className="mb-3 text-danger text-center fw-bold">
                {errMessage ? <p>{errMessage}</p> : ""}
              </div>
              <div className="mb-3 text-success text-center fw-bold">
                {message ? <p>{message}</p> : ""}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
