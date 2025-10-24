import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Importamos los modelos para que Mongoose sepa cómo guardar los datos
import Ramo from '../src/models/Ramo';
import Semestre from '../src/models/Semestre';

// Cargamos las variables de entorno para obtener la URI de la base de datos
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Leemos el archivo db.json
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf-8'));
const ramosParaGuardar = data.semestres.flatMap((semestre: any) => semestre.ramos);

const importarDatos = async () => {
  try {
    // 1. Conectarnos a la base de datos
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Conectado a la base de datos para la siembra...');

    // 2. Limpiar la base de datos para evitar duplicados
    await Ramo.deleteMany();
    await Semestre.deleteMany();
    console.log('Datos antiguos eliminados...');

    // 3. Insertar todos los ramos en la colección 'Ramo'
    const ramosInsertados = await Ramo.insertMany(ramosParaGuardar);
    console.log(`${ramosInsertados.length} ramos han sido importados! ✅`);

    // 4. Crear los semestres con las referencias a los ramos recién creados
    for (const sem of data.semestres) {
      const idsDeRamos = sem.ramos.map((ramo: any) => {
        const ramoEncontrado = ramosInsertados.find(r => r.codigo === ramo.codigo);
        return ramoEncontrado?._id;
      }).filter(Boolean); // Filtramos por si alguno no se encontró

      await Semestre.create({
        titulo: sem.titulo,
        ramos: idsDeRamos
      });
    }
    console.log(`${data.semestres.length} semestres han sido importados! ✅`);
    
    console.log('¡Siembra de datos completada con éxito!');
    process.exit();
  } catch (error) {
    console.error('Error durante la siembra de datos ❌:', error);
    process.exit(1);
  }
};

importarDatos();