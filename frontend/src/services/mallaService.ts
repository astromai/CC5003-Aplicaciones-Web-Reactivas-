import axiosSecure from '../utils/axiosSecure';
import type { Malla, SemestreEnMalla, RamoBase, EstadoRamo } from '../types';

// Tipo para manejar el que viene del backend (MongoDB) en el frontend
type BackendMalla = {
  _id?: string;
  id?: string;
  nombre: string;
  semestres: Array<{
    numero: number;
    ramos: Array<{
      ramo: {
        _id: string;
        nombre: string;
        codigo: string;
        creditos: number;
      };
      estado: string;
    }>;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

// Conversión entre estados frontend (Capitalizado) y backend (minúsculas)
function estadoToBackend(e: EstadoRamo): string {
  return e.toLowerCase();
}
function estadoFromBackend(raw: string): EstadoRamo {
  switch (raw) {
    case 'pendiente': return 'Pendiente';
    case 'cursando': return 'Cursando';
    case 'aprobado': return 'Aprobado';
    case 'reprobado': return 'Reprobado';
    default:
      // Fallback por si llega un valor inesperado; mantenemos tipo consistente
      return 'Pendiente';
  }
}

// Transformar respuesta del backend a tipos frontend
export function transformBackendMalla(backend: BackendMalla): Malla {
  return {
    id: backend.id || backend._id || '',
    nombre: backend.nombre,
    semestres: backend.semestres.map((sem): SemestreEnMalla => ({
      numero: sem.numero,
      ramos: (sem.ramos || []).map((r): RamoBase => ({
        id: String(r.ramo._id),
        nombre: r.ramo.nombre,
        codigo: r.ramo.codigo,
        creditos: r.ramo.creditos,
        // Convertimos estado del backend (minúsculas) al formato capitalizado del frontend
        estado: r.estado ? estadoFromBackend(r.estado) : undefined
      }))
    })),
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt
  };
}

// Crear nueva malla
export async function crearMalla(nombre: string, numSemestres: number, usarBase?: boolean): Promise<Malla> {
  const response = await axiosSecure.post('/api/mallas', { nombre, numSemestres, usarBase });
  return transformBackendMalla(response.data);
}

// Listar mallas del usuario
export async function getMallasUsuario(): Promise<Malla[]> {
  const response = await axiosSecure.get('/api/mallas');
  return response.data.map(transformBackendMalla);
}

// Obtener una malla específica con ramos poblados
export async function getMallaById(mallaId: string): Promise<Malla> {
  const response = await axiosSecure.get(`/api/mallas/${mallaId}`);
  return transformBackendMalla(response.data);
}

// Eliminar una malla
export async function deleteMalla(mallaId: string): Promise<void> {
  await axiosSecure.delete(`/api/mallas/${mallaId}`);
}

// Agregar ramo a un semestre
export async function agregarRamoASemestre(
  mallaId: string,
  numeroSemestre: number,
  ramoId: string,
  estado: EstadoRamo
): Promise<Malla> {
  // Enviamos estado en minúsculas para cumplir con enum del backend
  const response = await axiosSecure.post(
    `/api/mallas/${mallaId}/semestres/${numeroSemestre}/ramos`,
    { ramoId, estado: estadoToBackend(estado) }
  );
  return transformBackendMalla(response.data);
}

// Actualizar estado de un ramo
export async function actualizarEstadoRamo(
  mallaId: string,
  ramoId: string,
  estado: EstadoRamo
): Promise<Malla> {
  const response = await axiosSecure.patch(
    `/api/mallas/${mallaId}/ramos/${ramoId}`,
    { estado: estadoToBackend(estado) }
  );
  return transformBackendMalla(response.data);
}

// Eliminar ramo de un semestre específico
export async function eliminarRamoDeSemestre(
  mallaId: string,
  numeroSemestre: number,
  ramoId: string
): Promise<Malla> {
  const response = await axiosSecure.delete(
    `/api/mallas/${mallaId}/semestres/${numeroSemestre}/ramos/${ramoId}`
  );
  return transformBackendMalla(response.data);
}