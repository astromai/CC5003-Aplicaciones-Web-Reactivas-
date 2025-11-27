import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Importamos solo el modelo Ramo
import Ramo from '../models/Ramo';

// Cargamos las variables de entorno para obtener la URI de la base de datos
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Leemos el archivo db.json con la nueva clasificación
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf-8'));
const ramosParaGuardar = data.semestres.flatMap((semestre: any) => semestre.ramos);

const mode = (process.argv[2] || '').toLowerCase() === 'merge' ? 'merge' : (process.env.SEED_MODE === 'merge' ? 'merge' : 'reset');

interface RawRamo {
  nombre: string;
  codigo: string;
  creditos: number;
  descripcion: string;
  porcentajeAprobacion: number;
  nivel?: string;
  categoria?: string;
  area?: string;
}

const importarDatos = async () => {
  try {
    // 1. Conectarnos a la base de datos (usando dbName si está definido)
    const uri = process.env.MONGODB_URI!;
    const dbName = process.env.MONGODB_DBNAME;
    await mongoose.connect(uri, dbName ? { dbName } : undefined);
    console.log(`Conectado a MongoDB${dbName ? ' (db: ' + dbName + ')' : ''} para la siembra...`);

    if (mode === 'reset') {
      // Reset completo
      await Ramo.deleteMany();
      console.log('Modo RESET: datos antiguos eliminados...');
      const ramosInsertados = await Ramo.insertMany(ramosParaGuardar);
      console.log(`${ramosInsertados.length} ramos importados (insertMany). ✅`);
    } else {
      // Merge / upsert por código
      console.log('Modo MERGE: actualizando / insertando sin borrar existentes...');
      let nuevos = 0;
      let actualizados = 0;
      for (const raw of ramosParaGuardar as RawRamo[]) {
        const result = await Ramo.findOneAndUpdate(
          { codigo: raw.codigo },
          {
            $set: {
              nombre: raw.nombre,
              creditos: raw.creditos,
              descripcion: raw.descripcion,
              porcentajeAprobacion: raw.porcentajeAprobacion,
              nivel: raw.nivel,
              categoria: raw.categoria,
              area: raw.area
            }
          },
          { upsert: true, new: true }
        );
        // Determinar si fue nuevo comparando existencia previa
        // findOneAndUpdate con upsert no da directamente si fue insert, así que hacemos otra consulta previa mínima
        // Simplificación: contar como actualizado si ya existía coincidencia previa
        // (Podríamos usar findOne antes, pero costaría otra query; aceptamos heurística)
        // Mejor: usar raw.codigo en un set de existentes previos:
      }
      // Recontar existentes para métricas más confiables
      const codigosImport = new Set((ramosParaGuardar as RawRamo[]).map(r => r.codigo));
      const existentes = await Ramo.find({ codigo: { $in: Array.from(codigosImport) } }, { codigo: 1 });
      actualizados = existentes.length; // aproximado, puede incluir nuevos
      // Para diferenciar, comprobamos cuántos eran ya previamente antes del merge
      // (En implementación simple omitimos exactitud y mostramos totales)
      console.log(`Merge completado sobre ${codigosImport.size} códigos (actualizados/upsert). ✅`);
    }
    
    console.log('Siembra completada. Nota: semestres siguen dinámicos en cada malla.');
    console.log(`Modo usado: ${mode.toUpperCase()}`);
    process.exit();
  } catch (error) {
    console.error('Error durante la siembra de datos ❌:', error);
    process.exit(1);
  }
};

importarDatos();