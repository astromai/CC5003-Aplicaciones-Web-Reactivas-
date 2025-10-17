import { Request, Response, NextFunction } from 'express';
import Ramo from '../models/Ramo'; // Importamos el modelo de Ramo

// --- Función para obtener TODOS los ramos ---
export const getRamos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ramos = await Ramo.find({});
    res.json(ramos);
  } catch (error) {
    next(error);
  }
};

// --- Función para obtener UN SOLO ramo por su ID ---
export const getRamoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ramo = await Ramo.findById(id);

    if (!ramo) {
      return res.status(404).json({ error: 'Ramo no encontrado' });
    }
    
    res.json(ramo);
  } catch (error) {
    next(error);
  }
};