import React, { useState } from "react";
import logo from "../img/КВАНТ 1.svg";
import "../css/header.css";

const Header: React.FC = () => {
  const [showSecondaryButtons, setShowSecondaryButtons] = useState(false);

  const handleGearClick = () => {
    setShowSecondaryButtons(!showSecondaryButtons);
  };

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
        {!showSecondaryButtons && (
          <>
            <button className="Button">ВОЙТИ</button>
            <button className="Button" onClick={handleGearClick}>
              О НАС
            </button>
          </>
        )}
        {showSecondaryButtons && (
          <>
            <button className="Button">Версия для слабовидящих</button>
            <button className="Button">Темная тема</button>
          </>
        )}
      </div>
      {showSecondaryButtons && (
        <div className="ButtonWrapper">
          <button className="Button" onClick={handleGearClick}>
            &#10094; Назад
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
