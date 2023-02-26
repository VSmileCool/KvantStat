import React from "react";
import { Container, Dropdown } from "react-bootstrap";
import { CustomMenu } from "../Components/CustomMenu.js";
import { CustomToggle } from "../Components/CustomToggle.js";
import { getInstitutes } from "../Http/InstituteAPI.js";
import "../Styles/ChooseInstitute.css";

const ChooseInstitute = () => {
  let institute = getInstitutes();
  let result = [];

  for (let i in institute) {
    result.push([i, institute[i]]);
  }
  return (
    <Container>
      <div className="left">
        <h1>Выберите институт на карте</h1>
        <div id="square"></div>
      </div>
      <div className="right">
        <h1>Или выберите из списка</h1>
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            Custom toggle
          </Dropdown.Toggle>
          <Dropdown.Menu as={CustomMenu}></Dropdown.Menu>
        </Dropdown>
      </div>
    </Container>
  );
};

export default ChooseInstitute;
