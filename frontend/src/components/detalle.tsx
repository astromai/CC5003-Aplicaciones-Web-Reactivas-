import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
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

export default function Detalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [curso, setCurso] = useState<DetallesRamo | null>(null);

  useEffect(() => {
    if (id) {
      axios.get("http://localhost:3000/semestres")
        .then(res => {
          const semestres = res.data;
          let cursoEncontrado = null;
          
          for (const semestre of semestres) {
            cursoEncontrado = semestre.ramos.find((curso: DetallesRamo) => curso.id === parseInt(id));
            if (cursoEncontrado) break;
          }
          setCurso(cursoEncontrado);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!curso) {
    return (
      <div>
        <h2>Curso no encontrado.</h2>
        <button onClick={() => navigate('/')}>Volver a la malla</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <DetalleDisplay ramo={curso} />
      <button onClick={() => navigate('/')} style={{backgroundColor:'#4e6269ff'}}> Volver a la malla</button>
      
    </div>
  );
}
