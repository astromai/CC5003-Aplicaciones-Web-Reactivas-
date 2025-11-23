import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { RamoDetalle } from '../types';
import { getRamoById } from '../services/ramoService';
import { AxiosError } from 'axios';

export const DetalleDisplay = ({ ramo }: { ramo: RamoDetalle }) => {
  return (
    <div style={{ padding: 8 }}>
      <p>
        <strong>Nombre: </strong>
        {ramo.nombre}
      </p>
      <p>
        <strong>Código: </strong>
        {ramo.codigo}
      </p>
      <p>
        <strong>Créditos: </strong>
        {ramo.creditos}
      </p>
      <p>
        <strong>Porcentaje de Aprobación: </strong>
        {ramo.porcentajeAprobacion}%
      </p>
      <p>
        <strong>Descripción: </strong>
        {ramo.descripcion}
      </p>
    </div>
  );
};

export default function Detalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [curso, setCurso] = useState<RamoDetalle | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchRamo = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const ramo = await getRamoById(id);
        if (!cancelled) {
          setCurso(ramo);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          const message = error instanceof AxiosError
            ? error.response?.data?.error || 'No se pudo cargar el ramo'
            : 'No se pudo cargar el ramo';
          setError(message);
          setCurso(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRamo();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'white' }}>
        Cargando detalles...
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h2 style={{ color: '#ff6b6b' }}>{error || 'Curso no encontrado'}</h2>
        <button onClick={() => navigate(-1)} style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#4e6269ff',
          color: 'white',
          cursor: 'pointer'
        }}>Volver</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <DetalleDisplay ramo={curso} />
      <button onClick={() => navigate(-1)} style={{
        backgroundColor:'#4e6269ff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer'
      }}>Volver</button>
      
    </div>
  );
}
