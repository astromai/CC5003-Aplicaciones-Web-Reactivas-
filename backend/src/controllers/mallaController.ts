import { Request, Response, NextFunction } from 'express';
import Malla from '../models/Malla';
import type { DecodedToken } from '../utils/middleware';

// --- Función para CREAR una nueva Malla ---
export const createMalla = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, numSemestres } = req.body;
    const userId = (req as Request & { user?: DecodedToken }).user?.id;

    if (!nombre || !numSemestres) {
      return res.status(400).json({ error: 'Se requiere nombre y número de semestres' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Crear array de semestres vacíos
    const semestres = Array.from({ length: numSemestres }, (_, i) => ({
      numero: i + 1,
      ramos: []
    }));

    const nuevaMalla = new Malla({
      nombre,
      usuario: userId,
      semestres
    });

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

