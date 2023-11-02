import { $host } from "./index";
import { AxiosResponse } from "axios";

/**
 * Получает список институтов в определенном федеральном округе.
 *
 * @param federal_district - Федеральный округ, для которого необходимо получить институты.
 * @returns Promise, который разрешается в список институтов.
 */
export const getInstitutes = async (
  federal_district: string
): Promise<Array<string>> => {
  try {
    const response = await $host.post("university/university-get", {
      federal_district,
    });
    console.log("getInstitutes - Статус:", response.status);
    return response.data;
  } catch (error) {
    console.error("getInstitutes - Ошибка:", error);
    throw error;
  }
};

/**
 * Получает изображение, связанное с конкретным институтом по его идентификатору.
 *
 * @param id - Идентификатор института, для которого необходимо получить изображение.
 * @returns Promise, который разрешается данными изображения в формате Blob или ошибкой.
 */
export const getImg = async (id: string) => {
  try {
    const response: AxiosResponse = await $host.get(`university/${id}/image`);
    return await response.data.blob();
  } catch (error) {
    console.error(`getImg - Произошла ошибка: ${error}`);
    throw error;
  }
};

/**
 * Получает описание института по его идентификатору.
 *
 * @param id - Идентификатор института, для которого необходимо получить описание.
 * @returns Promise, который разрешается описанием института.
 */
export const getInstituteDescription = async (id: string): Promise<any> => {
  try {
    const response = await $host.get(`/institute/${id}`);
    return response.data;
  } catch (error) {
    console.error(`getInstituteDescriptions - Ошибка: ${error}`);
    throw error;
  }
};
