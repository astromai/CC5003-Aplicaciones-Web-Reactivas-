import express from 'express';


import { getSemestres } from '../controllers/semestreController';

const router = express.Router();

// Definimos la ruta para obtener todos los semestres
router.get('/', getSemestres);

export default router;