import { useState } from "react";
import { useUserStore } from "../stores/userStore";

interface LoginProps {
  onShowRegister: () => void;
}

export default function Login({ onShowRegister }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useUserStore();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await login({ username, password });
    // Si el login sale bien, el store actualiza isAuthenticated, cambiando vista
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          Login
        </button>
      </form>
      
      <p>
        ¿No tienes cuenta? <button type="button" onClick={onShowRegister} disabled={isLoading}>Regístrate</button>
      </p>
    </div>
  );
}
