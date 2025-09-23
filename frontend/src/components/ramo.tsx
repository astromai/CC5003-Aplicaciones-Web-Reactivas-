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
    </div>
  );
};
