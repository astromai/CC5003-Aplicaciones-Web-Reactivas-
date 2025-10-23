import express from 'express';


import { getSemestres } from '../controllers/semestreController';

const router = express.Router();

// --- Definición de Rutas para Semestres ---

// Definimos la ruta para obtener todos los semestres
router.get('/', getSemestres);

export default router;