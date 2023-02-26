import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Container, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { login, registration } from "../Http/UserAPI";
import { Context } from "../index";
import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  USERINFO_ROUTE,
} from "../Router/Consts";
import { Box, Modal, Typography } from "@mui/material";

const Auth = observer(() => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    fontFamily: "Futura PT Medium",
    textDecoration: "none",
    userSelect: "none",
    borderRadius: "10px",
    border: "none",
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [modalText, setModalText] = useState("");
  const changeEmail = (event) => {
    setEmail(event.target.value);
  };
  const changePassword = (event) => {
    setPassword(event.target.value);
  };
  const changeName = (event) => {
    setName(event.target.value);
  };
  const changeCode = (event) => {
    setCode(event.target.value);
  };
  const onClick = async () => {
    let data;
    try {
      if (isLogin) {
        data = await login(email, password);
        if (data.return === "Пользователь с таким именем не найден") {
          setModalText(data.return);
          handleOpen();
        }
        if (data.return === "yes") {
          navigate(USERINFO_ROUTE);
        }
      } else {
        data = await registration(email, password, code, name);
        if (data.return === "Пользователь с таким кодом уже есть") {
          setModalText(data.return);
          handleOpen();
        }
        if (data.return === "yes") {
          navigate(USERINFO_ROUTE);
        }
      }
      return data;
      // navigate(INSTITUTEMAP_ROUTE);
    } catch (e) {
      console.log(e.message);
    }
  };

  const [disabled, setDisabled] = useState(true);

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 57 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
        <Form className="d-flex flex-column">
          {isLogin ? null : (
            <div>
              <Form.Control
                className="mt-3"
                placeholder="Введите ваш код..."
                value={code}
                onChange={changeCode}
              />

              <Form.Control
                className="mt-3"
                placeholder="Введите ваше имя..."
                value={name}
                onChange={changeName}
              />
            </div>
          )}

          <Form.Control
            className="mt-3"
            placeholder="Введите ваш email..."
            value={email}
            onInput={changeEmail}
            type="text"
          />
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш пароль..."
            value={password}
            onInput={changePassword}
            type="password"
          />
          <Row style={{ margin: "auto" }}>
            <Form.Check
              onClick={() => setDisabled(!disabled)}
              type={"checkbox"}
              id={`default`}
              label={"Нажимая галочку, Вы даете разрешение на разглашение"}
            />
            <a href="">персональных данных</a>
          </Row>

          <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin ? (
              <div>
                Нет аккаунта?{" "}
                <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
              </div>
            ) : (
              <div>
                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
              </div>
            )}

            <Button className="ml-auto" onClick={onClick} disabled={disabled}>
              {isLogin ? "Войти" : "Регистрация"}
            </Button>
          </Row>
        </Form>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalText}
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
});

export default Auth;
