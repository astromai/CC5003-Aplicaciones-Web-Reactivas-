import { Request, Response, NextFunction } from 'express';
import Ramo from '../models/Ramo'; // Importamos el modelo de Ramo

// --- Función para OBTENER TODOS los ramos ---
export const getRamos = async (req: Request, res: Response, next: NextFunction) => {

  // Intentamos obtener todos los ramos
  try {

    // Obtenemos todos los ramos de la base de datos
    const ramos = await Ramo.find({});
    res.json(ramos);

  // Si algo sale mal, lo pasamos al manejador de errores.
  } catch (error) {
    next(error);
  }
};

// --- Función para OBTENER UN SOLO ramo por su ID ---
export const getRamoById = async (req: Request, res: Response, next: NextFunction) => {

  // Intentamos obtener un ramo por su ID.
  try {
    
    // Obtenemos el ID del ramo desde la URL.
    const { id } = req.params;

    // Buscamos el ramo en la base de datos.
    const ramo = await Ramo.findById(id);

    // Si no se encuentra, retornamos un error 404.
    if (!ramo) {
      return res.status(404).json({ error: 'Ramo no encontrado' });
    }

    // Si se encuentra, la enviamos al frontend.
    res.json(ramo);
    
  // Si algo sale mal, lo pasamos al manejador de errores.
  } catch (error) {
    next(error);
  }
};