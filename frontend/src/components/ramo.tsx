interface Ramo {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
}

export const RamoDisplay = ({ ramo }: { ramo: Ramo }) => {
  return (
    <div>
      <p>
        <strong>Nombre: </strong>
        {ramo.nombre}
      </p>
      <p>
        <strong>Código: </strong>
        {ramo.codigo}
      </p>
      <p>
        <strong>Código: </strong>
        {ramo.creditos}
      </p>
    </div>
  );
};
