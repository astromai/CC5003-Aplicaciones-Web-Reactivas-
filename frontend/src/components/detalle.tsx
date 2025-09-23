import type { DetallesRamo } from './ramo';

export const DetalleDisplay = ({ ramo }: { ramo: DetallesRamo }) => {
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
