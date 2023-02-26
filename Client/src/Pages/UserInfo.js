import React, { useContext } from "react";
import { Col, Container } from "react-bootstrap";
import "../Styles/UserInfo.css";
import { Context } from "../index";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

const UserInfo = () => {
  const { user } = useContext(Context);
  return (
    <Container>
      <ListGroup
        style={{ maxWidth: "400px", margin: "auto", marginTop: "100px" }}
      >
        <ListGroup.Item>
          <Row>
            <Col>Имя</Col>
            <Col xs={5}>{localStorage.name}</Col>
            <Col>
              <Button variant="outline-dark">Изменить</Button>
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col>Email</Col>
            <Col xs={5}>{localStorage.email}</Col>
            <Col>
              <Button variant="outline-dark">Изменить</Button>
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col>Пароль</Col>
            <Col xs={5}>
              <p type="password">{localStorage.password}</p>{" "}
            </Col>
            <Col>
              <Button variant="outline-dark">Изменить</Button>
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col>ВУЗ</Col>
            <Col xs={5}>{localStorage.institute}</Col>
            <Col>
              <Button variant="outline-dark">Изменить</Button>
            </Col>
          </Row>
        </ListGroup.Item>
      </ListGroup>
    </Container>
  );
};

export default UserInfo;
