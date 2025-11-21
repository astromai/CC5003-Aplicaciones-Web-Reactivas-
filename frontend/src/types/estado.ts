export type EstadoRamo = 'pendiente' | 'cursando' | 'aprobado' | 'reprobado';

export const ESTADO_ORDER: EstadoRamo[] = ['pendiente', 'cursando', 'aprobado', 'reprobado'];

export function nextEstado(actual: EstadoRamo): EstadoRamo {
  const idx = ESTADO_ORDER.indexOf(actual);
  return ESTADO_ORDER[(idx + 1) % ESTADO_ORDER.length];
}

export const ESTADO_COLOR: Record<EstadoRamo, string> = {
  pendiente: '#393131ff',
  cursando: '#FFD700',
  aprobado: '#4CE48B',
  reprobado: '#FF4444'
};