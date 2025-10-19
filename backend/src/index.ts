import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import config from "./utils/config";
import semestreRoutes from './routes/semestres';
import ramoRoutes from './routes/ramos';
import mallaRoutes from './routes/malla'; 
import userRoutes from './routes/user'

// --- Conexión a la Base de Datos ---
console.log("Conectando a MongoDB...");
mongoose.connect(config.MONGODB_URI!)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((error) => {
    console.error("Error de conexión a MongoDB:", error.message);
    process.exit(1);
  });

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

// --- Rutas de la API ---
app.use("/api/semestres", semestreRoutes);
app.use("/api/ramos", ramoRoutes);
app.use("/api/mallas", mallaRoutes); 
app.use("/api/user", userRoutes);

// --- Manejador de Errores ---
const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error('Error:', error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "El ID tiene un formato incorrecto" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  response.status(500).json({ error: "Oops! Algo salió mal en el servidor" });
};
app.use(errorHandler);

// -- Tipado personalizado para Express Request ---
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// --- Iniciar Servidor ---
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`¡Servidor URamos corriendo en http://localhost:${PORT}! `);
});