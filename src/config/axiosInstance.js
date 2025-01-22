import axios from "axios";

const API_URL = process.env.API_URL;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    withCredentials: true,
    Accept: "application/json",
  },
});
