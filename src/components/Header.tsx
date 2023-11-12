import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as LogoSvg } from "../img/Logo.svg";
import "../styles/css/Header.css";
import AuthService from "./AuthStorage";

interface HeaderProps {
  currentPath: string;
}

const Header: React.FC<HeaderProps> = ({ currentPath }) => {
  const [pagePath, setPagePath] = useState(window.location.href);
  const accessToken = AuthService.getData("accessToken");
  const navigationLinks = [
    { path: "/about-us", text: "О нас" },
    { path: "/map", text: "Карта" },
    {
      path: accessToken ? "/" : "/login",
      text: accessToken ? "Выйти" : "Войти",
    },
  ];
  const onClick = (link: any) => {
    if (link.path != "/") {
      setPagePath(window.location.href);
    } else {
      AuthService.clearData("accessToken");
    }
  };
  return (
    <div className="header-block">
      <header className="header">
        {/* Логотип и заголовок */}
        <div className="header-logo">
          <LogoSvg width="52.7" height="52.7" />
          <h1>Мозговой Штурм</h1>
        </div>

        {/* Навигационное меню */}
        <nav className="header-navigation">
          <ul className="header-navigation-list">
            {navigationLinks.map((link) => (
              <li className="header-navigation-item" key={link.path}>
                {/* Используем NavLink из react-router-dom для создания ссылки */}
                <NavLink
                  to={link.path}
                  className={`header-navigation-link ${
                    currentPath === pagePath ? "active" : ""
                  }`}
                  onClick={() => onClick(link)}
                >
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {/* Заголовок страницы */}
      <div className="my-heading">
        <h1>
          В Кванториуме получил <span className="blue-text">Мозги</span>?{" "}
          <span className="blue-text">Штурмуй</span> универы страны!
        </h1>
      </div>
      <div className="header-row" />
      {/* Дополнительная строка */}
    </div>
  );
};

export default Header;
