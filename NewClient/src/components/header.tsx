import React from "react";
import logo from "../img/КВАНТОРИУМ.png";
import "../css/header.css";
import { useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMap: boolean = location.pathname === "/institute-map";
  return (
    <div className="header">
      <div className="left">
        <img src={logo} alt="logo" className="logo" />
        <span className="text">KVANTSTAT</span>
      </div>
      <div className="right">
        <button
          onClick={() => navigate(isMap ? "/registration" : "/institute-map")}
          className="btn"
        >
          {isMap ? "Вход" : "Карта"}
        </button>
        <button onClick={() => navigate("/")} className="btn gear">
          Версия для слабовидящих
        </button>
      </div>
    </div>
  );
};

export default Header;
