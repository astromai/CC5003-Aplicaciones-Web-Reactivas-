import axios from "axios";

const axiosSecure = axios.create({
    baseURL: import.meta.env.PROD 
        ? "https://fullstack.dcc.uchile.cl:7177" 
        : "http://localhost:3001",
    withCredentials: true,
});


axiosSecure.interceptors.request.use((config) => {
    const csrfToken = localStorage.getItem("csrfToken");
    if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
});

export default axiosSecure;