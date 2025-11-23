import express from 'express';
import { withUser } from '../utils/middleware';
import { login, register, logout, me } from '../controllers/userController';

const router = express.Router();

// --- Definición de Rutas para Usuarios ---
router.post('/login', login);
router.post('/register', register)
router.post('/logout', logout)
router.get("/me", withUser, me);

export default router;