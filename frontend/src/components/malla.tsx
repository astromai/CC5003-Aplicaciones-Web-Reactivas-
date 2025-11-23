import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SemestreDisplay from "./semestre"; 
import AgregarRamo from './AgregarRamo';
import { useMallaStore } from '../stores/mallaStore';
import type { EstadoRamo } from '../types';

export default function MallaView() {
  const { mallaId } = useParams<{ mallaId: string }>();
  const navigate = useNavigate();
  const { mallaActual, isLoading, error, fetchMallaById, updateRamoEstado, removeRamoFromSemestre } = useMallaStore();
  const [showAgregar, setShowAgregar] = useState(false);
  const [semestreSeleccionado, setSemestreSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    if (mallaId) {
      fetchMallaById(mallaId);
    }
  }, [mallaId, fetchMallaById]);

  const handleRamoEstadoChange = async (ramoId: string, nuevoEstado: EstadoRamo) => {
    if (!mallaActual || !mallaId) return;
    await updateRamoEstado(mallaId, ramoId, nuevoEstado);
  };

  const handleEliminarRamo = async (numeroSemestre: number, ramoId: string) => {
    if (!mallaId || !confirm('¿Eliminar ramo?')) return;
    await removeRamoFromSemestre(mallaId, numeroSemestre, ramoId);
  };

  if (isLoading) return <div className="text-center mt-20 text-cyan-400 animate-pulse">Cargando malla...</div>;
  if (error) return <div className="text-center mt-20 text-red-400">{error}</div>;
  if (!mallaActual) return <div className="text-center mt-20 text-red-400">Malla no encontrada</div>;

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
          <h2 className="text-2xl font-bold text-white">{mallaActual.nombre}</h2>
        </div>
      </div>

      {/* Pizarra Horizontal con Scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex px-6 py-6 gap-4 min-w-max">
          {mallaActual.semestres.map((sem) => (
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
          onAdded={() => mallaId && fetchMallaById(mallaId)}
        />
      )}
    </div>
  );
}