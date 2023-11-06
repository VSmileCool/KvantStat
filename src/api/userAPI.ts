import { $host } from "./index";

interface Iregistr {
  (
    email: string,
    certificateId: number,
    firstname: string,
    surname: string,
    lastname: string,
    institute: string,
    password: string,
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
  return data;
};
export const login: Ilogin = async (email, password) => {
  console.log(email + " " + password)
  const { data, status } = await $host.post("auth/login", { email, password });
  console.log(status);
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
