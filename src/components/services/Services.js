import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import Table from "react-bootstrap/Table";
import { toTitleCase } from "../custom_modules/toTitleCase";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";

function Services() {
  let { user } = useSelector((store) => store.login);
  let [servicesFetched, setServicesFetched] = useState(0);
  let [services, setServices] = useState([]);
  let [errorMessage, setErrorMessage] = useState("");
  let [message, setMessage] = useState("");
  let token = localStorage.getItem("token");
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm();

  //modal state
  let [showModal, setShowModal] = useState(0);

  const openModel = () => {
    setShowModal(1);
  };
  const closeModel = () => {
    setShowModal(0);
  };

  //function to eddit project
  const editCosts = () => {
    //open the model
    openModel();
    // //set values in the model
    for (let service in services) {
      setValue(service, services[service]);
    }
  };

  const saveCosts = async () => {
    let costs = getValues();
    // change all values to number type
    for (let service in costs) {
      costs[service] = Number(costs[service]);
    }
    console.log(costs);

    try {
      //update the details in db
      let res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/admin/update-service-costs`,
        costs,
        { headers: { Authorization: `bearer ${token}` } }
      );

      setServices(costs);
      reset();
      closeModel();
    } catch (err) {
      if (err.response?.status == 401) {
        dispatch(logout());
        navigate("/");
      } else {
        if (err.response?.data.alertMsg) {
          setErrorMessage(err.response.data.alertMsg);
        } else {
          setErrorMessage(err.message);
        }
      }
    }
  };

  const getServices = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/admin/services`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setServices(res.data);
          setErrorMessage("");
        });
    } catch (err) {
      if (err.response.status === 401) {
        //logout completely and navigate to login
        dispatch(logout());
        navigate("/");
      } else {
        //set error message
        setErrorMessage(err.message);
      }
    } finally {
      setServicesFetched(1);
    }
  };
  useEffect(() => {
    getServices();
  }, []);
  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="col col-md-8 col-lg-6 mx-auto text-center">
            <h4 className="mt-5 mb-3">
              Service Costs
              <button
                className="btn btn-warning mb-3 float-end"
                onClick={editCosts}
              >
                Edit Cost
              </button>
            </h4>
            <Table responsive="lg" striped hover className="mt-3 ">
              <thead style={{ fontSize: "0.9rem" }}>
                <tr>
                  <th>Service</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.9rem" }}>
                {Object.keys(services).map((service) => (
                  <tr>
                    <td>{toTitleCase(service)}</td>
                    <td>{services[service]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Modal
              show={showModal}
              onHide={closeModel}
              backdrop={"static"}
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Costs</Modal.Title>
              </Modal.Header>
              <form
                className="text-start   p-3 "
                style={{ borderRadius: "20px" }}
                onSubmit={handleSubmit(saveCosts)}
              >
                <Modal.Body>
                  <div className="row row-cols-2">
                    {Object.keys(services).map((service) => (
                      <div>
                        <div className="mt-3">
                          <label className="mb-1" htmlFor={service}>
                            {toTitleCase(service)}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id={service}
                            {...register(service, { required: true })}
                          />
                          {errors[service]?.type === "required" && (
                            <p className="text-danger">Enter cost</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </form>
              <p className="text-danger text-center">{errorMessage}</p>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
