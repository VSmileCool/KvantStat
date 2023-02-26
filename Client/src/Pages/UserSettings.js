import React from "react";
import { Container } from "react-bootstrap";
import "../Styles/UserSettings.css";

const UserSettings = () => {
  let UserName = "Vova";
  let Email = "adsdsd@gmail.com";
  let Password = "addwd";
  let University = "МГУ";
  return (
    <Container className="main">
      <div className="left">
        <p>{UserName}</p>
        <p>{Email}</p>
        <p>{Password}</p>
        <p>{University}</p>
      </div>
      <div className="change">
        <p>Сменить</p>
        <p>Сменить</p>
        <p>Сменить</p>
        <p>Сменить</p>
      </div>
    </Container>
  );
};

export default UserSettings;
