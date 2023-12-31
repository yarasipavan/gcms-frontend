import React, { useState, memo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
function ForgotPassword() {
  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");
  let [sendMailBtn, setSendMailBtn] = useState("");
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (formObj) => {
    setSendMailBtn("disabled");
    try {
      setMessage("");
      setErrorMessage("");
      let res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/forgot-password`,
        formObj
      );

      setMessage(res.data.message);
      setErrorMessage("");
      reset();
    } catch (err) {
      if (err.response?.data?.alertMsg) {
        setErrorMessage(err.response.data.alertMsg);
      } else {
        setErrorMessage(err.message);
      }
      setMessage("");
    } finally {
      setSendMailBtn("");
    }
  };
  return (
    <div>
      <h4>Forgot Password</h4>
      <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            className="form-control p-3 "
            {...register("username", { required: true })}
          />
          {errors.username?.type === "required" && (
            <p className="text-danger">Please enter a valid email address.</p>
          )}
        </div>

        <div className="mb-3">
          <button
            className={
              sendMailBtn
                ? "disabled btn btn-primary d-block form-control pt-3 pb-3"
                : "btn btn-primary d-block form-control pt-3 pb-3"
            }
          >
            {sendMailBtn ? "Sending mail...." : "Send mail"}
          </button>
        </div>
        <div className="mb-3">
          <Link to="/portal/login" style={{ textDecoration: "none" }}>
            Remembered Password? Login
          </Link>
        </div>
        <div className="mb-3 text-danger text-center fw-bold">
          {errorMessage}
        </div>
        <div className="mb-3 text-success text-center fw-bold">{message}</div>
      </form>
    </div>
  );
}

export default ForgotPassword;
