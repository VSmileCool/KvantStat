import { $host } from "./index";
import AuthService from "../components/AuthStorage";

/**
 * Регистрация пользователя.
 * @param email - Электронная почта пользователя.
 * @param certificateId - Идентификатор сертификата пользователя.
 * @param firstname - Имя пользователя.
 * @param surname - Фамилия пользователя.
 * @param lastname - Отчество пользователя.
 * @param institute - Название института пользователя.
 * @param password - Пароль пользователя.
 * @returns Promise с данными регистрации.
 */
export const register = async (
  email: string,
  certificateId: number,
  firstname: string,
  surname: string,
  lastname: string,
  institute: string,
  password: string
): Promise<any> => {
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

    if (status === 200) {
      await login(email, password);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при регистрации пользователя");
  }
};

/**
 * Вход пользователя.
 * @param email - Электронная почта пользователя.
 * @param password - Пароль пользователя.
 * @returns Promise с данными входа пользователя.
 */
export const login = async (email: string, password: string): Promise<any> => {
  try {
    const { data, status } = await $host.post("auth/login", {
      email,
      password,
    });

    if (data.token) {
      AuthService.saveAccessToken(data.token);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при входе пользователя");
  }
};

/**
 * Вход с использованием токена и идентификатора института.
 * @param instituteID - Идентификатор института.
 * @returns Promise с данными входа пользователя.
 */
export const instituteEntry = async (instituteID: number): Promise<any> => {
  try {
    const accessToken = AuthService.getAccessToken();
    const { data, status } = await $host.post("auth/login", {
      accessToken,
      instituteID,
    });

    console.log(status);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при входе пользователя по токену и ID института");
  }
};
