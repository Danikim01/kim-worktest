import { Router } from 'express';
import {
  getShows,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
} from '../controllers/showsController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/role';

const router = Router();

// Public routes
router.get('/', getShows);
router.get('/:id', getShowById);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, createShow);
router.put('/:id', authMiddleware, adminMiddleware, updateShow);
router.delete('/:id', authMiddleware, adminMiddleware, deleteShow);

export default router;

