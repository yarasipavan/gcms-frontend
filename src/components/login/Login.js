import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../slices/login.slice";

function Login() {
  let { status, errorMessage, user } = useSelector((store) => store.login);
  let navigate = useNavigate();

  useEffect(() => {
    if (status === "success") {
      if (user?.role === "admin") navigate("/admin");
      else if (user?.role === "occupant") {
        navigate("/occupant");
      } else if (user?.role === "security") {
        navigate("/super-admin");
      }
    }
    console.log("******", user, status);
  }, [status]);

  let dispatch = useDispatch();
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //on submit handler function
  const onSubmit = (credentialsObj) => {
    dispatch(userLogin(credentialsObj));
  };
  return (
    <div>
      <h4>Login</h4>
      <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            className="form-control p-3 "
            {...register("username", { required: true })}
          />
          {errors.username?.type === "required" && (
            <p className="text-danger">Please a correct email address</p>
          )}
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            className="form-control p-3 "
            {...register("password", { required: true })}
          />
          {errors.password?.type === "required" && (
            <p className="text-danger">Please enter your password.</p>
          )}
        </div>

        <div className="mb-3">
          <button className="btn btn-primary d-block form-control pt-3 pb-3">
            Login
          </button>
        </div>
        <div className="mb-3">
          <Link to="forgot-password" style={{ textDecoration: "none" }}>
            Forgot Password
          </Link>
        </div>
        <div className="mb-3 text-danger text-center fw-bold">
          {errorMessage ? <p>{errorMessage}</p> : ""}
        </div>
      </form>
    </div>
  );
}

export default Login;
