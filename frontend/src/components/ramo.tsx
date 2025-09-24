import { useState } from "react";
import { Link } from "react-router-dom";

export interface Ramo {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
}

export interface DetallesRamo extends Ramo {
  descripcion: string;
  porcentajeAprobacion: number;
}

export const RamoDisplay = ({ ramo }: { ramo: Ramo }) => {
  // Estados posibles: 0 = pendiente, 1 = cursando, 2 = aprobado
  const [estado, setEstado] = useState(0);

  // Función para cambiar estado en orden circular
  const cambiarEstado = () => {
    setEstado((prev) => (prev + 1) % 3);
  };

  // Colores según estado
  const colores = ["#ffffffff", "#FFD700", "#4CE48B"]; 
  // gris oscuro, amarillo, verde

  return (
    <div
      onClick={cambiarEstado}
      style={{
        padding: "12px",
        borderRadius: "12px",
        backgroundColor: colores[estado],
        cursor: "pointer",
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

