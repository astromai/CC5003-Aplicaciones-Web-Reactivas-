import { Request, Response, NextFunction } from 'express';
import Semestre from '../models/Semestre';

// --- Función para OBTENER TODOS los semestres ---
export const getSemestres = async (req: Request, res: Response, next: NextFunction) => {

  // Intentamos obtener todos los semestres.
  try {
    
    // Obtenemos todos los semestres de la base de datos.
    const semestres = await Semestre.find({}).populate('ramos');
    res.json(semestres);

  // Si algo sale mal, lo pasamos al manejador de errores.
  } catch (error) {
    next(error);
  }
};