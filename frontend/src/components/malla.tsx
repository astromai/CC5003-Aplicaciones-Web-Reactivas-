import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SemestreDisplay from "./semestre"; 
import { getMallaById, actualizarEstadoRamo, eliminarRamoDeSemestre } from '../services/mallaService';
import AgregarRamoWizard from './AgregarRamoWizard';
// import { getRamosDisponibles } from '../services/ramoService';
import type { Malla, EstadoRamo } from '../types';

export default function MallaView() {
  const { mallaId } = useParams<{ mallaId: string }>();
  const navigate = useNavigate();
  const [malla, setMalla] = useState<Malla | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [semestreSeleccionado, setSemestreSeleccionado] = useState<number | null>(null);
  // Eliminados estados antiguos del modal simple reemplazado por wizard
  // const [ramosDisponibles, setRamosDisponibles] = useState<RamoDetalle[]>([]);
  // const [ramoSeleccionado, setRamoSeleccionado] = useState<string>('');
  // const [estadoInicial, setEstadoInicial] = useState<EstadoRamo>('pendiente');
  // const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (mallaId) {
      cargarMalla();
    }
  }, [mallaId]);

  const cargarMalla = async () => {
    if (!mallaId) return;
    
    try {
      const data = await getMallaById(mallaId);
      setMalla(data);
      setError(null);
    } catch (err: any) {
      console.error("Error al cargar la malla:", err);
      setError("Error al cargar la malla");
    } finally {
      setLoading(false);
    }
  };

  const abrirAgregarRamo = async (numero: number) => {
    setSemestreSeleccionado(numero);
    setShowWizard(true);
  };

  const cerrarWizard = () => {
    setShowWizard(false);
    setSemestreSeleccionado(null);
  };

  // Reemplazado por wizard

  const handleRamoEstadoChange = async (ramoId: string, nuevoEstado: EstadoRamo) => {
    if (!malla || !mallaId) return;

    try {
      const mallaActualizada = await actualizarEstadoRamo(mallaId, ramoId, nuevoEstado);
      setMalla(mallaActualizada);
    } catch (err: any) {
      console.error("Error al actualizar estado:", err);
      alert("Error al actualizar el estado del ramo");
    }
  };

  const handleEliminarRamo = async (numeroSemestre: number, ramoId: string) => {
    if (!mallaId) return;
    if (!confirm('¿Eliminar este ramo del semestre?')) return;
    try {
      const mallaActualizada = await eliminarRamoDeSemestre(mallaId, numeroSemestre, ramoId);
      setMalla(mallaActualizada);
    } catch (err: any) {
      console.error('Error eliminando ramo:', err);
      alert(err.response?.data?.error || 'Error eliminando el ramo');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '20px', color: 'white' }}>
        Cargando malla...
      </div>
    );
  }

  if (error || !malla) {
    return (
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <p style={{ color: '#ff6b6b', marginBottom: '16px' }}>{error || 'Malla no encontrada'}</p>
        <button 
          onClick={() => navigate('/mis-mallas')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4e6269ff',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Volver a Mis Mallas
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white' }}>{malla.nombre}</h2>
        <button 
          onClick={() => navigate('/mis-mallas')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #4e6269ff',
            backgroundColor: 'transparent',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ← Volver a Mis Mallas
        </button>
      </div>

      <div style={{ display: "flex", gap: 24, padding: 24, flexWrap: "wrap" }}>
        {malla.semestres.map((sem) => (
          <SemestreDisplay 
            key={sem.numero} 
            numero={sem.numero}
            ramos={sem.ramos} 
            onRamoEstadoChange={(ramoId, nuevoEstado) => handleRamoEstadoChange(ramoId, nuevoEstado)}
            onAgregarRamo={abrirAgregarRamo}
            onEliminarRamo={handleEliminarRamo}
          />
        ))}
      </div>
      {showWizard && semestreSeleccionado && (
        <AgregarRamoWizard
          mallaId={mallaId!}
            semestreNumero={semestreSeleccionado}
            onClose={cerrarWizard}
            onAdded={(mallaActualizada) => setMalla(mallaActualizada)}
        />
      )}
    </div>
  );
}
