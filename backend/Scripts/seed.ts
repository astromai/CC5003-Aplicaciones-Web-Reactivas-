import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Importamos solo el modelo Ramo
import Ramo from '../src/models/Ramo';

// Cargamos las variables de entorno para obtener la URI de la base de datos
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Leemos el archivo db.json
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf-8'));
const ramosParaGuardar = data.semestres.flatMap((semestre: any) => semestre.ramos);

const importarDatos = async () => {
  try {
    // 1. Conectarnos a la base de datos (usando dbName si está definido)
    const uri = process.env.MONGODB_URI!;
    const dbName = process.env.MONGODB_DBNAME;
    await mongoose.connect(uri, dbName ? { dbName } : undefined);
    console.log(`Conectado a MongoDB${dbName ? ' (db: ' + dbName + ')' : ''} para la siembra...`);

    // 2. Limpiar la base de datos para evitar duplicados
    await Ramo.deleteMany();
    console.log('Datos antiguos eliminados...');

    // 3. Insertar todos los ramos en la colección 'Ramo'
    const ramosInsertados = await Ramo.insertMany(ramosParaGuardar);
    console.log(`${ramosInsertados.length} ramos han sido importados! ✅`);
    
    console.log('¡Siembra de datos completada con éxito!');
    console.log('Nota: Los semestres ahora se crean dinámicamente en cada malla del usuario.');
    process.exit();
  } catch (error) {
    console.error('Error durante la siembra de datos ❌:', error);
    process.exit(1);
  }
};

importarDatos();