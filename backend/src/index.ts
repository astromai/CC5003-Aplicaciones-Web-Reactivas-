import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import config from "./utils/config";
import ramoRoutes from './routes/ramos';
import mallaRoutes from './routes/malla'; 
import userRoutes from './routes/user';
import testRoutes from './routes/test';

// --- Conexión a la Base de Datos ---
console.log("Conectando a MongoDB...");
mongoose.connect(config.MONGODB_URI!, {
  dbName: config.MONGODB_DBNAME
})
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((error) => {
    console.error("Error de conexión a MongoDB:", error.message);
    process.exit(1);
  });

const app = express();

// --- Middlewares ---
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['X-CSRF-Token']
  }));
}
app.use(express.json());

app.use(cookieParser());

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
app.use("/api/ramos", ramoRoutes);
app.use("/api/mallas", mallaRoutes); 
app.use("/api/user", userRoutes);
app.use("/api/testing", testRoutes);

// Prod
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // Fallback para SPA - todas las rutas no-API sirven index.html
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

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

// --- Iniciar Servidor ---
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`¡Servidor URamos corriendo en http://localhost:${PORT}! `);
});