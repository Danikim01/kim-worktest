import { Response } from 'express';
import { AuthenticatedRequest, CreatePurchaseRequest } from '../types';
import container from '../services/container';
import qrService from '../services/qrService';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const dataRepository = container.dataRepository;

const createPurchaseSchema = z.object({
  show_id: z.string().uuid(),
  cantidad: z.number().int().positive(),
  ticket_type: z.enum(['platea_baja', 'platea_alta', 'campo']).optional(),
});

export const getPurchases = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const purchases = await dataRepository.getPurchasesByUserId(req.user.id);
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

export const getPurchaseById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const purchase = await dataRepository.getPurchaseById(id);

    if (!purchase) {
      res.status(404).json({ error: 'Purchase not found' });
      return;
    }

    // Check if user is admin (by email)
    const adminEmail = process.env.ADMIN_EMAIL;
    const isAdmin = adminEmail && req.user.email?.toLowerCase() === adminEmail.toLowerCase();

    // Users can only view their own purchases (unless admin)
    if (purchase.user_id !== req.user.id && !isAdmin) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase' });
  }
};

export const createPurchase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const validation = createPurchaseSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
      return;
    }

    const data: CreatePurchaseRequest = validation.data;

    // Verify show exists
    const show = await dataRepository.getShowById(data.show_id);
    if (!show) {
      res.status(404).json({ error: 'Show not found' });
      return;
    }

    // Check if show is active/confirmed
    if (show.estado !== 'activo' && show.estado !== 'confirmado') {
      res.status(400).json({ error: 'Show is not available for purchase' });
      return;
    }

    // Check capacity (simplified - in real app, would check against existing purchases)
    // For now, we'll just check if cantidad is reasonable
    if (data.cantidad > show.capacidad_total) {
      res.status(400).json({ error: 'Requested quantity exceeds show capacity' });
      return;
    }

    // Generate QR code
    const purchaseId = uuidv4();
    const qrCode = await qrService.generateQRCodeForPurchase(
      purchaseId,
      req.user.id,
      data.show_id
    );

    const now = new Date().toISOString();
    const purchaseData = {
      id: purchaseId,
      user_id: req.user.id,
      show_id: data.show_id,
      cantidad: data.cantidad,
      fecha_compra: now,
      qr_code: qrCode,
      estado: 'confirmado' as const,
      created_at: now,
      ticket_type: data.ticket_type,
    };

    console.log('📝 Creating purchase:', purchaseData);
    const purchase = await dataRepository.createPurchase(purchaseData);
    console.log('✅ Purchase created successfully');

    res.status(201).json(purchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
};

export const getAllPurchases = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Middleware already verifies admin access, no need to check again
    const purchases = await dataRepository.getAllPurchases();
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching all purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

