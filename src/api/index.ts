import axios from "axios";

const $host = axios.create({
  baseURL: "http://127.0.0.1:8080/",
});

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export { $host, $authHost };
