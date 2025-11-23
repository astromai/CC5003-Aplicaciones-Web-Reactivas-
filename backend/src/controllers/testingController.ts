import { Request, Response, NextFunction } from 'express';
import MallaModel from "../models/Malla";
import RamoModel from "../models/Ramo";
import User from "../models/User";

export const reset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.deleteMany({});

    res.status(204).end();
  } catch (error) {
    console.error("Error al reiniciar la BD de testing:", error);
    res.status(500).json({ error: "Error al reiniciar la base de datos" });
  };
};