import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SemestreDisplay from "./semestre"; 
import { getMallaById, actualizarEstadoRamo, eliminarRamoDeSemestre } from '../services/mallaService';
import AgregarRamo from './AgregarRamo';
import type { Malla, EstadoRamo } from '../types';

export default function MallaView() {
  const { mallaId } = useParams<{ mallaId: string }>();
  const navigate = useNavigate();
  const [malla, setMalla] = useState<Malla | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAgregar, setShowAgregar] = useState(false);
  const [semestreSeleccionado, setSemestreSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    if (mallaId) cargarMalla();
  }, [mallaId]);

  const cargarMalla = async () => {
    if (!mallaId) return;
    try {
      const data = await getMallaById(mallaId);
      setMalla(data);
      setError(null);
    } catch (err: any) {
      console.error("Error:", err);
      setError("Error al cargar la malla");
    } finally {
      setLoading(false);
    }
  };

  const handleRamoEstadoChange = async (ramoId: string, nuevoEstado: EstadoRamo) => {
    if (!malla || !mallaId) return;
    try {
      const mallaActualizada = await actualizarEstadoRamo(mallaId, ramoId, nuevoEstado);
      setMalla(mallaActualizada);
    } catch (err: any) {
      alert("Error al actualizar estado");
    }
  };

  const handleEliminarRamo = async (numeroSemestre: number, ramoId: string) => {
    if (!mallaId || !confirm('¿Eliminar ramo?')) return;
    try {
      const mallaActualizada = await eliminarRamoDeSemestre(mallaId, numeroSemestre, ramoId);
      setMalla(mallaActualizada);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error eliminando');
    }
  };

  if (loading) return <div className="text-center mt-20 text-cyan-400 animate-pulse">Cargando malla...</div>;
  if (error || !malla) return <div className="text-center mt-20 text-red-400">{error || 'Malla no encontrada'}</div>;

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      {/* Header Fijo */}
      <div className="flex-none p-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/mis-mallas')}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold text-white">{malla.nombre}</h2>
        </div>
      </div>

      {/* Pizarra Horizontal con Scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex px-6 py-6 gap-4 min-w-max">
          {malla.semestres.map((sem) => (
            <SemestreDisplay 
              key={sem.numero} 
              numero={sem.numero}
              ramos={sem.ramos} 
              onRamoEstadoChange={handleRamoEstadoChange}
              onAgregarRamo={(num) => { setSemestreSeleccionado(num); setShowAgregar(true); }}
              onEliminarRamo={handleEliminarRamo}
            />
          ))}
        </div>
      </div>

      {showAgregar && semestreSeleccionado && (
        <AgregarRamo
          mallaId={mallaId!}
          semestreNumero={semestreSeleccionado}
          onClose={() => { setShowAgregar(false); setSemestreSeleccionado(null); }}
          onAdded={(m) => setMalla(m)}
        />
      )}
    </div>
  );
}