import express from 'express';

// Importamos las funciones del controlador de ramos que creamos
import { getRamos, getRamoById } from '../controllers/ramoController';

const router = express.Router();

// --- Definición de Rutas para Ramos ---
//
// Se obtienen todos los ramos cuando alguien visita la URL /api/ramos
router.get('/', getRamos);

// Se obtiene un ramo específico cuando alguien visita la URL /api/ramos/:id
router.get('/:id', getRamoById);

export default router;