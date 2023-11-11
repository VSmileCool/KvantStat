import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FULLMAP_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
} from "../router/consts";
import "../styles/css/Auth.css";
import { login, register } from "../api/userAPI";

const Auth = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLogin = pathname === LOGIN_ROUTE;
  const background = isLogin ? "#c1dfe7" : "#E7DCC1";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    patronymic: "",
    certificateId: 0,
    password: "",
    email: "",
    login: "",
    institute: "",
  });

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (isLogin) {
      login(formData.email, formData.password);
    } else {
      register(
        formData.email,
        formData.certificateId,
        formData.firstName,
        formData.lastName,
        formData.patronymic,
        formData.institute,
        formData.password
      );
      navigate(FULLMAP_ROUTE);
    }
  };

  const renderRegistrationButton = () => {
    if (isLogin) {
      return (
        <button
          onClick={() => navigate(REGISTRATION_ROUTE)}
          className="registration"
        >
          Регистрация
        </button>
      );
    }
    return <div style={{ height: "102px" }} />;
  };

  const renderCertificateInput = () => {
    if (!isLogin) {
      return (
        <>
          <input
            className="certificateId input"
            type="text"
            placeholder="Код сертификата"
            value={formData.certificateId}
            name="certificateId"
            onChange={handleInputChange}
          />
          <input
            className="name input"
            type="text"
            placeholder="Имя"
            value={formData.firstName}
            name="firstName"
            onChange={handleInputChange}
          />
          <input
            className="surname input"
            type="text"
            placeholder="Фамилия"
            value={formData.lastName}
            name="lastName"
            onChange={handleInputChange}
          />
          <input
            className="lastname input"
            type="text"
            placeholder="Отчество"
            value={formData.patronymic}
            name="patronymic"
            onChange={handleInputChange}
          />
        </>
      );
    }
    return null;
  };

  return (
    <div className="back" style={{ background }}>
      <form className="form" onSubmit={handleFormSubmit}>
        <h1 style={{ fontSize: 32, marginTop: 26 }}>
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </h1>
        {renderCertificateInput()}
        <input
          className="email input"
          type="text"
          value={formData.email}
          name="email"
          onChange={handleInputChange}
          placeholder={isLogin ? "Почта" : "Email"}
        />
        <input
          className="password input"
          type="password"
          value={formData.password}
          name="password"
          onChange={handleInputChange}
          placeholder="Пароль"
        />
        <label className="checkbox style-c">
          <input type="checkbox" />
          <div className="checkbox__checkmark"></div>
          <div className="checkbox__body">Запомнить меня</div>
        </label>
        <button className="login" type="submit">
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>
      {renderRegistrationButton()}
    </div>
  );
};

export default Auth;
