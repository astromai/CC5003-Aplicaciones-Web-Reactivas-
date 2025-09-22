import { useState } from "react";

export interface Ramo {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
}

export const RamoDisplay = ({ ramo }: { ramo: Ramo }) => {
  // Estados posibles: 0 = pendiente, 1 = cursando, 2 = aprobado
  const [estado, setEstado] = useState(0);

  // Función para cambiar estado en orden circular
  const cambiarEstado = () => {
    setEstado((prev) => (prev + 1) % 3);
  };

  // Colores según estado
  const colores = ["#555", "#FFD700", "#4CE48B"]; 
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
    </div>
  );
};

