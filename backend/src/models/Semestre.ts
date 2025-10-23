import mongoose from 'mongoose';
import { Ramo } from './Ramo'; 

// --- INTERFAZ DE SEMESTRE ---
export interface Semestre {
  id: string;
  titulo: string;
  ramos: Ramo[]; // Un semestre tiene un array de Ramos
}

// --- SCHEMA DE SEMESTRE ---
const semestreSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  //'ramos' es un array de IDs que referencian documentos en la colección 'Ramo'
  ramos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ramo' }]
});

// --- MODELO DE SEMESTRE ---
const SemestreModel = mongoose.model<Semestre>("Semestre", semestreSchema);

// --- CONFIGURACIÓN DEL SCHEMA ---
semestreSchema.set("toJSON", {
  transform: (returnedObject: { id?: string, _id?: mongoose.Types.ObjectId, __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default SemestreModel;