import { Request, Response, NextFunction } from 'express';
import Semestre from '../models/Semestre';

// --- Función para obtener TODOS los semestres ---
export const getSemestres = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const semestres = await Semestre.find({}).populate('ramos');
    res.json(semestres);
  } catch (error) {
    next(error);
  }
};