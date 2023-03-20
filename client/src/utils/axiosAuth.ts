import {
  getAccessTokenLS,
  getRefreshTokenLS,
  setTokenLS,
} from "./localStorage";
import { AuthenticatedUserData, TokenData } from "../types/interfaces";
import axios, { AxiosInstance } from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

// const baseURL = import.meta.env.VITE_API_URL;
const baseURL = "http://localhost:8000/api";

let refresh = getRefreshTokenLS();

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  //   headers: {
  // Authorization: `Token ${access}`,
  //   },
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const access = getAccessTokenLS();
  if (access) config.headers.Authorization = `Token ${access}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshTokenLS();

      if (refreshToken) {
        try {
          const { data } = await axiosInstance.post("/user/refresh", {
            refresh_token: refreshToken,
          });
          const token: AuthenticatedUserData = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            groups: data.groups,
          };
          setTokenLS(token);

          return axiosInstance(originalRequest);
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
