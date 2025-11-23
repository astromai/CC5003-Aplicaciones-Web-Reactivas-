import express from 'express';

// Importamos las funciones del controlador de ramos que creamos
import { getRamos, getRamoById, getRamoFilters } from '../controllers/ramoController';

const router = express.Router();

// --- Definición de Rutas para Ramos ---
router.get('/', getRamos);
router.get('/filters', getRamoFilters);
router.get('/:id', getRamoById);

export default router;