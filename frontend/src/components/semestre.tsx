import type { Ramo } from "./ramo";
import { RamoDisplay } from "./ramo";

export interface Semestre {
  titulo: string;
  ramos: Ramo[];
}

export default function SemestreDisplay({ titulo, ramos }: Semestre) {
  return (
    <div style={{ margin: 12, padding: 12, background: "#2b2b2b", borderRadius: 8 }}>
      <h2 style={{ textAlign: "center", marginBottom: 12, color: "white" }}>
        {titulo}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ramos.map((r) => (
          <RamoDisplay key={r.id} ramo={r} />
        ))}
      </div>
    </div>
  );
}

