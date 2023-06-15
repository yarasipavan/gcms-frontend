import React, { memo, useState } from "react";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { logout } from "../../slices/login.slice";

function AllOwners({ owners, updateOwner }) {
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
  const editOwner = (owner) => {
    //open the model
    openModel();
    //set values in the model
    setValue("owner_id", owner.owner_id);
    setValue("name", owner.name);
    setValue("email", owner.email);
    setValue("phone", owner.phone);
  };

  const saveOwner = async () => {
    let token = localStorage.getItem("token");
    let owner = getValues();

    // change phonenumber string to number
    owner.phone = Number(owner.phone);
    let owner_id = owner.owner_id;
    delete owner.owner_id;

    try {
      //update the details in db
      let res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/admin/owner/owner_id/${owner_id}`,
        owner,
        { headers: { Authorization: `bearer ${token}` } }
      );
      //close the model
      reset();
      console.log("&&&&&&", res.data.payload);
      updateOwner(res.data.payload);
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
  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h4>All Owners</h4>
          </Accordion.Header>
          <Accordion.Body>
            {owners?.length === 0 ? (
              <p>No Owners</p>
            ) : (
              <>
                <Table responsive="lg" striped hover className="text-center">
                  <thead style={{ fontSize: "0.9rem" }}>
                    <tr>
                      <th> Owner Id</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "0.9rem" }}>
                    {owners?.map((owner, index) => (
                      <tr key={index}>
                        <td>{owner.owner_id}</td>
                        <td>{owner.name}</td>
                        <td>{owner.email}</td>
                        <td>{owner.phone}</td>
                        <td>
                          <button className="btn btn-warning">
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              onClick={() => editOwner(owner)}
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
                    <Modal.Title>Edit Owner</Modal.Title>
                  </Modal.Header>
                  <form
                    className="text-start   p-3 "
                    style={{ borderRadius: "20px" }}
                    onSubmit={handleSubmit(saveOwner)}
                  >
                    <Modal.Body>
                      <div className="row">
                        <div className="col-12 ">
                          {/* Owner Id  */}

                          <div className="mt-3">
                            <label className="mb-1" htmlFor="owner_id">
                              Owner id
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="owner_id"
                              disabled
                              {...register("owner_id")}
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
                                required: "name is required",
                                minLength: {
                                  value: 3,
                                  message:
                                    "name must contain atleast3 characters",
                                },
                              })}
                            ></input>

                            {errors.name && (
                              <p className="text-danger">
                                {errors.name.message}
                              </p>
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
                                required: "Phone number is required",
                                minLength: {
                                  value: 10,
                                  message:
                                    "Phone number must be at least 10 digits",
                                },
                                maxLength: {
                                  value: 10,
                                  message:
                                    "Phone number must not exceed 10 digits",
                                },
                                pattern: {
                                  value: /^\d+$/,
                                  message:
                                    "Phone number must only contain digits",
                                },
                              })}
                            />
                            {errors.phone && (
                              <p className="text-danger">
                                {errors.phone.message}
                              </p>
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

export default AllOwners;
