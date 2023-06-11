import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";

function TopNavBar() {
  let navigate = useNavigate();
  return (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className="pt-3 pb-3"
      >
        <Container>
          <Navbar.Brand>Gated Community</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="justify-content-end flex-grow-1 ">
              {/* <Nav.Link>Login</Nav.Link> */}
              <button
                className="btn btn-success"
                onClick={() => navigate("/portal")}
              >
                Login
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default TopNavBar;
