import { RamoDisplay } from "./ramo";
import type { RamoBase, EstadoRamo } from '../types';

export interface SemestreDisplayProps {
  numero: number;
  ramos: RamoBase[];
  onRamoEstadoChange?: (ramoId: string, nuevoEstado: EstadoRamo) => void;
  onAgregarRamo?: (numero: number) => void;
  onEliminarRamo?: (numero: number, ramoId: string) => void;
}

export default function SemestreDisplay({ numero, ramos, onRamoEstadoChange, onAgregarRamo, onEliminarRamo }: SemestreDisplayProps) {
  // Calculamos los créditos totales del semestre para mostrarlo en el header
  const totalCreditos = ramos.reduce((acc, r) => acc + r.creditos, 0);
  
  // Determinamos si la carga académica es alta (visual)
  const cargaAlta = totalCreditos > 30;

  return (
    <div className="w-80 min-w-[320px] flex flex-col bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-slate-800/60 hover:border-white/20 max-h-full shadow-lg shadow-black/20">
      
      {/* --- Header del Semestre --- */}
      <div className="p-4 border-b border-white/5 bg-slate-800/50 flex justify-between items-center backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 font-bold text-sm border border-white/5">
            {numero}
          </div>
          <div>
            <h2 className="text-white font-bold text-base m-0 leading-none">Semestre</h2>
            <span className={`text-[10px] font-medium mt-0.5 block ${cargaAlta ? 'text-orange-400' : 'text-slate-400'}`}>
              {totalCreditos} Créditos
            </span>
          </div>
        </div>
      </div>

      {/* --- Lista de Ramos (Scrollable) --- */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar min-h-[100px]">
        {ramos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-700/50 rounded-xl text-slate-500 bg-slate-800/20">
            <span className="text-2xl mb-2 opacity-50">📭</span>
            <p className="text-xs font-medium">Semestre vacío</p>
          </div>
        ) : (
          ramos.map((r) => (
            <div key={r.id} className="relative group transition-transform hover:scale-[1.02]">
              {/* Botón Eliminar (Flotante y visible solo en hover) */}
              {onEliminarRamo && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEliminarRamo(numero, r.id);
                  }}
                  className="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 transform hover:scale-110 cursor-pointer text-sm font-bold"
                  title={`Eliminar ${r.nombre}`}
                >
                  ×
                </button>
              )}
              
              {/* Componente Ramo */}
              <RamoDisplay
                ramo={r}
                onEstadoChange={
                  onRamoEstadoChange
                    ? (estado) => onRamoEstadoChange(r.id, estado)
                    : undefined
                }
              />
            </div>
          ))
        )}
      </div>

      {/* --- Footer: Botón Agregar --- */}
      {onAgregarRamo && (
        <div className="p-3 border-t border-white/5 bg-slate-800/30">
          <button
            onClick={() => onAgregarRamo(numero)}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-600 hover:border-cyan-500/50 bg-slate-800/50 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium group"
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs group-hover:rotate-90 transition-transform duration-300">+</span>
            Agregar Ramo
          </button>
        </div>
      )}
    </div>
  );
}