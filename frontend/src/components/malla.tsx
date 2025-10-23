import type { Ramo } from "./ramo";
import axios from "axios";
import SemestreDisplay from "./semestre"; 
import { useState, useEffect } from "react";

export default function Malla() {

  const [semestres, setSemestres] = useState<{ id: number, titulo: string; ramos: Ramo[] }[]>([]);
  // render data from backend
  useEffect(() => {
    axios.get("http://localhost:3001/api/semestres")
      .then(res => {
        setSemestres(res.data);
        console.log(res.data);
      })
      .catch(err => console.error(err));
  }, []); // <- array vacío asegura que solo se ejecute una vez al montar

  return (
    <div style={{ display: "flex", gap: 24, padding: 24, flexWrap: "wrap" }}>
      {semestres.map((sem) => (
        <SemestreDisplay key={sem.id} titulo={sem.titulo} ramos={sem.ramos} />
      ))}
    </div>
  );
}
