import type { Ramo } from "./ramo";
import { RamoDisplay } from "./ramo";

interface Semestre {
  titulo: string;
  ramos: Ramo[];
}

export default function SemestreDisplay({ titulo, ramos }: Semestre) {
  return (
    <div style={{ margin: 12, padding: 12, background: "#f5f5f5", borderRadius: 8 }}>
      <h2 style={{ textAlign: "center", marginBottom: 8 }}>{titulo}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {ramos.map((r) => (
          <RamoDisplay key={r.id} ramo={r} />
        ))}
      </div>
    </div>
  );
}
