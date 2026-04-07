import { Router } from 'express';
import {
  getMaterias,
  getMateria,
  createMateria,
  updateMateria,
  deleteMateria
} from '../controllers/materia.controller.js';

const router = Router();

router.get('/', getMaterias);
router.get('/:id', getMateria);
router.post('/', createMateria);
router.put('/:id', updateMateria);
router.delete('/:id', deleteMateria);

export default router;
