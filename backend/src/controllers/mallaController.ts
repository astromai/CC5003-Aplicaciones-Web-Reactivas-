import { Request, Response, NextFunction } from 'express';

import Malla from '../models/Malla';

// --- Función para CREAR una nueva Malla ---
export const createMalla = async (req: Request, res: Response, next: NextFunction) => {

  // Intentamos crear una nueva malla
  try {

    // Obtenemos el nombre de la malla desde el body
    const { nombre } = req.body;

    // Verificamos que tengamos el nombre de la malla, y retornamos un error si no lo tenemos.
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre de la malla es requerido' });
    }

    // Creamos una nueva instancia del modelo Malla, con el nombre y semestres vacíos.
    const nuevaMalla = new Malla({
      nombre: nombre,
      semestres: [] 
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

// --- Función para AÑADIR un ramo a un semestre de una malla ---
export const addRamoToSemestre = async (req: Request, res: Response, next: NextFunction) => {

  // Intentamos añadir un ramo a un semestre de una malla
  try {

    // Obtenemos los IDs y datos de la URL y el body
    const { mallaId } = req.params; // El ID de la malla que queremos modificar
    const { tituloSemestre, ramoId, estado } = req.body; // Los datos del ramo a añadir

    // Verificamos que tengamos toda la información necesaria, y retornamos un error si no la tenemos.
    if (!tituloSemestre || !ramoId || !estado) {
      return res.status(400).json({ error: 'Faltan datos: se requiere tituloSemestre, ramoId y estado' });
    }

    // Buscamos la malla en la base de datos.
    const malla = await Malla.findById(mallaId);

    // Si no se encuentra, retornamos un error 404.
    if (!malla) {
      return res.status(404).json({ error: 'Malla no encontrada' });
    }

    // Buscamos si el semestre ya existe en la malla.
    let semestre = malla.semestres.find(s => s.titulo === tituloSemestre);

    // Si el semestre NO existe, lo creamos.
    if (!semestre) {

      // Creamos el semestre y lo agregamos a la malla.
      malla.semestres.push({ titulo: tituloSemestre, ramos: [] });

      // Obtenemos el semestre recién creado.
      semestre = malla.semestres[malla.semestres.length - 1]; // Lo asignamos a nuestra variable.
    }

    // Añadimos el nuevo ramo y su estado al semestre.
    semestre.ramos.push({ ramo: ramoId, estado: estado });

    // Guardamos la malla actualizada en la base de datos.
    const mallaActualizada = await malla.save();

    // Enviamos la malla completa y actualizada de vuelta.
    res.status(200).json(mallaActualizada);

  // Si algo sale mal, lo pasamos al manejador de errores.
  } catch (error) {
    next(error);
  }
};

// --- Función para OBTENER una malla por su ID ---
export const getMallaById = async (req: Request, res: Response, next: NextFunction) => {
  // Intentamos obtener una malla por su ID
  try {
    // Obtenemos el ID de la malla desde la URL
    const { mallaId } = req.params;

    // Buscamos la malla en la base de datos
    const malla = await Malla.findById(mallaId).populate({
      path: 'semestres.ramos.ramo', // La ruta anidada que queremos poblar
      model: 'Ramo'                // El modelo que debe usar para poblar
    });

    // Si no se encuentra, enviamos un error 404.
    if (!malla) {
      return res.status(404).json({ error: 'Malla no encontrada' });
    }

    // Si se encuentra, la enviamos al frontend.
    res.status(200).json(malla);

  // Si algo sale mal, lo pasamos al manejador de errores.
  } catch (error) {
    next(error);
  }
};

// --- Función para obtener la malla por defecto ---
export const getDefaultMalla = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Buscamos la primera malla que exista en la base de datos
    const defaultMalla = await Malla.findOne()
      .populate({
        path: 'semestres.ramos.ramo',
        model: 'Ramo'
      })
      .exec();

    if (!defaultMalla) {
      return res.status(404).json({ error: 'No hay malla por defecto disponible' });
    }

    res.status(200).json(defaultMalla);
  } catch (error) {
    next(error);
  }
};

