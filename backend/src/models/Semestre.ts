import mongoose from 'mongoose';
import { Ramo } from './Ramo'; 

export interface Semestre {
  id: string;
  titulo: string;
  ramos: Ramo[]; // Un semestre tiene un array de Ramos
}


const semestreSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  //'ramos' es un array de IDs que referencian documentos en la colección 'Ramo'
  ramos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ramo' }]
});
const SemestreModel = mongoose.model<Semestre>("Semestre", semestreSchema);

semestreSchema.set("toJSON", {
  transform: (returnedObject: { id?: string, _id?: mongoose.Types.ObjectId, __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default SemestreModel;