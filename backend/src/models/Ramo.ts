import mongoose from 'mongoose';

// --- INTERFAZ DE RAMO ---
export interface Ramo {
  id: string;
  nombre: string;
  codigo: string;
  creditos: number;
  descripcion: string;
  porcentajeAprobacion: number;
}

// --- SCHEMA DE RAMO ---
const ramoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  creditos: { type: Number, required: true },
  descripcion: { type: String, required: true },
  porcentajeAprobacion: { type: Number, required: true }
});

// --- MODELO DE RAMO ---
const RamoModel= mongoose.model<Ramo>("Ramo", ramoSchema);

// --- CONFIGURACIÓN DEL SCHEMA ---
ramoSchema.set("toJSON", {
  transform: (returnedObject: { id?: string, _id?: mongoose.Types.ObjectId, __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default RamoModel;