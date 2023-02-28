import React from "react";
import logo from "../img/КВАНТ 1.svg";
import "../css/header.css";

const Header: React.FC = () => {
  return (
    <div className="HeaderWrapper">
      <div className="LogoWrapper">
        <img
          src={logo}
          className="LogoImage"
          alt="ЗДЕСЬ ДОЛЖНО БЫЛО БЫТЬ ЛОГОТИП"
        />
        <h1 className="LogoText">KVANTSTAT</h1>
      </div>
      <div className="ButtonWrapper">
        <button className="Button">ВОЙТИ</button>
        <button className="Button">О НАС</button>
      </div>
    </div>
  );
};

export default Header;
