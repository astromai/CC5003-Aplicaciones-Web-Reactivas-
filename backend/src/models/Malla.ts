import mongoose from 'mongoose';

// --- SCHEMA DE RAMO CURSADO ---
const ramoCursadoSchema = new mongoose.Schema({
  ramo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ramo', 
    required: true 
  },
  estado: { 
    type: String, 
    enum: ['aprobado', 'cursando', 'reprobado', 'pendiente'],
    required: true 
  }
});

// --- SCHEMA DE SEMESTRE EN LA MALLA ---
const semestreEnMallaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  ramos: [ramoCursadoSchema] 
});


// --- EL SCHEMA PRINCIPAL DE LA MALLA ---
const mallaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, default: 'Mi Malla' },
  semestres: [semestreEnMallaSchema]
});

// --- EL MODELO DE LA MALLA ---
const MallaModel = mongoose.model("Malla", mallaSchema);
mallaSchema.set("toJSON", {
  transform: (returnedObject: { id?: string, _id?: mongoose.Types.ObjectId, __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default MallaModel;