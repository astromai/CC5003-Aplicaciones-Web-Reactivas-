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
    required: true,
    default: 'pendiente'
  }
}, { _id: false });

// --- SCHEMA DE SEMESTRE EN LA MALLA ---
const semestreEnMallaSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  ramos: [ramoCursadoSchema] 
}, { _id: false });


// --- EL SCHEMA PRINCIPAL DE LA MALLA ---
const mallaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semestres: [semestreEnMallaSchema]
}, { timestamps: true });

// Índice para búsquedas rápidas por usuario
mallaSchema.index({ usuario: 1 });

// --- CONFIGURACIÓN DEL SCHEMA ---
mallaSchema.set("toJSON", {
  transform: (returnedObject: { id?: string, _id?: mongoose.Types.ObjectId, __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// --- EL MODELO DE LA MALLA ---
const MallaModel = mongoose.model("Malla", mallaSchema);

export default MallaModel;