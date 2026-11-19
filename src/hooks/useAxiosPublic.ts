import axios from "axios";

export const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
