import axios from "axios";
import { redirect } from "next/navigation";

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


axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            redirect("/login");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;


