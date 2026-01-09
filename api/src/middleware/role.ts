import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import supabaseService from '../services/supabaseService';

/**
 * Middleware para verificar si el usuario es admin del backoffice
 * Verifica que el email del usuario coincida con ADMIN_EMAIL del .env
 */
export const adminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      console.log('❌ Admin middleware: No user in request');
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Get admin email from environment
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      console.error('❌ ADMIN_EMAIL not configured in .env');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    // Check if user email matches admin email (req.user.email is set by authMiddleware)
    const userEmail = req.user.email;
    
    console.log('🔍 Admin middleware check:');
    console.log('  - User email:', userEmail);
    console.log('  - Admin email:', adminEmail);
    console.log('  - Match:', userEmail?.toLowerCase() === adminEmail.toLowerCase());
    
    if (!userEmail || userEmail.toLowerCase() !== adminEmail.toLowerCase()) {
      console.log(`❌ Access denied: "${userEmail}" !== "${adminEmail}"`);
      res.status(403).json({ 
        error: 'Admin access required',
        message: 'This endpoint is only accessible to administrators',
        debug: {
          userEmail: userEmail || 'undefined',
          adminEmail: adminEmail,
        }
      });
      return;
    }

    console.log(`✅ Admin access granted for: ${userEmail}`);
    // Set role as admin for downstream use
    req.user.role = 'admin';
    // User is admin, proceed
    next();
  } catch (error) {
    console.error('❌ Admin middleware error:', error);
    res.status(500).json({ error: 'Authorization error' });
  }
};

/**
 * Alias para backofficeMiddleware (mismo comportamiento que adminMiddleware)
 */
export const backofficeMiddleware = adminMiddleware;

