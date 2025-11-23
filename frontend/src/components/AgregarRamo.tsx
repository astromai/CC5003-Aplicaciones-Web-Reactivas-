import React, { useEffect, useState } from 'react';
import { getRamoFilters, getRamosFiltrados } from '../services/ramoService';
import { agregarRamoASemestre } from '../services/mallaService';
import type { EstadoRamo, RamoDetalle, RamoFiltersResponse, Malla } from '../types';
import { AxiosError } from 'axios';

interface Props {
  mallaId: string;
  semestreNumero: number;
  onClose: () => void;
  onAdded: (mallaActualizada: Malla) => void;
}

const estadoOptions: EstadoRamo[] = ['Pendiente', 'Cursando', 'Aprobado', 'Reprobado'];

const AgregarRamo: React.FC<Props> = ({ mallaId, semestreNumero, onClose, onAdded }) => {
  const [filters, setFilters] = useState<RamoFiltersResponse | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<number>(1);
  const [nivel, setNivel] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [estadoInicial, setEstadoInicial] = useState<EstadoRamo>('Pendiente');

  const [ramos, setRamos] = useState<RamoDetalle[]>([]);
  const [loadingRamos, setLoadingRamos] = useState(false);

  useEffect(() => {
    const cargarFilters = async () => {
      try {
        const data = await getRamoFilters();
        setFilters(data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError('Error cargando filtros');
      } finally {
        setLoadingFilters(false);
      }
    };
    cargarFilters();
  }, []);

  const retroceder = () => {
    if (step === 4 && nivel === 'Especialidad' && categoria && categoria !== 'Electivo' && categoria !== 'Núcleo Gestión') {
      setCategoria('');
      setArea('');
      setRamos([]);
      setStep(2);
      return;
    }
    if (step === 4 && categoria === 'Electivo') {
      setArea('');
      setRamos([]);
      setStep(3);
      return;
    }
    if (step === 3 && categoria === 'Núcleo Gestión') {
      setCategoria('');
      setArea('');
      setRamos([]);
      setStep(2);
      return;
    }
    if (step === 3 && nivel === 'Plan Común') {
      setRamos([]);
      setStep(2);
      return;
    }
    setStep(s => Math.max(1, s - 1));
  };

  const resetDesdeNivel = (nuevoNivel: string) => {
    setNivel(nuevoNivel);
    setCategoria('');
    setArea('');
    setRamos([]);
    setStep(2);
  };

  const seleccionarCategoria = (cat: string) => {
    setCategoria(cat);
    setArea('');
    if (cat === 'Electivo') {
      setStep(3);
      return;
    }
    if (cat === 'Núcleo Gestión') {
      cargarRamosFiltrados({ nivel, categoria: cat });
      setStep(3);
      return;
    }
    cargarRamosFiltrados({ nivel, categoria: cat });
    setStep(4);
  };

  const seleccionarPrefix = (pref: string) => {
    cargarRamosFiltrados({ nivel: 'Plan Común', prefix: pref });
    setStep(3);
  };

  const seleccionarArea = (a: string) => {
    setArea(a);
    if (categoria === 'Electivo') {
      cargarRamosFiltrados({ nivel, categoria, area: a });
      setStep(4);
    } else if (categoria === 'Núcleo Gestión') {
      cargarRamosFiltrados({ nivel, categoria, area: a });
    }
  };

  const cargarRamosFiltrados = async (params: { nivel?: string; categoria?: string; area?: string; prefix?: string }) => {
    setLoadingRamos(true);
    try {
      const data = await getRamosFiltrados(params);
      setRamos(data);
    } catch (e) {
      console.error(e);
      setError('Error cargando ramos');
    } finally {
      setLoadingRamos(false);
    }
  };

  const agregarRamo = async (ramoId: string) => {
    try {
      const mallaActualizada = await agregarRamoASemestre(mallaId, semestreNumero, ramoId, estadoInicial);
      onAdded(mallaActualizada);
      onClose();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof AxiosError
        ? error.response?.data?.error || 'Error agregando ramo'
        : 'Error agregando ramo';
      alert(message);
    }
  };

  const renderPaso1 = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-white">Elegir Nivel</h3>
      <div className="flex gap-3 flex-wrap">
        {['Plan Común', 'Especialidad'].map(n => (
          <button
            key={n}
            onClick={() => resetDesdeNivel(n)}
            className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 active:scale-[.97] transition"
          >{n}</button>
        ))}
      </div>
    </div>
  );

  const renderPaso2PlanComun = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-white">Prefijo Área (Plan Común)</h3>
      <p className="text-sm text-slate-300">Selecciona el prefijo para listar ramos del área.</p>
      <div className="flex flex-wrap gap-2">
        {filters?.planComunPrefijos.map(p => (
          <button
            key={p}
            onClick={() => seleccionarPrefix(p)}
            className="px-3 py-1.5 rounded-md border border-slate-600 text-slate-200 bg-slate-700/30 hover:bg-slate-700/50 transition text-sm"
          >{p}</button>
        ))}
      </div>
      <button onClick={retroceder} className="text-slate-400 hover:text-white text-sm self-start px-2 py-1 rounded-md hover:bg-slate-700/40 transition">← Volver</button>
    </div>
  );

  const renderPaso2Especialidad = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-white">Categoría Especialidad</h3>
      <div className="flex flex-wrap gap-2">
        {(filters?.categoriasPorNivel['Especialidad'] || []).map(c => (
          <button
            key={c}
            onClick={() => seleccionarCategoria(c)}
            className="px-3 py-1.5 rounded-md border border-slate-600 text-slate-200 bg-slate-700/30 hover:bg-slate-700/50 transition text-sm"
          >{c}</button>
        ))}
      </div>
      <button onClick={retroceder} className="text-slate-400 hover:text-white text-sm self-start px-2 py-1 rounded-md hover:bg-slate-700/40 transition">← Volver</button>
    </div>
  );

  const renderPaso3Electivo = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-white">Área Electivo</h3>
      <div className="flex flex-wrap gap-2">
        {filters?.electivoAreas.map(a => (
          <button
            key={a}
            onClick={() => seleccionarArea(a)}
            className="px-3 py-1.5 rounded-md border border-slate-600 text-slate-200 bg-slate-700/30 hover:bg-slate-700/50 transition text-sm"
          >{a}</button>
        ))}
      </div>
      <button onClick={retroceder} className="text-slate-400 hover:text-white text-sm self-start px-2 py-1 rounded-md hover:bg-slate-700/40 transition">← Volver</button>
    </div>
  );

  const renderPaso3Gestion = () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Núcleo Gestión</h3>
        <button onClick={retroceder} className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded-md hover:bg-slate-700/40 transition">← Volver</button>
      </div>
      <p className="text-xs text-slate-400">Filtra por área o muestra todos. El listado se actualiza al instante.</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setArea(''); cargarRamosFiltrados({ nivel, categoria }); }}
          className={`px-3 py-1.5 rounded-md border text-sm transition ${area === '' ? 'bg-cyan-600 border-cyan-500 text-white' : 'border-slate-600 text-slate-200 bg-slate-700/30 hover:bg-slate-700/50'}`}
        >Todos</button>
        {filters?.gestionAreas.map(a => (
          <button
            key={a}
            onClick={() => seleccionarArea(a)}
            className={`px-3 py-1.5 rounded-md border text-sm transition ${area === a ? 'bg-cyan-600 border-cyan-500 text-white' : 'border-slate-600 text-slate-200 bg-slate-700/30 hover:bg-slate-700/50'}`}
          >{a}</button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-300">Estado inicial</label>
        <select
          value={estadoInicial}
          onChange={(e) => setEstadoInicial(e.target.value as EstadoRamo)}
          className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {estadoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      {loadingRamos && <p className="text-slate-400 text-sm">Cargando ramos...</p>}
      {!loadingRamos && ramos.length === 0 && <p className="text-slate-400 text-sm">No se encontraron ramos.</p>}
      <div className="max-h-72 overflow-y-auto flex flex-col gap-2 pr-1">
        {ramos.map(r => (
          <button
            key={r.id}
            onClick={() => agregarRamo(r.id)}
            className="group flex items-center gap-3 text-left px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-700/50 transition"
            title={`${r.codigo} - Créditos: ${r.creditos}`}
          >
            <span className="font-mono text-xs font-semibold text-cyan-300 tracking-wide">{r.codigo}</span>
            <span className="text-sm font-medium flex-1 truncate group-hover:text-white transition-colors">{r.nombre}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/30 border border-white/5 text-slate-300">{r.area || r.categoria || r.nivel}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderListaRamos = () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Seleccionar Ramo</h3>
        <button onClick={retroceder} className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded-md hover:bg-slate-700/40 transition">← Volver</button>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-300">Estado inicial</label>
        <select
          value={estadoInicial}
          onChange={(e) => setEstadoInicial(e.target.value as EstadoRamo)}
          className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {estadoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      {loadingRamos && <p className="text-slate-400 text-sm">Cargando ramos...</p>}
      {!loadingRamos && ramos.length === 0 && <p className="text-slate-400 text-sm">No se encontraron ramos.</p>}
      <div className="max-h-80 overflow-y-auto flex flex-col gap-2 pr-1">
        {ramos.map(r => (
          <button
            key={r.id}
            onClick={() => agregarRamo(r.id)}
            className="group flex items-center gap-3 text-left px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-700/50 transition"
            title={`${r.codigo} - Créditos: ${r.creditos}`}
          >
            <span className="font-mono text-xs font-semibold text-cyan-300 tracking-wide">{r.codigo}</span>
            <span className="text-sm font-medium flex-1 truncate group-hover:text-white transition-colors">{r.nombre}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/30 border border-white/5 text-slate-300">{r.area || r.categoria || r.nivel}</span>
          </button>
        ))}
      </div>
    </div>
  );

  let contenido: React.ReactNode = null;
  if (loadingFilters) contenido = <p style={{ color: 'white' }}>Cargando filtros...</p>;
  else if (error) contenido = <p style={{ color: '#ff6b6b' }}>{error}</p>;
  else {
    if (step === 1) contenido = renderPaso1();
    else if (step === 2 && nivel === 'Plan Común') contenido = renderPaso2PlanComun();
    else if (step === 2 && nivel === 'Especialidad') contenido = renderPaso2Especialidad();
    else if (step === 3 && categoria === 'Electivo') contenido = renderPaso3Electivo();
    else if (step === 3 && categoria === 'Núcleo Gestión') contenido = renderPaso3Gestion();
    else if ((step === 3 && nivel === 'Plan Común') || step === 4) contenido = renderListaRamos();
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-slate-800/60 border border-slate-700 rounded-2xl shadow-xl shadow-black/40 p-6 space-y-6 overflow-y-auto max-h-[90vh]">
        {contenido}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-600/60 transition text-sm font-medium"
          >Cerrar</button>
        </div>
      </div>
    </div>
  );
};



export default AgregarRamo;