import { $host } from "./index";
import AuthService from "../components/AuthStorage";

interface Iregistr {
  (
    email: string,
    certificateId: number,
    firstname: string,
    surname: string,
    lastname: string,
    password: string
  ): Promise<any>;
}

interface Ilogin {
  (email: string, password: string): Promise<any>;
}

/**
 * Регистрация нового пользователя.
 *
 * @param email - Адрес электронной почты пользователя.
 * @param certificateId - Идентификатор сертификата пользователя.
 * @param firstname - Имя пользователя.
 * @param surname - Фамилия пользователя.
 * @param lastname - Отчество пользователя.
 * @param password - Пароль пользователя.
 * @returns Промис, который разрешится данными ответа.
 */
export const register: Iregistr = async (
  email,
  certificateId,
  firstname,
  surname,
  lastname,
  password
) => {
  try {
    const { data, status } = await $host.post("auth/signUp", {
      email,
      certificateId,
      firstname,
      surname,
      lastname,
      password,
    });
    console.log(status);
    return data;
  } catch (error) {
    console.error(error);
  }
  try {
    if (status === "200") {
      await login(email, password);
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Вход пользователя в систему.
 *
 * @param email - Адрес электронной почты пользователя.
 * @param password - Пароль пользователя.
 * @returns Промис, который разрешится данными ответа.
 */
export const login: Ilogin = async (email, password) => {
  try {
    const { data, status } = await $host.post("auth/login", {
      email,
      password,
    });

    data.token ? AuthService.saveData("accessToken", data.accessToken) : null;

    return data;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
};

export const getUserInfo = async () => {
  try {
    const access_token = AuthService.getData("accessToken");
    const { data, status } = await $host.post("user/getUserInfo", access_token);
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
};

/**
 * Добавление пользователя в университет.
 *
 * @param instituteID - Идентификатор института.
 * @returns Промис, который разрешится статусом ответа.
 */
export const Ientered = async (instituteID: number) => {
  try {
    const access_token = AuthService.getData("accessToken");
    const { data, status } = await $host.post(
      "auth/addUserToUni",
      { instituteID, access_token },
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    console.log(data);
    console.log(status);
    return status;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
};
