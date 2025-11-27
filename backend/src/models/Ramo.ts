import mongoose from 'mongoose';

// --- INTERFAZ DE RAMO ---
export interface Ramo {
  id: string;
  nombre: string;
  codigo: string;
  creditos: number;
  descripcion: string;
  porcentajeAprobacion: number;
  nivel?: 'Plan Común' | 'Especialidad';
  categoria?: string; // Ej: Ciencias Básicas, Obligatorio, Electivo, Práctica, Núcleo Gestión, Título, Formación Integral
  area?: string;      // Ej: Matemáticas, Física, Desarrollo Web, IA, etc.
}

// --- SCHEMA DE RAMO ---
const ramoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  creditos: { type: Number, required: true },
  descripcion: { type: String, required: true },
  porcentajeAprobacion: { type: Number, required: true },
  nivel: { type: String, enum: ['Plan Común', 'Especialidad'], index: true },
  categoria: { type: String, index: true },
  area: { type: String, index: true }
});

// Índices compuestos para búsquedas frecuentes (opcional)
ramoSchema.index({ nivel: 1, categoria: 1 });
ramoSchema.index({ categoria: 1, area: 1 });

// --- MODELO DE RAMO ---
const RamoModel= mongoose.model<Ramo>("Ramo", ramoSchema, "seba_ramos");

// --- CONFIGURACIÓN DEL SCHEMA ---
ramoSchema.set("toJSON", {
  transform: (returnedObject: { id?: string, _id?: mongoose.Types.ObjectId, __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default RamoModel;