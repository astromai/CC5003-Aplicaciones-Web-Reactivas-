export type EstadoRamo = 'Pendiente' | 'Cursando' | 'Aprobado' | 'Reprobado';

export const ESTADO_ORDER: EstadoRamo[] = ['Pendiente', 'Cursando', 'Aprobado', 'Reprobado'];

export function nextEstado(actual: EstadoRamo): EstadoRamo {
  const idx = ESTADO_ORDER.indexOf(actual);
  return ESTADO_ORDER[(idx + 1) % ESTADO_ORDER.length];
}

export const ESTADO_COLOR: Record<EstadoRamo, string> = {
  Pendiente: '#393131ff',
  Cursando: '#FFD700',
  Aprobado: '#4CE48B',
  Reprobado: '#FF4444'
};