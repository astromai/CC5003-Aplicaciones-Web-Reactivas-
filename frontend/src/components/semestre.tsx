import { RamoDisplay } from "./ramo";
import type { RamoBase, EstadoRamo } from '../types';

export interface SemestreDisplayProps {
  numero: number;
  ramos: RamoBase[];
  onRamoEstadoChange?: (ramoId: string, nuevoEstado: EstadoRamo) => void;
  onAgregarRamo?: (numero: number) => void;
}

export default function SemestreDisplay({ numero, ramos, onRamoEstadoChange, onAgregarRamo }: SemestreDisplayProps) {
  return (
    <div style={{ margin: 12, padding: 12, background: "#2b2b2b", borderRadius: 8, position: 'relative', minWidth: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ color: "white", fontSize: '18px', margin: 0 }}>
          Semestre {numero}
        </h2>
        {onAgregarRamo && (
          <button
            onClick={() => onAgregarRamo(numero)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#4e6269ff',
              color: 'white',
              fontSize: '20px',
              lineHeight: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label={`Agregar ramo a semestre ${numero}`}
          >
            +
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ramos.map((r) => (
          <RamoDisplay
            key={r.id}
            ramo={r}
            onEstadoChange={onRamoEstadoChange ? (estado) => onRamoEstadoChange(r.id, estado) : undefined}
          />
        ))}
        {ramos.length === 0 && (
          <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', margin: 0 }}>Sin ramos aún</p>
        )}
      </div>
    </div>
  );
}

