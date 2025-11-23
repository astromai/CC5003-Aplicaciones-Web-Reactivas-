import { Link } from "react-router-dom";
import type { RamoBase, EstadoRamo } from '../types';
import { nextEstado } from '../types';

// Mapeo: Estado -> Clase CSS (definida en index.css)
const estadoClases: Record<string, string> = {
  pendiente: "ramo-pendiente",
  cursando: "ramo-cursando",
  aprobado: "ramo-aprobado",
  reprobado: "ramo-reprobado",
};

export const RamoDisplay = ({ ramo, onEstadoChange }: { ramo: RamoBase; onEstadoChange?: (nuevoEstado: EstadoRamo) => void }) => {
  // Aseguramos un estado por defecto
  // El backend ahora entrega estados capitalizados; normalizamos a minúsculas para clases
  const estadoActual = (ramo.estado ? ramo.estado.toLowerCase() : 'pendiente');

  const cambiarEstado = () => {
    if (!onEstadoChange) return;
    // Convertimos de minúsculas (estadoActual) a capitalizado para nextEstado
    const capitalizado = (estadoActual.charAt(0).toUpperCase() + estadoActual.slice(1)) as EstadoRamo;
    onEstadoChange(nextEstado(capitalizado));
  };

  return (
    <div
      onClick={onEstadoChange ? cambiarEstado : undefined}
      className={`ramo-card group ${estadoClases[estadoActual]} ${onEstadoChange ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* Cabecera: Código y Créditos */}
      <div className="flex justify-between items-start">
        <span className="ramo-codigo">
          {ramo.codigo}
        </span>
        <span className="ramo-badge">
          {ramo.creditos} CR
        </span>
      </div>

      {/* Cuerpo: Nombre del Ramo (Link) */}
      <div className="flex-1 flex items-center">
        <Link
          to={`/curso/${ramo.id}`}
          onClick={(e) => e.stopPropagation()}
          className="ramo-titulo"
        >
          {ramo.nombre}
        </Link>
      </div>

      {/* Pie: Indicador visual de estado (Barra de progreso decorativa) */}
      <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            estadoActual === 'aprobado' ? 'bg-emerald-400 w-full' :
            estadoActual === 'cursando' ? 'bg-yellow-400 w-1/2 animate-pulse' :
            estadoActual === 'reprobado' ? 'bg-red-400 w-full' : 'w-0'
          }`}
        />
      </div>
    </div>
  );
};