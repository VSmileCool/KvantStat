import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login, register } from "../redux/actions/AuthActions";
import "../css/Auth.css";

const Auth = () => {
  const [certificateCode, setCertificateCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin: boolean = location.pathname === "/login";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const user = {
      email,
      password,
      certificateCode,
      firstName,
      lastName,
      patronymic,
      graduationYear,
    };

    if (isLogin) {
      login(email, password);
    } else {
      user.certificateCode = certificateCode;
      user.firstName = firstName;
      user.lastName = lastName;
      user.patronymic = patronymic;
      user.graduationYear = graduationYear;
      register(user);
    }

    navigate("/");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="text"
              id="certificateCode"
              required
              value={certificateCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCertificateCode(e.target.value)
              }
              placeholder="Код сертификата"
            />

            <input
              type="text"
              id="first-name"
              required
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFirstName(e.target.value)
              }
              placeholder="Имя"
            />
            <input
              type="text"
              id="last-name"
              required
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLastName(e.target.value)
              }
              placeholder="Фамилия"
            />
            <input
              type="text"
              id="fullName"
              required
              value={patronymic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPatronymic(e.target.value)
              }
              placeholder="Отчество"
            />
          </div>
        )}

        <input
          type="text"
          id="email"
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          placeholder="Email"
        />

        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          placeholder="Пароль"
        />
        <p>
          {isLogin ? (
            <>
              "Еще нет аккаунта?" <a href="/registration">Зарагестрируйтесь</a>
            </>
          ) : (
            <>
              "Уже есть аккаунт?" <a href="/login">Войдите</a>
            </>
          )}
        </p>
        <button className="auth" type="submit">
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
