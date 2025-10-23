import axios from "axios";
import axiosSecure from "../utils/axiosSecure";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

type Credentials = {
    username: string;
    password: string;
};

const login = async (credentials: Credentials) => {
    const response = await axios.post("/api/user/login", credentials);
    
    const csrfToken = response.headers["X-CSRF-Token"];
    
    if (csrfToken) {
        localStorage.setItem("csrfToken", csrfToken);
    }
    
    return response.data;
};

const restoreLogin = async () => {
    try {
        const response = await axiosSecure.get("/api/user/me");
        return response.data;
    } catch {
        return null;
    }
};

const logout = async () => {
    await axiosSecure.post("/api/user/logout");
    localStorage.removeItem("csrfToken");
};

export default { login, restoreLogin, logout };
