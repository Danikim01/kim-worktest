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
  category?: string | null;
  created_at: string;
  updated_at?: string;
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
  favoritos?: string[];
  created_at: string;
  updated_at?: string;
}

