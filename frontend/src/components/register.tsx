import { useState } from "react";
import { useUserStore } from "../stores/userStore";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register, isLoading, error } = useUserStore();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await register({ username, password });
    // Si el registro es exitoso, el store hace login automático
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
      
      <form onSubmit={handleRegister}>
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
          Registrarse
        </button>
      </form>
    </div>
  );
}
