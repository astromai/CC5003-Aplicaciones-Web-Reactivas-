import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SemestreDisplay from "./semestre"; 
import { getMallaById, actualizarEstadoRamo, agregarRamoASemestre } from '../services/mallaService';
import { getRamosDisponibles } from '../services/ramoService';
import type { Malla, EstadoRamo, RamoDetalle } from '../types';

export default function MallaView() {
  const { mallaId } = useParams<{ mallaId: string }>();
  const navigate = useNavigate();
  const [malla, setMalla] = useState<Malla | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [semestreSeleccionado, setSemestreSeleccionado] = useState<number | null>(null);
  const [ramosDisponibles, setRamosDisponibles] = useState<RamoDetalle[]>([]);
  const [ramoSeleccionado, setRamoSeleccionado] = useState<string>('');
  const [estadoInicial, setEstadoInicial] = useState<EstadoRamo>('pendiente');
  const [adding, setAdding] = useState(false);

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
    setShowModal(true);
    setRamoSeleccionado('');
    setEstadoInicial('pendiente');
    try {
      const ramos = await getRamosDisponibles();
      setRamosDisponibles(ramos);
    } catch (e) {
      console.error('Error cargando ramos disponibles', e);
    }
  };

  const cerrarModal = () => {
    if (adding) return;
    setShowModal(false);
    setSemestreSeleccionado(null);
  };

  const handleAgregarRamo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mallaId || !semestreSeleccionado || !ramoSeleccionado) return;
    setAdding(true);
    try {
      const mallaActualizada = await agregarRamoASemestre(mallaId, semestreSeleccionado, ramoSeleccionado, estadoInicial);
      setMalla(mallaActualizada);
      cerrarModal();
    } catch (err: any) {
      console.error('Error agregando ramo:', err);
      alert(err.response?.data?.error || 'Error agregando ramo');
    } finally {
      setAdding(false);
    }
  };

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
          />
        ))}
      </div>
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#2b2b2b',
            padding: 24,
            borderRadius: 12,
            width: '420px',
            maxWidth: '90%'
          }}>
            <h3 style={{ color: 'white', marginTop: 0 }}>Agregar Ramo (Semestre {semestreSeleccionado})</h3>
            <form onSubmit={handleAgregarRamo}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, color: 'white' }}>Ramo</label>
                <select
                  value={ramoSeleccionado}
                  onChange={(e) => setRamoSeleccionado(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    border: '1px solid #444'
                  }}
                  disabled={adding}
                >
                  <option value="" disabled>Seleccione un ramo...</option>
                  {ramosDisponibles.map(r => (
                    <option key={r.id} value={r.id}>{r.nombre} ({r.codigo})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, color: 'white' }}>Estado inicial</label>
                <select
                  value={estadoInicial}
                  onChange={(e) => setEstadoInicial(e.target.value as EstadoRamo)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    border: '1px solid #444'
                  }}
                  disabled={adding}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="cursando">Cursando</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="reprobado">Reprobado</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={cerrarModal}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #4e6269ff',
                    backgroundColor: 'transparent',
                    color: 'white',
                    cursor: adding ? 'not-allowed' : 'pointer'
                  }}
                  disabled={adding}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#4e6269ff',
                    color: 'white',
                    cursor: adding ? 'not-allowed' : 'pointer',
                    opacity: adding ? 0.7 : 1
                  }}
                  disabled={adding || !ramoSeleccionado}
                >
                  {adding ? 'Agregando...' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
