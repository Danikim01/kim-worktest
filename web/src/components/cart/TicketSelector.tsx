import { useState } from 'react';
import type { Show, TicketType } from '../../types';
import { TICKET_PRICES } from '../../types';
import { useCartStore } from '../../lib/stores/cartStore';
import './TicketSelector.css';

interface TicketSelectorProps {
  show: Show;
}

export default function TicketSelector({ show }: TicketSelectorProps) {
  const [selectedType, setSelectedType] = useState<TicketType>('campo');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getItemByShowId } = useCartStore();

  const cartItem = getItemByShowId(show.id);
  const hasTicketsInCart = cartItem && cartItem.tickets.length > 0;

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(show, selectedType, quantity);
      setQuantity(1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="ticket-selector">
      <h3>Seleccionar Tickets</h3>

      {hasTicketsInCart && (
        <div className="cart-notice">
          <p>✅ Ya tienes tickets de este evento en tu carrito</p>
        </div>
      )}

      <div className="ticket-types">
        {Object.values(TICKET_PRICES).map((ticket) => (
          <label key={ticket.type} className="ticket-type-option">
            <input
              type="radio"
              name="ticketType"
              value={ticket.type}
              checked={selectedType === ticket.type}
              onChange={(e) => setSelectedType(e.target.value as TicketType)}
            />
            <div className="ticket-info">
              <span className="ticket-name">{ticket.name}</span>
              <span className="ticket-price">{formatPrice(ticket.price)}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="quantity-selector">
        <label htmlFor="quantity">Cantidad:</label>
        <div className="quantity-controls">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            −
          </button>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          />
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="total-preview">
        <strong>
          Total: {formatPrice(TICKET_PRICES[selectedType].price * quantity)}
        </strong>
      </div>

      <button onClick={handleAddToCart} className="btn-add-cart">
        Agregar al Carrito
      </button>
    </div>
  );
}

