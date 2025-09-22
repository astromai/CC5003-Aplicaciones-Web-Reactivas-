import type { Ramo } from "./ramo";
import axios from "axios";
import SemestreDisplay from "./semestre"; 
import { useState, useEffect } from "react";

export default function Malla() {

  const [semestres, setSemestres] = useState<{ id: number, titulo: string; ramos: Ramo[] }[]>([]);
  // render data from backend
  useEffect(() => {
    axios.get("http://localhost:3000/semestres")
      .then(res => {
        setSemestres(res.data);
        console.log(res.data);
      })
      .catch(err => console.error(err));
  }, []); // <- array vacío asegura que solo se ejecute una vez al montar


  /*
  const semestres: { titulo: string; ramos: Ramo[] }[] = [
    {
      titulo: "Semestre 1",
      ramos: [
        { id: 1, nombre: "Introducción al Cálculo", codigo: "MA1001", creditos: 6 },
        { id: 2, nombre: "Introducción al Álgebra", codigo: "MA1101", creditos: 6 },
        { id: 3, nombre: "Aplicaciones de la Biología a la Ingeniería y Ciencias", codigo: "BT1211", creditos: 6 },
      ],
    },
    {
      titulo: "Semestre 2",
      ramos: [
        { id: 4, nombre: "Cálculo Diferencial e Integral", codigo: "MA1002", creditos: 6 },
        { id: 5, nombre: "Álgebra Lineal", codigo: "MA1102", creditos: 6 },
        { id: 6, nombre: "Introducción a la Física Moderna", codigo: "FI1100", creditos: 6 },
      ],
    },
    {
      titulo: "Semestre 3",
      ramos: [
        { id: 7, nombre: "Química", codigo: "IQ2211", creditos: 6 },
        { id: 8, nombre: "Cálculo en Varias Variables", codigo: "MA2001", creditos: 6 },
        { id: 9, nombre: "Ecuaciones Diferenciales Ordinarias", codigo: "MA2601", creditos: 6 },
      ],
    },
  ];
  */

  return (
    <div style={{ display: "flex", gap: 24, padding: 24, flexWrap: "wrap" }}>
      {semestres.map((sem) => (
        <SemestreDisplay key={sem.id} titulo={sem.titulo} ramos={sem.ramos} />
      ))}
    </div>
  );
}
