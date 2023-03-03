import React, { useState } from "react";
import logo from "../img/КВАНТ 1.svg";
import "../css/header.css";
import gear from "../img/gear.png";
import menu from "../img/menu.png";
import Gear from "./gear";

interface ButtonProps {
  defaultIcon: string;
  activeIcon: string;
  onClick?: () => void;
}
const Header: React.FC = () => {
  const viewButtons = () => {
    setAdditionalButtonsVisible(!isAdditionalButtonsVisible);
  };
  const [isAdditionalButtonsVisible, setAdditionalButtonsVisible] =
    useState(false);
  return (
    <div className="HeaderWrapper">
      <div className="LogoWrapper">
        <img
          src={logo}
          className="LogoImage"
          alt="ЗДЕСЬ ДОЛЖЕН БЫЛ БЫТЬ ЛОГОТИП"
        />
        <h1 className="LogoText">KVANTSTAT</h1>
      </div>
      <div className="ButtonWrapper">
        <button className="Button">ВОЙТИ</button>
        <button className="Button">О НАС</button>
        {isAdditionalButtonsVisible ? (
          <div>
            <button className="Button">ТЕМНЫЙ РЕЖИМ</button>
            <button className="Button">ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ</button>
          </div>
        ) : null}

        <Gear
          onClick={() => viewButtons()}
          activeIcon={menu}
          defaultIcon={gear}
        />
      </div>
    </div>
  );
};

export default Header;
