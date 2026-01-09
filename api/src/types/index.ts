export interface Show {
  id: string;
  artista: string;
  venue: string;
  fecha_show: string;
  ciudad: string;
  pais: string;
  capacidad_total: number;
  ticketera: string;
  estado: string;
  created_at: string;
  updated_at: string;
  category: string | null;
}

export interface Purchase {
  id: string;
  user_id: string;
  show_id: string;
  cantidad: number;
  fecha_compra: string;
  qr_code: string;
  estado: 'pendiente' | 'confirmado' | 'cancelado';
  created_at: string;
  ticket_type?: string;
}

export interface User {
  id: string;
  email: string;
  nombre?: string;
  favoritos: string[];
  created_at: string;
  updated_at: string;
}

export interface CreatePurchaseRequest {
  show_id: string;
  cantidad: number;
  ticket_type?: string; // 'platea_baja' | 'platea_alta' | 'campo'
}

export interface CreateShowRequest {
  artista: string;
  venue: string;
  fecha_show: string;
  ciudad: string;
  pais: string;
  capacidad_total: number;
  ticketera: string;
  estado: string;
  category?: string | null;
}

export interface UpdateShowRequest {
  artista?: string;
  venue?: string;
  fecha_show?: string;
  ciudad?: string;
  pais?: string;
  capacidad_total?: number;
  ticketera?: string;
  estado?: string;
  category?: string | null;
}

export interface ShowFilters {
  ciudad?: string;
  fecha?: string;
  artista?: string;
}

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

