import mongoose from 'mongoose';

export interface Ramo {
  id: string;
  nombre: string;
  codigo: string;
  creditos: number;
  descripcion: string;
  porcentajeAprobacion: number;
}

const ramoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  creditos: { type: Number, required: true },
  descripcion: { type: String, required: true },
  porcentajeAprobacion: { type: Number, required: true }
});
const RamoModel= mongoose.model<Ramo>("Ramo", ramoSchema);
ramoSchema.set("toJSON", {
  transform: (returnedObject: { id?: string, _id?: mongoose.Types.ObjectId, __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default RamoModel;