import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/login.slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonMilitaryPointing } from "@fortawesome/free-solid-svg-icons";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faPeopleRoof } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { AiFillStop } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { BsTools, BsSend } from "react-icons/bs";
import { BiBuilding } from "react-icons/bi";
import { BsArrowReturnLeft, BsArrowReturnRight } from "react-icons/bs";

function TopMenuBar() {
  let { user } = useSelector((store) => store.login);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const logoutFn = () => {
    dispatch(logout());
    navigate("/");
  };
  const changePassword = () => {
    navigate("change-password");
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>
          <i className="bi bi-buildings-fill fs-5 me-2" /> Gated Community
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {!user.isfirstlogin && (
              <>
                {user?.role === "admin" ? (
                  <>
                    <Nav.Link as={Link} to="dashboard" eventKey="dashboard">
                      <i className="bi bi-speedometer me-2 fs-5"></i>
                      Dashboard
                    </Nav.Link>

                    <Nav.Link as={Link} to="flats" eventKey="flats">
                      <i className="bi bi-houses-fill me-2 fs-5"></i>
                      Flats
                    </Nav.Link>
                    <Nav.Link as={Link} to="owners" eventKey="owners">
                      <i className="bi bi-person-fill me-2 fs-5"></i>
                      Owners
                    </Nav.Link>
                    <Nav.Link as={Link} to="occupants" eventKey="occupants">
                      <FontAwesomeIcon
                        icon={faPeopleRoof}
                        className="me-2 fs-5"
                      />
                      Occupants
                    </Nav.Link>

                    <Nav.Link as={Link} to="security" eventKey="security">
                      <FontAwesomeIcon
                        icon={faPersonMilitaryPointing}
                        className="me-2 fs-5"
                      />
                      Security
                    </Nav.Link>

                    <Nav.Link as={Link} to="bills" eventKey="bills">
                      <FontAwesomeIcon
                        icon={faFileInvoiceDollar}
                        className="me-2 fs-5"
                      />
                      Bills
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="visitors-record"
                      eventKey="visitors-record"
                    >
                      <FontAwesomeIcon icon={faBook} className="me-2 fs-5" />
                      Visitors record
                    </Nav.Link>

                    <Nav.Link as={Link} to="services" eventKey="services">
                      <span className="me-2 fs-5">
                        <BsTools />
                      </span>
                      Services
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="generate-credentials"
                      eventKey="generate-credentials"
                    >
                      <span className="me-2 fs-5">
                        <BsSend />
                      </span>
                      Send credentials
                    </Nav.Link>
                  </>
                ) : user.role === "occupant" ? (
                  <>
                    <Nav.Link
                      as={Link}
                      to="using-services"
                      eventKey="using-services"
                    >
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="me-2 fs-5"
                      />
                      Using services
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="not-using-services"
                      eventKey="not-using-services"
                    >
                      <span className="me-2 fs-5">
                        <AiFillStop />
                      </span>
                      Not using services
                    </Nav.Link>

                    <Nav.Link as={Link} to="bills" eventKey="bills">
                      <FontAwesomeIcon
                        icon={faFileInvoiceDollar}
                        className="me-2 fs-5"
                      />
                      Bills
                    </Nav.Link>
                  </>
                ) : user.role === "security" ? (
                  <>
                    <Nav.Link as={Link} to="add-visitor" eventKey="add-visitor">
                      <span className="me-2 fs-5">
                        <BsArrowReturnRight />
                      </span>
                      Add visitor
                    </Nav.Link>

                    <Nav.Link as={Link} to="note-return" eventKey="note-return">
                      <span className="me-2 fs-5">
                        <BsArrowReturnLeft />
                      </span>
                      Return Note
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="visitors-record"
                      eventKey="visitors-record"
                    >
                      <span className="me-2 fs-5">
                        <FontAwesomeIcon icon={faBook} className="me-2 fs-5" />
                      </span>
                      Visitors Record
                    </Nav.Link>
                  </>
                ) : (
                  ""
                )}
              </>
            )}

            <span>
              <NavDropdown title={`${user.username}`} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={changePassword}>
                  Change Password
                </NavDropdown.Item>
                {user.role === "occupant" && (
                  <NavDropdown.Item onClick={() => navigate("profile")}>
                    Profile
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutFn}>Logout</NavDropdown.Item>
              </NavDropdown>
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopMenuBar;
