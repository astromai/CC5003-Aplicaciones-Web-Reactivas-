import { Link } from "react-router-dom";

export interface Ramo {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  estado?: 'aprobado' | 'cursando' | 'reprobado' | 'pendiente';
}

export interface DetallesRamo extends Ramo {
  descripcion: string;
  porcentajeAprobacion: number;
}

export const RamoDisplay = ({ ramo, onEstadoChange }: { ramo: Ramo; onEstadoChange?: (nuevoEstado: 'pendiente' | 'cursando' | 'aprobado' | 'reprobado') => void }) => {
  // Colores según estado
  const getColor = (estado?: string) => {
    switch (estado) {
      case 'pendiente':
        return "#393131ff"; // gris oscuro
      case 'cursando':
        return "#FFD700"; // amarillo
      case 'aprobado':
        return "#4CE48B"; // verde
      case 'reprobado':
        return "#FF4444"; // rojo
      default:
        return "#393131ff"; // gris oscuro por defecto
    }
  };

  const cambiarEstado = () => {
    if (!onEstadoChange) return;
    
    const estados: ('pendiente' | 'cursando' | 'aprobado' | 'reprobado')[] = ['pendiente', 'cursando', 'aprobado', 'reprobado'];
    const estadoActual = ramo.estado || 'pendiente';
    const indiceActual = estados.indexOf(estadoActual);
    const nuevoEstado = estados[(indiceActual + 1) % estados.length];
    onEstadoChange(nuevoEstado);
  };

  return (
    <div
      onClick={onEstadoChange ? cambiarEstado : undefined}
      style={{
        padding: "12px",
        borderRadius: "12px",
        backgroundColor: getColor(ramo.estado),
        cursor: onEstadoChange ? "pointer" : "default",
        transition: "background-color 0.3s",
      }}
    >
      <p>
        <strong>Nombre: </strong>
        <Link to={`/curso/${ramo.id}`} onClick={(e) => e.stopPropagation()}style={{ color: 'inherit'}}>
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

