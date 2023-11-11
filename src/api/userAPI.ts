import { $host } from "./index";
import AuthService from "../components/AuthStorage";

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

/**
 * Регистрация нового пользователя.
 *
 * @param email - Адрес электронной почты пользователя.
 * @param certificateId - Идентификатор сертификата пользователя.
 * @param firstname - Имя пользователя.
 * @param surname - Фамилия пользователя.
 * @param lastname - Отчество пользователя.
 * @param institute - Название института, к которому привязан пользователь.
 * @param password - Пароль пользователя.
 * @returns Промис, который разрешится данными ответа.
 */
export const register: Iregistr = async (
  email,
  certificateId,
  firstname,
  surname,
  lastname,
  institute,
  password
) => {
  try {
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

    data.token ? AuthService.saveAccessToken(data.accessToken) : null;
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
    const access_token = AuthService.getAccessToken();
    const { data, status } = await $host.post(
      "auth/addUserToUni",
      { instituteID },
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    console.log(status);
    return status;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
};
