import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAxiosSecure = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Request Interceptor: Attach JWT Token
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token =
            localStorage.getItem("salonbook_token") ||
            localStorage.getItem("access-token");
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Response Interceptor: Catch 401 & 403 Unauthorized errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          // Token expired or forbidden
          if (typeof window !== "undefined") {
            localStorage.removeItem("salonbook_token");
            localStorage.removeItem("salonbook_user");
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  return axiosSecure;
};

export default useAxiosSecure;
