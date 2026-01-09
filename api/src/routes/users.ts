import { Router } from 'express';
import {
  getCurrentUser,
  updateCurrentUser,
  addFavorite,
  removeFavorite,
  getAllUsers,
} from '../controllers/usersController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware, backofficeMiddleware } from '../middleware/role';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// User routes
router.get('/me', getCurrentUser);
router.put('/me', updateCurrentUser);
router.post('/me/favoritos/:showId', addFavorite);
router.delete('/me/favoritos/:showId', removeFavorite);

// Admin/Backoffice-only route
router.get('/admin/all', backofficeMiddleware, getAllUsers);

export default router;

