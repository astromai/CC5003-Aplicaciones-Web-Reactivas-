import { useState } from "react";
import loginService from "../services/login";

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onShowRegister: () => void;
}

export default function Login({ onLoginSuccess, onShowRegister }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUsername("");
      setPassword("");
      onLoginSuccess(user);
    } catch (exception) {
      console.error("Error en login:", exception);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        
        <button type="submit">Login</button>
      </form>
      
      <p>
        ¿No tienes cuenta? <button type="button" onClick={onShowRegister}>Regístrate</button>
      </p>
    </div>
  );
}
