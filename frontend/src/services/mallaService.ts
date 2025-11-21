import axiosSecure from '../utils/axiosSecure';
import type { Malla, SemestreEnMalla, RamoBase, EstadoRamo } from '../types';

// Transformar respuesta del backend a tipos frontend
export function transformBackendMalla(backend: any): Malla {
  return {
    id: backend.id || backend._id,
    nombre: backend.nombre,
    semestres: backend.semestres.map((sem: any): SemestreEnMalla => ({
      numero: sem.numero,
      ramos: (sem.ramos || []).map((r: any): RamoBase => ({
        id: String(r.ramo._id || r.ramo),
        nombre: r.ramo.nombre,
        codigo: r.ramo.codigo,
        creditos: r.ramo.creditos,
        estado: r.estado
      }))
    })),
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt
  };
}

// Crear nueva malla
export async function crearMalla(nombre: string, numSemestres: number): Promise<Malla> {
  const response = await axiosSecure.post('/api/mallas', { nombre, numSemestres });
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
  const response = await axiosSecure.post(
    `/api/mallas/${mallaId}/semestres/${numeroSemestre}/ramos`,
    { ramoId, estado }
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
    { estado }
  );
  return transformBackendMalla(response.data);
}