import { Request, Response, NextFunction } from 'express';
import Malla from '../models/Malla';
import Ramo from '../models/Ramo';
import fs from 'fs';
import path from 'path';
import type { DecodedToken } from '../utils/middleware';

// --- Función para CREAR una nueva Malla ---
export const createMalla = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, numSemestres, usarBase } = req.body;
    const userId = (req as Request & { user?: DecodedToken }).user?.id;

    if (!nombre || !numSemestres) {
      return res.status(400).json({ error: 'Se requiere nombre y número de semestres' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    let semestres: { numero: number; ramos: { ramo: any; estado: string }[] }[] = [];
    let cantidadSemestres = numSemestres;

    if (usarBase) {
      try {
        const plantillaPath = path.resolve(__dirname, '../../Scripts/db.json');
        const raw = fs.readFileSync(plantillaPath, 'utf-8');
        const data = JSON.parse(raw);
        const semestresPlantilla = data.semestres || [];
        // Filtrar solo semestres reales (titulo "Semestre N"), ignorando bloques como "Electivos Disponibles"
        const semestresValidos = semestresPlantilla.filter((s: any) => {
          const t = s.titulo;
          return typeof t === 'string' && /^Semestre\s+\d+$/i.test(t);
        }).slice(0, 11); // Asegurar máximo 11 semestres
        cantidadSemestres = semestresValidos.length;
        // Mapear códigos a IDs de ramos ya cargados en la colección
        const todosRamos = await Ramo.find();
        const mapaPorCodigo = new Map<string, any>();
        todosRamos.forEach(r => mapaPorCodigo.set(r.codigo, r._id));

        // Construir semestres directamente desde plantilla
        semestres = semestresValidos.map((plantillaSem: any, index: number) => {
          const ramosConvertidos = (plantillaSem.ramos || [])
            .map((r: any) => ({ codigo: r.codigo }))
            .map((r: { codigo: string }) => mapaPorCodigo.get(r.codigo))
            .filter((id: any) => !!id)
            .map((id: any) => ({ ramo: id, estado: 'pendiente' }));
          return { numero: index + 1, ramos: ramosConvertidos };
        });
      } catch (e) {
        console.error('Error cargando plantilla base:', e);
        // Si falla, revertir a semestres vacíos con numSemestres original
        cantidadSemestres = numSemestres;
        semestres = Array.from({ length: cantidadSemestres }, (_, i) => ({ numero: i + 1, ramos: [] }));
      }
    } else {
      // Semestres vacíos sin plantilla
      semestres = Array.from({ length: cantidadSemestres }, (_, i) => ({ numero: i + 1, ramos: [] }));
    }

    const nuevaMalla = new Malla({ nombre, usuario: userId, semestres });

    await nuevaMalla.save();
    res.status(201).json(nuevaMalla);

  } catch (error) {
    next(error);
  }
};

// --- Función para LISTAR mallas del usuario ---
export const getMallasUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as Request & { user?: DecodedToken }).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const mallas = await Malla.find({ usuario: userId });
    res.json(mallas);

  } catch (error) {
    next(error);
  }
};

// --- Función para AÑADIR un ramo a un semestre de una malla ---
export const addRamoToSemestre = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mallaId, numero } = req.params;
    const { ramoId, estado } = req.body;
    const userId = (req as Request & { user?: DecodedToken }).user?.id;

    if (!ramoId || !estado) {
      return res.status(400).json({ error: 'Se requiere ramoId y estado' });
    }

    const malla = await Malla.findOne({ _id: mallaId, usuario: userId });

    if (!malla) {
      return res.status(404).json({ error: 'Malla no encontrada' });
    }

    const semestreNum = parseInt(numero);
    const semestre = malla.semestres.find(s => s.numero === semestreNum);

    if (!semestre) {
      return res.status(404).json({ error: 'Semestre no encontrado' });
    }

    // Verificar si el ramo ya existe en este semestre
    const ramoExistente = semestre.ramos.find(r => r.ramo.toString() === ramoId);
    if (ramoExistente) {
      return res.status(400).json({ error: 'El ramo ya existe en este semestre' });
    }

    semestre.ramos.push({ ramo: ramoId, estado });
    await malla.save();

    // Poblar ramos para devolverlos completos
    const mallaPopulated = await Malla.findById(mallaId).populate({
      path: 'semestres.ramos.ramo',
      model: 'Ramo'
    });

    res.status(200).json(mallaPopulated);

  } catch (error) {
    next(error);
  }
};

// --- Función para OBTENER una malla por su ID ---
export const getMallaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mallaId } = req.params;
    const userId = (req as Request & { user?: DecodedToken }).user?.id;

    const malla = await Malla.findOne({ _id: mallaId, usuario: userId }).populate({
      path: 'semestres.ramos.ramo',
      model: 'Ramo'
    });

    if (!malla) {
      return res.status(404).json({ error: 'Malla no encontrada' });
    }

    res.status(200).json(malla);

  } catch (error) {
    next(error);
  }
};

// --- Función para ACTUALIZAR estado de un ramo ---
export const updateEstadoRamo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mallaId, ramoId } = req.params;
    const { estado } = req.body;
    const userId = (req as Request & { user?: DecodedToken }).user?.id;

    if (!estado) {
      return res.status(400).json({ error: 'Se requiere el estado' });
    }

    const malla = await Malla.findOne({ _id: mallaId, usuario: userId });

    if (!malla) {
      return res.status(404).json({ error: 'Malla no encontrada' });
    }

    // Buscar el ramo en todos los semestres
    let ramoEncontrado = false;
    for (const semestre of malla.semestres) {
      const ramo = semestre.ramos.find(r => r.ramo.toString() === ramoId);
      if (ramo) {
        ramo.estado = estado;
        ramoEncontrado = true;
        break;
      }
    }

    if (!ramoEncontrado) {
      return res.status(404).json({ error: 'Ramo no encontrado en la malla' });
    }

    await malla.save();

    const mallaPopulated = await Malla.findById(mallaId).populate({
      path: 'semestres.ramos.ramo',
      model: 'Ramo'
    });

    res.status(200).json(mallaPopulated);

  } catch (error) {
    next(error);
  }
};

// --- Función para ELIMINAR una malla ---
export const deleteMalla = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mallaId } = req.params;
    const userId = (req as Request & { user?: DecodedToken }).user?.id;

    const malla = await Malla.findOneAndDelete({ _id: mallaId, usuario: userId });

    if (!malla) {
      return res.status(404).json({ error: 'Malla no encontrada' });
    }

    res.status(200).json({ message: 'Malla eliminada correctamente' });

  } catch (error) {
    next(error);
  }
};

// --- Función para ELIMINAR un ramo específico de un semestre ---
export const removeRamoFromSemestre = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mallaId, numero, ramoId } = req.params;
    const userId = (req as Request & { user?: DecodedToken }).user?.id;

    const semestreNum = parseInt(numero);

    const malla = await Malla.findOne({ _id: mallaId, usuario: userId });
    if (!malla) {
      return res.status(404).json({ error: 'Malla no encontrada' });
    }

    const semestre = malla.semestres.find(s => s.numero === semestreNum);
    if (!semestre) {
      return res.status(404).json({ error: 'Semestre no encontrado' });
    }

    const index = semestre.ramos.findIndex(r => r.ramo.toString() === ramoId);
    if (index === -1) {
      return res.status(404).json({ error: 'Ramo no encontrado en el semestre' });
    }

    semestre.ramos.splice(index, 1);
    await malla.save();

    const mallaPopulated = await Malla.findById(mallaId).populate({
      path: 'semestres.ramos.ramo',
      model: 'Ramo'
    });

    res.status(200).json(mallaPopulated);
  } catch (error) {
    next(error);
  }
};

