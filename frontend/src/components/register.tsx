import { useState } from 'react';
import { useUserStore } from '../stores/userStore';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    await register({ username, password });
  };

  // Nota: En tu App.tsx, el cambio de vuelta a Login se hace "apagando" 
  // el estado showRegister desde el componente padre, pero aquí
  // asumimos que si quieres volver, podrías recargar o usar un prop si lo tuvieras.
  // Para simplificar, usaremos window.location.reload() o simplemente dejamos
  // que el usuario use el botón de "Ya tengo cuenta" si implementamos la lógica inversa.
  // Por ahora, ajustaremos para que se vea bien.

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/30">
        
        <div className="text-center mb-8">

          <h2 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
          <p className="text-slate-400">Comienza a organizar tu futuro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Elige un Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="Usuario nuevo"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="Contraseña"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className= "w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            {}
            <button
              onClick={() => window.location.reload()} 
              className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}