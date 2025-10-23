import express from 'express';
import { withUser } from '../utils/middleware'; 
import { createMalla, addRamoToSemestre, getMallaById } from '../controllers/mallaController';

const router = express.Router();

// --- Definición de Rutas para Mallas ---
router.post('/', withUser, createMalla); 
router.post('/:mallaId/ramos', withUser, addRamoToSemestre);
router.get('/:mallaId', withUser, getMallaById);

export default router;