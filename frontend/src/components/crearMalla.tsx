import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearMalla } from '../services/mallaService';

export default function CrearMalla() {
  const [nombre, setNombre] = useState('');
  const [numSemestres, setNumSemestres] = useState(8);
  const [loading, setLoading] = useState(false);
  const [usarBase, setUsarBase] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setError('El nombre de la malla es requerido');
      return;
    }

    if (numSemestres < 1 || numSemestres > 20) {
      setError('El número de semestres debe estar entre 1 y 20');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nuevaMalla = await crearMalla(nombre, numSemestres, usarBase);
      navigate(`/malla/${nuevaMalla.id}`);
    } catch (err: any) {
      console.error('Error al crear malla:', err);
      setError(err.response?.data?.error || 'Error al crear la malla');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '40px auto', 
      padding: '24px',
      backgroundColor: '#2b2b2b',
      borderRadius: '12px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'white' }}>
        Crear Nueva Malla
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>
            Nombre de la Malla
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Mi Plan 2025-1"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #444',
              backgroundColor: '#1a1a1a',
              color: 'white',
              fontSize: '16px'
            }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>
            Número de Semestres
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={usarBase ? 11 : numSemestres}
            onChange={(e) => setNumSemestres(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #444',
              backgroundColor: usarBase ? '#333' : '#1a1a1a',
              color: 'white',
              fontSize: '16px'
            }}
            disabled={loading || usarBase}
          />
          {usarBase && (
            <p style={{ color: '#ccc', marginTop: 6, fontSize: 13 }}>
              La malla ideal siempre usa 11 semestres.
            </p>
          )}
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

        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            id="usarBase"
            type="checkbox"
            checked={usarBase}
            onChange={(e) => { const checked = e.target.checked; setUsarBase(checked); if (checked) setNumSemestres(11); }}
            disabled={loading}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="usarBase" style={{ color: 'white', cursor: 'pointer', userSelect: 'none' }}>
            Iniciar con malla ideal (plan base sugerido)
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/mis-mallas')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #4e6269ff',
              backgroundColor: 'transparent',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#4e6269ff',
              color: 'white',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Malla'}
          </button>
        </div>
      </form>
    </div>
  );
}
