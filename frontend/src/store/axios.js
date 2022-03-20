import axios from "axios";

const url = "http://localhost:3000";
const axiosInstance = axios.create({
  baseURL: `${url}`,
  headers: {
    "Content-type": "application/json",
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

export default axiosInstance;
