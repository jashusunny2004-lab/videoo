import axios from 'axios';

const BASE_URL = process.env.VITE_BASE_URL || "http://localhost:5000/api";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true // send the cookies with the request
})