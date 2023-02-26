import { $host } from "./index";

export const getInstitute = async (id) => {
  const { data } = await $host.get("api/institute/get");
  return data;
};

export function getAllInstitutes() {
  const { data } = $host.get("institute/getall");
  return data;
}

export const addInstitute = async (name, latitude, longitude) => {
  const { data } = await $host.post("api/institute/add", {
    name,
    latitude,
    longitude,
  });
  return data;
};
export const deleteInstitute = async (name) => {
  await $host.post("api/institute/delete", { name });
};
