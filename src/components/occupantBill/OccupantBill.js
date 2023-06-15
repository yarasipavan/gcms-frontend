import React, { useState, memo, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { logout } from "../../slices/login.slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
function OccupantBill() {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let token = localStorage.getItem("token");

  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");
  let [bill, setBill] = useState("");
  let { user } = useSelector((store) => store.login);
  let [occupants, setOccupants] = useState([]);
  let [occupantsFetched, setOccupantsFetched] = useState(0);

  const getOccupants = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/admin/overall-occupants `, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setOccupants(res.data);
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
      }
    } finally {
      setOccupantsFetched(1);
    }
  };

  useEffect(() => {
    user.role === "admin" && getOccupants();
  }, []);

  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (formObj) => {
    setBill("");
    let [year, month] = formObj.month.split("-");
    // convert year month and occupant id into number
    year = Number(year);
    month = Number(month);
    let occupant_id = Number(formObj.occupant_id);
    console.log(typeof occupant_id);

    try {
      let res;
      if (user.role === "admin") {
        res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/admin/bill/occupant/${occupant_id}/year/${year}/month/${month}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/occupant/bill/year/${year}/month/${month}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (res.data.alertMsg) {
        throw new Error(res.data.alertMsg);
      } else {
        setBill(res.data);
        console.log(res.data);
        setErrorMessage("");
        reset();
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mt-5 text-center">
      <h4>Monthly bills</h4>

      <form className=" w-75 mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="text-start">
          {user.role === "admin" && (
            <>
              {/* occupant id */}
              <div className="mt-3 col-8 col-md-4 mx-auto">
                <label className="mb-1 fw-bold" htmlFor="occupant_id">
                  select Occupant
                </label>

                <select
                  defaultValue={""}
                  id="occupant_id"
                  className="form-control "
                  {...register("occupant_id", { required: true })}
                >
                  <option disabled value={""}>
                    --select occupant--
                  </option>
                  {occupants?.map((occupant, index) => (
                    <option key={index} value={occupant.occupant_id}>
                      {occupant.occupant_name} - {occupant.occupant_id}
                    </option>
                  ))}
                </select>

                {errors.occupant_id?.type === "required" && (
                  <p className="text-danger">Select occupant</p>
                )}
              </div>
            </>
          )}

          {/* month */}
          <div className="mt-3 col-8 col-md-4 mx-auto">
            <label className="mb-1 fw-bold" htmlFor="month">
              Select month
            </label>
            <input
              type="month"
              className="form-control "
              {...register("month", { required: true })}
            ></input>

            {errors.month?.type === "required" && (
              <p className="text-danger">Select month</p>
            )}
          </div>

          <div className="mt-3 mb-3 col-8 col-md-4 mx-auto">
            <button className="btn btn-primary d-block form-control pt-2 pb-">
              Get Bill
            </button>
          </div>
        </div>
      </form>
      {errorMessage && (
        <p className="text-danger text-center">{errorMessage}</p>
      )}
      {bill && (
        <div>
          <div
            className="col col-12 col-md-8 mx-auto mt-3 text-center"
            id="section-to-print"
          >
            <h5 className="mt-5 mb-3">
              Bill Details
              <button
                className="btn btn-outline-primary mb-3 float-end"
                onClick={() => window.print()}
                id="print-btn"
              >
                Print
              </button>
            </h5>
            <div className="text-start fw-bold">
              <span>Bill number: {bill.id}</span>

              <span className="float-end">Occupant Id :{bill.occupant_id}</span>
            </div>
            <Table responsive="lg" striped hover bordered className="mt-3">
              <thead style={{ fontSize: "0.9rem" }}>
                <tr>
                  <th>Service</th>
                  <th>Bill</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.9rem" }}>
                <tr>
                  <td>Flat rent</td>
                  <td>{bill.rent_bill}</td>
                </tr>
                <tr>
                  <td>Swimming Pool</td>
                  <td>{bill.swimming_pool_bill}</td>
                </tr>
                <tr>
                  <td>Parking</td>
                  <td>{bill.parking_bill}</td>
                </tr>
                <tr>
                  <td>House Keeping </td>
                  <td>{bill.house_keeping_bill}</td>
                </tr>
                <tr>
                  <td>Gym</td>
                  <td>{bill.gym_bill}</td>
                </tr>
                <tr>
                  <td>Park</td>
                  <td>{bill.park_bill}</td>
                </tr>
                <tr>
                  <td>Indoor auditorium</td>
                  <td>{bill.indoor_auditorium_bill}</td>
                </tr>
                <tr>
                  <td>Security *</td>
                  <td>{bill.security_bill}</td>
                </tr>
                <tr>
                  <td>Maintenance *</td>
                  <td>{bill.maintenance_bill}</td>
                </tr>
                <tr>
                  <td>Gardening *</td>
                  <td>{bill.gardening_bill}</td>
                </tr>
                <tr>
                  <td>Charity *</td>
                  <td>{bill.charity_bill}</td>
                </tr>
                <tr>
                  <td>Community *</td>
                  <td>{bill.community_bill}</td>
                </tr>
              </tbody>
            </Table>
            <p className="fw-bold"> Total Bill: {bill.total_bill}</p>
            <p className="text-start">
              Note: Bill calculated on {bill.billed_date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OccupantBill;
