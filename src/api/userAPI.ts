import { $host } from "./index";
import { useSelector } from "react-redux";
import { saveAccessToken } from "../store/userAction";
import { RootState } from "../store/userSlice";
interface Iregistr {
  (
    email: string,
    certificateId: number,
    firstname: string,
    surname: string,
    lastname: string,
    institute: string,
    password: string
  ): Promise<any>;
}

interface Ilogin {
  (email: string, password: string): Promise<any>;
}

interface Iexit {
  (refreshToken: string): Promise<any>;
}

export const register: Iregistr = async (
  email,
  certificateId,
  firstname,
  surname,
  lastname,
  institute,
  password
) => {
  const { data, status } = await $host.post("auth/signUp", {
    email,
    certificateId,
    firstname,
    surname,
    lastname,
    institute,
    password,
  });
  console.log(status);
  data.token ? saveAccessToken(data.token) : null;
  return data;
};
export const login: Ilogin = async (email, password) => {
  console.log(email + " " + password);
  const { data, status } = await $host.post("auth/login", { email, password });
  console.log(status);
  data.token ? saveAccessToken(data.token) : null;
  return data;
};
export const exit: Iexit = async (refreshToken) => {
  const { data, status } = await $host.post(
    "auth.logout",
    {},
    { headers: { refreshToken: refreshToken } }
  );
  console.log(status);
  return data;
};
export const Ientered = async (instituteID: number, access_token: any) => {
  const { data, status } = await $host.post("auth/login", {
    access_token,
    instituteID,
  });
  console.log(status);
  return status;
};
