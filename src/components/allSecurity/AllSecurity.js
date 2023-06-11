import React, { memo, useState } from "react";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { logout } from "../../slices/login.slice";

function AllSecurity({ securities, updateSecurity, deleteSecurity }) {
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
  let token = localStorage.getItem("token");

  //state
  // let [message, setMessage] = useState([]);
  let [errorMessage, setErrorMessage] = useState([]);

  //modal state
  let [showModal, setShowModal] = useState(0);

  const openModel = () => {
    setShowModal(1);
  };
  const closeModel = () => {
    setShowModal(0);
  };
  //function to eddit project
  const editSecurity = (security) => {
    //open the model
    openModel();
    //set values in the model
    setValue("id", security.id);
    setValue("name", security.name);
    setValue("email", security.email);
    setValue("phone", security.phone);
  };

  const saveSecurity = async () => {
    let security = getValues();

    // change phonenumber string to number
    security.phone = Number(security.phone);
    let id = security.id;
    delete security.id;
    console.log(security);

    try {
      //update the details in db
      let res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/admin/security/${id}`,
        security,
        { headers: { Authorization: `bearer ${token}` } }
      );
      //close the model
      reset();

      updateSecurity(res.data.payload);
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

  // delete / remove security
  const handleDelete = async (security) => {
    const shouldDelete = window.confirm(
      `Are you sure you want to remove ${security.name} - ${security.id}`
    );
    if (shouldDelete) {
      try {
        //update the details in db
        let res = await axios.delete(
          `${process.env.REACT_APP_SERVER_URL}/admin/security/${security.id}`,
          { headers: { Authorization: `bearer ${token}` } }
        );
        deleteSecurity(security.id);
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
    }
  };

  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h4>All occupants</h4>
          </Accordion.Header>
          <Accordion.Body>
            {securities?.length === 0 ? (
              <p>No securities</p>
            ) : (
              <>
                <Table responsive="lg" striped hover className="text-center">
                  <thead style={{ fontSize: "0.9rem" }}>
                    <tr>
                      <th>Security Id</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Edit</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "0.9rem" }}>
                    {securities?.map((security, index) => (
                      <tr key={index}>
                        <td>{security.id}</td>
                        <td>{security.name}</td>
                        <td>{security.email}</td>
                        <td>{security.phone}</td>
                        <td>
                          <button className="btn btn-warning">
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              onClick={() => editSecurity(security)}
                            />
                          </button>
                        </td>
                        <td>
                          <button className="btn btn-danger">
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={() => handleDelete(security)}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Modal
                  show={showModal}
                  onHide={closeModel}
                  backdrop={"static"}
                  size="md"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Security</Modal.Title>
                  </Modal.Header>
                  <form
                    className="text-start   p-3 "
                    style={{ borderRadius: "20px" }}
                    onSubmit={handleSubmit(saveSecurity)}
                  >
                    <Modal.Body>
                      <div className="row">
                        <div className="col-12 ">
                          {/* security Id  */}

                          <div className="mt-3">
                            <label className="mb-1" htmlFor="id">
                              Security Id
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="id"
                              disabled
                              {...register("id")}
                            />
                          </div>

                          {/*  name */}
                          <div className="mt-3">
                            <label className="mb-1" htmlFor="name">
                              Name
                            </label>
                            <input
                              type="text"
                              placeholder="name"
                              className="form-control"
                              id="name"
                              {...register("name", {
                                required: true,
                              })}
                            />
                            {errors.name?.type === "required" && (
                              <p className="text-danger">Enter name</p>
                            )}
                          </div>
                        </div>
                        <div className="col-12 ">
                          {/* email */}
                          <div className="mt-3">
                            <label className="mb-1" htmlFor="email">
                              Email
                            </label>
                            <input
                              type="email"
                              placeholder="email"
                              className="form-control"
                              {...register("email", {
                                required: true,
                              })}
                            />
                            {errors.email?.type === "required" && (
                              <p className="text-danger">Enter email</p>
                            )}
                          </div>
                        </div>

                        <div className="col-12 ">
                          {/* Phone number */}
                          <div className="mt-3">
                            <label className="mb-1" htmlFor="phone">
                              Phone number
                            </label>
                            <input
                              type="tel"
                              placeholder="9121xxxxx"
                              className="form-control"
                              {...register("phone", {
                                required: true,
                              })}
                            />
                            {errors.phone?.type === "required" && (
                              <p className="text-danger">Enter phone number</p>
                            )}
                          </div>
                        </div>
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
              </>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default AllSecurity;
