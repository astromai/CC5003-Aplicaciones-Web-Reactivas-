import express from 'express';

// Importamos las funciones del controlador de ramos que creamos
import { getRamos, getRamoById, getRamoFilters } from '../controllers/ramoController';

const router = express.Router();

// --- Definición de Rutas para Ramos ---
//
// Se obtienen todos los ramos cuando alguien visita la URL /api/ramos
router.get('/', getRamos);
router.get('/filters', getRamoFilters);

// Se obtiene un ramo específico cuando alguien visita la URL /api/ramos/:id
router.get('/:id', getRamoById);

export default router;