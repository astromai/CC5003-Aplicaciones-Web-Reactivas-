import express from 'express';
import { withUser } from '../utils/middleware';
import { login, register, logout, me } from '../controllers/userController';

const router = express.Router();

// --- Definición de Rutas para Usuarios ---

// Definimos la ruta para login
router.post('/login', login);

// Definimos la ruta para register
router.post('/register', register)

// Definimos la ruta para logout
router.post('/logout', logout)

// Definimos la ruta para me
router.get("/me", withUser, me);

export default router;