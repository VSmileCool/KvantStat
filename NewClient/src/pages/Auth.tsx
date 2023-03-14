import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login, register } from "../redux/actions/AuthActions";
import "../css/Auth.css";
import CodeDescription from "../img/CodeDescription.svg";
import BigText from "../img/Big Text.svg";
import Email from "../img/Email.svg";
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
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="InputWrapper">
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
                <div className="QCircle" style={{}}>
                  ?
                </div>
              </div>
              <img src={CodeDescription} alt="" />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="TextWrapper" style={{ display: "inline-block" }}>
                <div className="InputWrapper">
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
                  <div className="QCircle" style={{}}>
                    ?
                  </div>
                </div>
                <div
                  className="InputWrapper"
                  style={{ margin: "34px 0px 34px" }}
                >
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
                  <div className="QCircle" style={{}}>
                    ?
                  </div>
                </div>

                <div className="InputWrapper">
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
                  <div className="QCircle" style={{}}>
                    ?
                  </div>
                </div>
              </div>
              <img src={BigText} alt="" />
            </div>
          </div>
        )}
        <div style={{ display: "flex", width: 1092 }}>
          <div className="InputWrapper">
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
            <div className="QCircle" style={{}}>
              ?
            </div>
          </div>
          <img src={Email} alt="" />
        </div>

        <div className="InputWrapper">
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
          <div className="QCircle" style={{}}>
            ?
          </div>
        </div>

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
