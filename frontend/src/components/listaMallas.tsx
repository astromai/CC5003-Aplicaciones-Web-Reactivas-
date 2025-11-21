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

  const handleEliminar = async (mallaId: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar la malla "${nombre}"?`)) {
      return;
    }

    try {
      await deleteMalla(mallaId);
      setMallas(mallas.filter(m => m.id !== mallaId));
    } catch (err: any) {
      console.error('Error al eliminar malla:', err);
      alert('Error al eliminar la malla');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '40px', color: 'white' }}>
        Cargando mallas...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'white' }}>Mis Mallas</h1>
        <button
          onClick={() => navigate('/crear-malla')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4e6269ff',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          + Nueva Malla
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '16px', 
          backgroundColor: '#ff444444', 
          borderRadius: '8px',
          color: '#ff6b6b'
        }}>
          {error}
        </div>
      )}

      {mallas.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#2b2b2b', 
          borderRadius: '12px',
          color: '#999'
        }}>
          <p>No tienes mallas creadas aún.</p>
          <button
            onClick={() => navigate('/crear-malla')}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#4e6269ff',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Crear tu primera malla
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {mallas.map((malla) => (
            <div
              key={malla.id}
              style={{
                padding: '20px',
                backgroundColor: '#2b2b2b',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', marginBottom: '8px' }}>{malla.nombre}</h3>
                <p style={{ color: '#999', fontSize: '14px' }}>
                  {malla.semestres.length} semestres • 
                  {malla.semestres.reduce((total, sem) => total + sem.ramos.length, 0)} ramos
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => navigate(`/malla/${malla.id}`)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#4e6269ff',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Ver
                </button>
                <button
                  onClick={() => handleEliminar(malla.id, malla.nombre)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #ff4444',
                    backgroundColor: 'transparent',
                    color: '#ff4444',
                    cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
