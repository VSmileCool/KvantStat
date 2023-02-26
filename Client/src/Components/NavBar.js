import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import logo from "../img/Кванториум.png";
import { INSTITUTESPAGE_ROUTE, USERINFO_ROUTE } from "../Router/Consts";

const NavBar = () => {
  return (
    <Navbar style={{ backgroundColor: "white" }} variant="light">
      <Container>
        <a href="/institutemap">
          <img
            src={logo}
            width="300px"
            alt="adasd"
            style={{ cursor: "pointer" }}
          />
        </a>

        <Nav className="ml-auto">
          <Nav.Link
            style={{ color: "black", fontSize: 24, fontWeight: "medium" }}
            href={INSTITUTESPAGE_ROUTE}
          >
            Институты
          </Nav.Link>

          <Nav.Link
            style={{ color: "black", fontSize: 24, fontWeight: "medium" }}
            href={USERINFO_ROUTE}
          >
            Аккаунт
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
