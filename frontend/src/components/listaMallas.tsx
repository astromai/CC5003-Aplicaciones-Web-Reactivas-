import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMallasUsuario, deleteMalla } from '../services/mallaService';
import type { Malla } from '../types';

export default function ListaMallas() {
  const [mallas, setMallas] = useState<Malla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarMallas();
  }, []);

  const cargarMallas = async () => {
    try {
      const data = await getMallasUsuario();
      setMallas(data);
      setError(null);
    } catch (err: any) {
      console.error('Error al cargar mallas:', err);
      setError('Error al cargar las mallas');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (mallaId: string, nombre: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que el click abra la malla
    if (!confirm(`¿Estás seguro de eliminar la malla "${nombre}"?`)) return;

    try {
      await deleteMalla(mallaId);
      setMallas(mallas.filter(m => m.id !== mallaId));
    } catch (err: any) {
      alert('Error al eliminar la malla');
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl text-cyan-400 animate-pulse">Cargando tus mallas...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Mis Mallas
          </h1>
          <p className="text-slate-400 mt-2">Organiza tu carrera académica</p>
        </div>
        <button
          onClick={() => navigate('/crear-malla')}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>+</span> Nueva Malla
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {/* Grid de Mallas */}
      {mallas.length === 0 ? (
        <div className="text-center p-20 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30">
          <p className="text-slate-400 text-lg mb-4">Aún no tienes mallas creadas.</p>
          <button onClick={() => navigate('/crear-malla')} className="text-cyan-400 hover:underline">
            Crear la primera ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mallas.map((malla) => (
            <div
              key={malla.id}
              onClick={() => navigate(`/malla/${malla.id}`)}
              className="group relative bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-cyan-900/20 hover:-translate-y-1 overflow-hidden"
            >
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-cyan-500/20" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-2xl">
                    🎓
                  </div>
                  <button
                    onClick={(e) => handleEliminar(malla.id, malla.nombre, e)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {malla.nombre}
                </h3>
                
                <div className="flex gap-4 text-sm text-slate-400 mt-4 pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    📅 {malla.semestres.length} Semestres
                  </span>
                  <span className="flex items-center gap-1">
                    📚 {malla.semestres.reduce((total, sem) => total + sem.ramos.length, 0)} Ramos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}