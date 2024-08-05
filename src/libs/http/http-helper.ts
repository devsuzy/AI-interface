import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import axios from "axios";

const AUTHORIZATION = "Authorization";
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.delete["Content-Type"] = "application/json";
axios.defaults.headers.patch["Content-Type"] = "application/json";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401: Unauthorized
    if (error?.response?.status === 401) {
      console.error("[axios response] 401: Unauthorized");
    }
    // 403: Forbidden
    else if (error?.response?.status === 403) {
      console.error("[axios response] 403: Forbidden");
    }

    return Promise.reject(error);
  }
);

export const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 90000,
});

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(
  responseFulfilledInterceptor,
  responseRejectedInterceptor
);

function requestInterceptor(config: InternalAxiosRequestConfig) {
  return config;
}
function responseFulfilledInterceptor(response: any) {
  return response;
}
async function responseRejectedInterceptor(error: AxiosError) {}
