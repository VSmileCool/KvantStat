import { $host } from "./index";

interface Iregistr {
  (
    email: string,
    certificate: string,
    name: string,
    surname: string,
    lastname: string,
    institute: string
  ): Promise<any>;
}

interface Ilogin {
  (login: string, password: string): Promise<any>;
}

interface Iexit {
  (refreshToken: string): Promise<any>;
}

export const register: Iregistr = async (
  email,
  certificate,
  name,
  surname,
  lastname,
  institute
) => {
  const { data, status } = await $host.post("auth/registration", {
    email,
    certificate,
    name,
    surname,
    lastname,
    institute,
  });
  console.log(status);
  return data;
};
export const login: Ilogin = async (login, password) => {
  const { data, status } = await $host.post("auth/login", { login, password });
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
