import { Link } from "react-router-dom";
import type { RamoBase, EstadoRamo } from '../types';
import { ESTADO_COLOR, nextEstado } from '../types';

export const RamoDisplay = ({ ramo, onEstadoChange }: { ramo: RamoBase; onEstadoChange?: (nuevoEstado: EstadoRamo) => void }) => {
  const cambiarEstado = () => {
    if (!onEstadoChange) return;
    const estadoActual: EstadoRamo = ramo.estado || 'pendiente';
    onEstadoChange(nextEstado(estadoActual));
  };

  return (
    <div
      onClick={onEstadoChange ? cambiarEstado : undefined}
      style={{
        padding: "12px",
        borderRadius: "12px",
        backgroundColor: ESTADO_COLOR[ramo.estado || 'pendiente'],
        cursor: onEstadoChange ? "pointer" : "default",
        transition: "background-color 0.3s",
      }}
    >
      <p>
        <strong> </strong>
        <Link to={`/curso/${ramo.id}`} onClick={(e) => e.stopPropagation()} style={{ color: 'inherit'}}>
          {ramo.nombre}
        </Link>
      </p>
      <p>
        <strong>Código: </strong>
        {ramo.codigo}
      </p>
      <p>
        <strong>Créditos: </strong>
        {ramo.creditos}
      </p>
    </div>
  );
};

