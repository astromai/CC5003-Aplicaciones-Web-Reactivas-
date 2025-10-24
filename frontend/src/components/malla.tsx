import type { Ramo } from "./ramo";
import axiosSecure from "../utils/axiosSecure";
import SemestreDisplay from "./semestre"; 
import { useState, useEffect } from "react";

interface SemestreData {
  id: number;
  titulo: string;
  ramos: Array<Ramo>;
}

interface Semestre {
  titulo: string;
  ramos: Array<{
    ramo: Ramo;
    estado: 'aprobado' | 'cursando' | 'reprobado' | 'pendiente';
  }>;
}

interface MallaData {
  nombre: string;
  semestres: Semestre[];
}

export default function Malla() {
  const [malla, setMalla] = useState<MallaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMalla = async () => {
      try {
        const response = await axiosSecure.get("/api/semestres");
        // Los datos vienen de MongoDB con el formato correcto
        const semestres = response.data.map((semestre: any) => ({
          titulo: semestre.titulo,
          ramos: semestre.ramos.map((ramo: any) => ({
            ramo: {
              id: ramo._id,
              nombre: ramo.nombre,
              codigo: ramo.codigo,
              creditos: ramo.creditos,
              descripcion: ramo.descripcion,
              porcentajeAprobacion: ramo.porcentajeAprobacion
            },
            estado: 'pendiente' as const
          }))
        }));

        setMalla({
          nombre: "Plan Común de Ingeniería y Ciencias",
          semestres
        });
        setError(null);
      } catch (err) {
        console.error("Error al cargar la malla:", err);
        setError("Error al cargar la malla. Por favor, intenta de nuevo más tarde.");
      }
    };

    fetchMalla();
  }, []); // Se ejecuta solo al montar el componente

  const handleRamoEstadoChange = (semestreIndex: number, ramoId: number, nuevoEstado: 'pendiente' | 'cursando' | 'aprobado' | 'reprobado') => {
    if (!malla) return;

    const nuevaMalla = {
      ...malla,
      semestres: malla.semestres.map((semestre, idx) => {
        if (idx !== semestreIndex) return semestre;
        
        return {
          ...semestre,
          ramos: semestre.ramos.map(ramo => {
            if (ramo.ramo.id !== ramoId) return ramo;
            return { ...ramo, estado: nuevoEstado };
          })
        };
      })
    };

    setMalla(nuevaMalla);
  };

  return (
    <div>
      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '20px' }}>
          {error}
        </div>
      )}
      
      {!malla ? (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          Cargando malla...
        </div>
      ) : (
        <div>
          <h2 style={{ textAlign: 'center', margin: '20px' }}>{malla.nombre}</h2>
          <div style={{ display: "flex", gap: 24, padding: 24, flexWrap: "wrap" }}>
            {malla.semestres.map((sem, index) => (
              <SemestreDisplay 
                key={index} 
                titulo={sem.titulo} 
                ramos={sem.ramos.map(r => ({
                  ...r.ramo,
                  estado: r.estado
                }))} 
                onRamoEstadoChange={(ramoId, nuevoEstado) => 
                  handleRamoEstadoChange(index, ramoId, nuevoEstado)
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
