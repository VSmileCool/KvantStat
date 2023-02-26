import axios from "axios";
import { $authHost } from "./index";

export const registration = async (email, password, code, name) => {
  console.log(email, password, code, name);
  const { data } = await axios({
    method: "post",
    url: "http://localhost:4000/auth/registration",
    data: { email, password, code, name },
  });
  if (data.return === "Пользователь с таким кодом уже есть") {
    return data;
  }
  if (data.return === "yes") {
    localStorage.setItem("name", data.name);
    localStorage.setItem("code", data.code);
    localStorage.setItem("email", data.email);
    localStorage.setItem("password", data.password);
    return data;
  }
};

export const login = async (email, password) => {
  const { data } = await axios({
    method: "post",
    url: "http://localhost:4000/auth/login",
    data: { email, password },
  });
  console.log(data);
  if (data === "Пользователь с таким именем не найден") {
    return data;
  }
  if (data === "yes") {
    localStorage.setItem("name", data.name);
    localStorage.setItem("code", data.code);
    localStorage.setItem("email", data.email);
    localStorage.setItem("password", data.password);
    return data;
  }
};

export const check = async () => {
  const { data } = await $authHost.get("auth/auth");
  console.log(data);
};
