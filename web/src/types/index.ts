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

export type TicketType = 'platea_baja' | 'platea_alta' | 'campo';

export interface TicketPrice {
  type: TicketType;
  name: string;
  price: number;
}

export const TICKET_PRICES: Record<TicketType, TicketPrice> = {
  platea_baja: {
    type: 'platea_baja',
    name: 'Platea Baja',
    price: 50000,
  },
  platea_alta: {
    type: 'platea_alta',
    name: 'Platea Alta',
    price: 80000,
  },
  campo: {
    type: 'campo',
    name: 'Campo',
    price: 30000,
  },
};

export interface CartItem {
  showId: string;
  show: Show;
  tickets: {
    type: TicketType;
    quantity: number;
  }[];
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
  ticket_type?: TicketType;
}
