import express from 'express';
import { withUser } from '../utils/middleware'; 
import { 
  createMalla, 
  getMallasUsuario,
  getMallaById, 
  addRamoToSemestre, 
  updateEstadoRamo,
  deleteMalla,
  removeRamoFromSemestre
} from '../controllers/mallaController';

const router = express.Router();

// --- Definición de Rutas para Mallas ---
router.post('/', withUser, createMalla); 
router.get('/', withUser, getMallasUsuario);
router.get('/:mallaId', withUser, getMallaById);
router.delete('/:mallaId', withUser, deleteMalla);
router.post('/:mallaId/semestres/:numero/ramos', withUser, addRamoToSemestre);
router.delete('/:mallaId/semestres/:numero/ramos/:ramoId', withUser, removeRamoFromSemestre);
router.patch('/:mallaId/ramos/:ramoId', withUser, updateEstadoRamo);

export default router;