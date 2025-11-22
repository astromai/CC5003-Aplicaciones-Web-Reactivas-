import React, { useEffect, useState } from 'react';
import { getRamoFilters, getRamosFiltrados } from '../services/ramoService';
import { agregarRamoASemestre } from '../services/mallaService';
import type { EstadoRamo, RamoDetalle, RamoFiltersResponse } from '../types';

interface Props {
  mallaId: string;
  semestreNumero: number;
  onClose: () => void;
  onAdded: (mallaActualizada: any) => void;
}

// Pasos:
// 1: elegir nivel
// 2: según nivel elegir (prefijo Plan Común) o categoría Especialidad
// 3: si Especialidad Electivo -> elegir área; si Núcleo Gestión -> elegir área opcional
// 4: lista ramos + estado inicial

const estadoOptions: EstadoRamo[] = ['pendiente', 'cursando', 'aprobado', 'reprobado'];

const AgregarRamoWizard: React.FC<Props> = ({ mallaId, semestreNumero, onClose, onAdded }) => {
  const [filters, setFilters] = useState<RamoFiltersResponse | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<number>(1);
  const [nivel, setNivel] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [estadoInicial, setEstadoInicial] = useState<EstadoRamo>('pendiente');

  const [ramos, setRamos] = useState<RamoDetalle[]>([]);
  const [loadingRamos, setLoadingRamos] = useState(false);

  useEffect(() => {
    const cargarFilters = async () => {
      try {
        const data = await getRamoFilters();
        setFilters(data);
        setError(null);
      } catch (e: any) {
        console.error(e);
        setError('Error cargando filtros');
      } finally {
        setLoadingFilters(false);
      }
    };
    cargarFilters();
  }, []);

  const retroceder = () => {
    // Caso: Lista de ramos de categoría Especialidad que saltó directo (Obligatorio, Práctica, Formación Integral, Título, etc.)
    if (step === 4 && nivel === 'Especialidad' && categoria && categoria !== 'Electivo' && categoria !== 'Núcleo Gestión') {
      // Volver a seleccionar categoría
      setCategoria('');
      setArea('');
      setRamos([]);
      setStep(2);
      return;
    }
    // Caso: Electivo lista -> volver a elegir área
    if (step === 4 && categoria === 'Electivo') {
      setArea('');
      setRamos([]);
      setStep(3);
      return;
    }
    // Caso: Núcleo Gestión (listado integrado en paso 3) -> volver a categorías
    if (step === 3 && categoria === 'Núcleo Gestión') {
      setCategoria('');
      setArea('');
      setRamos([]);
      setStep(2);
      return;
    }
    // Plan Común lista (paso 3) -> volver a prefijos
    if (step === 3 && nivel === 'Plan Común') {
      setRamos([]);
      setStep(2);
      return;
    }
    // Fallback general
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
    // Flujo Especialidad
    if (cat === 'Electivo') {
      setStep(3); // paso 3: elegir área electivo
      return;
    }
    if (cat === 'Núcleo Gestión') {
      // Siempre cargar todos los ramos gestión y mostrar listado + filtros en el mismo paso (3)
      cargarRamosFiltrados({ nivel, categoria: cat });
      setStep(3);
      return;
    }
    // Otros casos: cargar directo y mostrar listado (paso 4)
    cargarRamosFiltrados({ nivel, categoria: cat });
    setStep(4);
  };

  const seleccionarPrefix = (pref: string) => {
    cargarRamosFiltrados({ nivel: 'Plan Común', prefix: pref });
    setStep(3); // En Plan Común paso 3 es lista final
  };

  const seleccionarArea = (a: string) => {
    setArea(a);
    if (categoria === 'Electivo') {
      cargarRamosFiltrados({ nivel, categoria, area: a });
      setStep(4); // Electivo avanza a listado
    } else if (categoria === 'Núcleo Gestión') {
      // Refiltrar dentro del mismo paso (3) sin avanzar de paso
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
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.error || 'Error agregando ramo');
    }
  };

  const renderPaso1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ color: 'white', margin: 0 }}>Elegir Nivel</h3>
      <div style={{ display: 'flex', gap: 12 }}>
        {['Plan Común', 'Especialidad'].map(n => (
          <button key={n} onClick={() => resetDesdeNivel(n)} style={btnPrimary}>{n}</button>
        ))}
      </div>
    </div>
  );

  const renderPaso2PlanComun = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ color: 'white', margin: 0 }}>Prefijo Área (Plan Común)</h3>
      <p style={{ color: '#bbb', margin: 0, fontSize: 13 }}>Selecciona el prefijo para listar ramos del área.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {filters?.planComunPrefijos.map(p => (
          <button key={p} onClick={() => seleccionarPrefix(p)} style={btnSecondary}>{p}</button>
        ))}
      </div>
      <button onClick={retroceder} style={btnGhost}>← Volver</button>
    </div>
  );

  const renderPaso2Especialidad = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ color: 'white', margin: 0 }}>Categoría Especialidad</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(filters?.categoriasPorNivel['Especialidad'] || []).map(c => (
          <button key={c} onClick={() => seleccionarCategoria(c)} style={btnSecondary}>{c}</button>
        ))}
      </div>
      <button onClick={retroceder} style={btnGhost}>← Volver</button>
    </div>
  );

  const renderPaso3Electivo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ color: 'white', margin: 0 }}>Área Electivo</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {filters?.electivoAreas.map(a => (
          <button key={a} onClick={() => seleccionarArea(a)} style={btnSecondary}>{a}</button>
        ))}
      </div>
      <button onClick={retroceder} style={btnGhost}>← Volver</button>
    </div>
  );

  const renderPaso3Gestion = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: 'white', margin: 0 }}>Núcleo Gestión</h3>
        <button onClick={retroceder} style={btnGhost}>← Volver</button>
      </div>
      <p style={{ color: '#bbb', margin: 0, fontSize: 12 }}>Filtra por área o muestra todos. El listado se actualiza al instante.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button
          onClick={() => { setArea(''); cargarRamosFiltrados({ nivel, categoria }); }}
          style={{ ...btnSecondary, backgroundColor: area === '' ? '#4e6269ff' : 'transparent' }}
        >Todos</button>
        {filters?.gestionAreas.map(a => (
          <button
            key={a}
            onClick={() => seleccionarArea(a)}
            style={{ ...btnSecondary, backgroundColor: area === a ? '#4e6269ff' : 'transparent' }}
          >{a}</button>
        ))}
      </div>
      <div>
        <label style={{ color: 'white', fontSize: 13 }}>Estado inicial</label>
        <select
          value={estadoInicial}
          onChange={(e) => setEstadoInicial(e.target.value as EstadoRamo)}
          style={selectStyle}
        >
          {estadoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      {loadingRamos && <p style={{ color: '#999' }}>Cargando ramos...</p>}
      {!loadingRamos && ramos.length === 0 && <p style={{ color: '#999' }}>No se encontraron ramos.</p>}
      <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ramos.map(r => (
          <button
            key={r.id}
            onClick={() => agregarRamo(r.id)}
            style={ramoItem}
            title={`${r.codigo} - Créditos: ${r.creditos}`}
          >
            <strong>{r.codigo}</strong> {r.nombre}
            <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>{r.area || r.categoria || r.nivel}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderListaRamos = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: 'white', margin: 0 }}>Seleccionar Ramo</h3>
        <button onClick={retroceder} style={btnGhost}>← Volver</button>
      </div>
      <div>
        <label style={{ color: 'white', fontSize: 13 }}>Estado inicial</label>
        <select
          value={estadoInicial}
          onChange={(e) => setEstadoInicial(e.target.value as EstadoRamo)}
          style={selectStyle}
        >
          {estadoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      {loadingRamos && <p style={{ color: '#999' }}>Cargando ramos...</p>}
      {!loadingRamos && ramos.length === 0 && <p style={{ color: '#999' }}>No se encontraron ramos.</p>}
      <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ramos.map(r => (
          <button
            key={r.id}
            onClick={() => agregarRamo(r.id)}
            style={ramoItem}
            title={`${r.codigo} - Créditos: ${r.creditos}`}
          >
            <strong>{r.codigo}</strong> {r.nombre}
            <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>{r.area || r.categoria || r.nivel}</span>
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
    <div style={overlay}>
      <div style={modal}>
        {contenido}
        <button onClick={onClose} style={{ ...btnGhost, marginTop: 24 }}>Cerrar</button>
      </div>
    </div>
  );
};

// Styles
const overlay: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modal: React.CSSProperties = {
  backgroundColor: '#2b2b2b', padding: 24, borderRadius: 12, width: 520, maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto'
};
const btnPrimary: React.CSSProperties = {
  padding: '10px 16px', borderRadius: 8, border: 'none', backgroundColor: '#4e6269ff', color: 'white', cursor: 'pointer'
};
const btnSecondary: React.CSSProperties = {
  padding: '8px 14px', borderRadius: 8, border: '1px solid #4e6269ff', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: 14
};
const btnGhost: React.CSSProperties = {
  padding: '8px 14px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', color: '#ccc', cursor: 'pointer', fontSize: 14
};
const selectStyle: React.CSSProperties = {
  width: '100%', padding: '8px', borderRadius: 8, backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #444', marginTop: 4
};
const ramoItem: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white', cursor: 'pointer', textAlign: 'left'
};

export default AgregarRamoWizard;
