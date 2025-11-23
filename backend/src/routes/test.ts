import express from 'express';
import { reset } from '../controllers/testingController';

const router = express.Router();

// --- Definición de Rutas para Test ---
router.post('/reset', reset);


export default router;