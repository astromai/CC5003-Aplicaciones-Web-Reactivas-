import { useState } from "react";
import loginService from "../services/login";

interface RegisterProps {
  onRegisterSuccess: (user: any) => void;
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const user = await loginService.register({
        username,
        password,
      });
      setUsername("");
      setPassword("");
      onRegisterSuccess(user);
    } catch (exception) {
      console.error("Error en registro:", exception);
    }
  };

  return (
    <form onSubmit={handleRegister}>
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
      
      
      <button type="submit">Registrarse</button>
    </form>
  );
}
