import axios from "axios";
import axiosSecure from "../utils/axiosSecure";
import type { User } from "../types/user";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

type Credentials = {
    username: string;
    password: string;
};

const login = async (credentials: Credentials): Promise<User> => {
    const response = await axios.post<User>("/api/user/login", credentials);
    
    const csrfToken = response.headers["x-csrf-token"];
    const userData = response.data;
    
    if (!csrfToken) {
        throw new Error("No CSRF token received from server");
    }
    
    localStorage.setItem("csrfToken", csrfToken);
    localStorage.setItem("user", JSON.stringify(userData));
    
    return userData;
};

const restoreLogin = async (): Promise<User | null> => {
    try {
        const csrfToken = localStorage.getItem("csrfToken");
        if (!csrfToken) {
            return null;
        }

        const response = await axiosSecure.get<User>("/api/user/me");
        if (response.data) {
            // Actualizamos el usuario en el localStorage con los datos más recientes
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        }
        
        // Si no hay respuesta válida, limpiamos el localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("csrfToken");
        return null;
    } catch (error) {
        // Si hay error, limpiamos el localStorage
        console.error("Error restoring login:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("csrfToken");
        return null;
    }
};

const register = async (credentials: Credentials): Promise<User> => {
    const response = await axios.post<User>("/api/user/register", credentials);
    return response.data;
};

const logout = async () => {
    await axiosSecure.post("/api/user/logout");
    localStorage.removeItem("csrfToken");
    localStorage.removeItem("user");
};

export default { login, register, restoreLogin, logout };
