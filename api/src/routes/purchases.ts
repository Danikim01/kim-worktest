import { Router } from 'express';
import {
  getPurchases,
  getPurchaseById,
  createPurchase,
  getAllPurchases,
} from '../controllers/purchasesController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware, backofficeMiddleware } from '../middleware/role';

const router = Router();

// All purchase routes require authentication
router.use(authMiddleware);

// User routes
router.get('/', getPurchases);
router.get('/:id', getPurchaseById);
router.post('/', createPurchase);

// Admin/Backoffice-only route
router.get('/admin/all', backofficeMiddleware, getAllPurchases);

export default router;

