import { Request, Response, NextFunction } from 'express';
import supabaseService from '../services/supabaseService';
import { AuthenticatedRequest } from '../types';

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided in request');
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('🔍 Verificando token...');

    const { user, error } = await supabaseService.verifyToken(token);

    if (error || !user) {
      console.log('❌ Token inválido o expirado:', error);
      res.status(401).json({ error: 'Invalid or expired token', details: error });
      return;
    }

    console.log('✅ Token válido para usuario:', user.email);
    console.log('📧 Email del usuario:', user.email);
    console.log('🆔 ID del usuario:', user.id);

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role,
    };

    console.log('👤 req.user configurado:', {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    });

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

