import express from 'express';
import { createMalla , addRamoToSemestre,getMallaById} from '../controllers/mallaController';

const router = express.Router();

// --- Definición de Rutas para Mallas ---

//Función para crear malla
router.post('/', createMalla);

// Aquí añadiremos más rutas en el futuro para obtener y modificar las mallas.
router.post('/:mallaId/ramos', addRamoToSemestre);

router.get('/:mallaId', getMallaById);


export default router;