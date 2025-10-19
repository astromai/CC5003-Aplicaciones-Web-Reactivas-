import express from 'express';

import { login, register, logout, me } from '../controllers/userController';

const router = express.Router();

// Definimos la ruta para obtener todos los semestres
router.post('/login', login);

router.post('/register', register)

router.post('/logout', logout)

router.post('/me', me)

export default router;