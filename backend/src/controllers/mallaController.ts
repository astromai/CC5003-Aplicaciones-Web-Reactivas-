import { Request, Response, NextFunction } from 'express';

import Malla from '../models/Malla';

// --- Función para crear una nueva Malla ---
export const createMalla = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre de la malla es requerido' });
    }

    // Creamos una nueva instancia del modelo Malla.
    const nuevaMalla = new Malla({
      nombre: nombre,
      semestres: [] // La malla se crea vacía
    });

    // Guardamos la nueva malla en la base de datos.
    await nuevaMalla.save();

    // Enviamos la malla recién creada de vuelta al frontend.
    res.status(201).json(nuevaMalla);

  } catch (error) {
    // Si algo sale mal, lo pasamos al manejador de errores.
    next(error);
  }
};

// --- Función para AÑADIR UN RAMO a un Semestre de una Malla ---
export const addRamoToSemestre = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtenemos los IDs y datos de la URL y el body
    const { mallaId } = req.params; // El ID de la malla que queremos modificar
    const { tituloSemestre, ramoId, estado } = req.body; // Los datos del ramo a añadir

    // Verificamos que tengamos toda la información necesaria
    if (!tituloSemestre || !ramoId || !estado) {
      return res.status(400).json({ error: 'Faltan datos: se requiere tituloSemestre, ramoId y estado' });
    }

    // Buscamos la malla en la base de datos
    const malla = await Malla.findById(mallaId);
    if (!malla) {
      return res.status(404).json({ error: 'Malla no encontrada' });
    }

    // Buscamos si el semestre ya existe en la malla
    let semestre = malla.semestres.find(s => s.titulo === tituloSemestre);

    // Si el semestre NO existe, lo creamos
    if (!semestre) {
      malla.semestres.push({ titulo: tituloSemestre, ramos: [] });
      semestre = malla.semestres[malla.semestres.length - 1]; // Lo asignamos a nuestra variable
    }

    // Añadimos el nuevo ramo y su estado al semestre
    semestre.ramos.push({ ramo: ramoId, estado: estado });

    // Guardamos la malla actualizada en la base de datos
    const mallaActualizada = await malla.save();

    //  Enviamos la malla completa y actualizada de vuelta
    res.status(200).json(mallaActualizada);

  } catch (error) {
    next(error);
  }
};

// --- Función para OBTENER UNA MALLA por su ID ---
export const getMallaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtenemos el ID de la malla desde la URL
    const { mallaId } = req.params;

    // Buscamos la malla en la base de datos
    const malla = await Malla.findById(mallaId).populate({
      path: 'semestres.ramos.ramo', // La ruta anidada que queremos poblar
      model: 'Ramo'               // El modelo que debe usar para poblar
    });

    //Si no se encuentra, enviamos un error 404
    if (!malla) {
      return res.status(404).json({ error: 'Malla no encontrada' });
    }

    // Si se encuentra, la enviamos al frontend
    res.status(200).json(malla);

  } catch (error) {
    next(error);
  }
};

