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

function AllOccupants({ occupants, updateOccupant, deleteOccupant }) {
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
  const editOccupant = (occupant) => {
    //open the model
    openModel();
    //set values in the model
    setValue("occupant_id", occupant.occupant_id);
    setValue("occupant_name", occupant.Occupant.occupant_name);
    setValue("email", occupant.Occupant.email);
    setValue("phone", occupant.Occupant.phone);
  };

  const saveOccupant = async () => {
    let occupant = getValues();

    // change phonenumber string to number
    occupant.phone = Number(occupant.phone);
    let occupant_id = occupant.occupant_id;
    delete occupant.occupant_id;
    console.log(occupant);

    try {
      //update the details in db
      let res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/admin/occupant/${occupant_id}`,
        occupant,
        { headers: { Authorization: `bearer ${token}` } }
      );
      //close the model
      reset();
      console.log("&&&&&&", res.data.payload);
      updateOccupant(res.data.payload);
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

  // delete / remove tenant
  const handleDelete = async (occupant) => {
    const shouldDelete = window.confirm(
      `Are you sure you want to remove ${occupant.Occupant.occupant_name} - ${occupant.occupant_id}`
    );
    if (shouldDelete) {
      try {
        //update the details in db
        let res = await axios.delete(
          `${process.env.REACT_APP_SERVER_URL}/admin/occupant/${occupant.occupant_id}`,
          { headers: { Authorization: `bearer ${token}` } }
        );

        console.log("&&&&&&", res.data.payload);
        deleteOccupant();
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
            {occupants?.length === 0 ? (
              <p>No occupants</p>
            ) : (
              <>
                <Table responsive="lg" striped hover className="text-center">
                  <thead style={{ fontSize: "0.9rem" }}>
                    <tr>
                      <th>Flat</th>
                      <th>Occupant Id</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Edit</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "0.9rem" }}>
                    {occupants?.map((occupant, index) => (
                      <tr key={index}>
                        <td>
                          {occupant.block} - {occupant.flat_number}
                        </td>
                        <td>{occupant.occupant_id}</td>
                        <td>{occupant.Occupant.occupant_name}</td>
                        <td>{occupant.Occupant.email}</td>
                        <td>{occupant.Occupant.phone}</td>
                        <td>
                          <button className="btn btn-warning">
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              onClick={() => editOccupant(occupant)}
                            />
                          </button>
                        </td>
                        <td>
                          <button className="btn btn-danger">
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={() => handleDelete(occupant)}
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
                    <Modal.Title>Edit Occupant</Modal.Title>
                  </Modal.Header>
                  <form
                    className="text-start   p-3 "
                    style={{ borderRadius: "20px" }}
                    onSubmit={handleSubmit(saveOccupant)}
                  >
                    <Modal.Body>
                      <div className="row">
                        <div className="col-12 ">
                          {/* occupant Id  */}

                          <div className="mt-3">
                            <label className="mb-1" htmlFor="occupant_id">
                              Occupant Id
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="occupant_id"
                              disabled
                              {...register("occupant_id")}
                            />
                          </div>

                          {/*  name */}
                          <div className="mt-3">
                            <label className="mb-1" htmlFor="occupant_name">
                              Name
                            </label>
                            <input
                              type="text"
                              placeholder="name"
                              className="form-control"
                              id="occupant_name"
                              {...register("occupant_name", {
                                required: true,
                              })}
                            />
                            {errors.occupant_name?.type === "required" && (
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

export default AllOccupants;
