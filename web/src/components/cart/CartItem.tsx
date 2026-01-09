import type { CartItem as CartItemType, TicketType } from '../../types';
import { TICKET_PRICES } from '../../types';
import { useCartStore } from '../../lib/stores/cartStore';
import './CartItem.css';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getItemTotal = () => {
    return item.tickets.reduce((total, ticket) => {
      return total + TICKET_PRICES[ticket.type].price * ticket.quantity;
    }, 0);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-header">
        <h3>{item.show.artista}</h3>
        <button
          onClick={() => item.tickets.forEach(t => removeFromCart(item.showId, t.type))}
          className="btn-remove"
        >
          ✕
        </button>
      </div>
      <p className="cart-item-venue">{item.show.venue} - {item.show.ciudad}</p>
      
      <div className="cart-item-tickets">
        {item.tickets.map((ticket) => (
          <div key={ticket.type} className="ticket-row">
            <div className="ticket-details">
              <span className="ticket-type-name">{TICKET_PRICES[ticket.type].name}</span>
              <span className="ticket-unit-price">
                {formatPrice(TICKET_PRICES[ticket.type].price)} c/u
              </span>
            </div>
            <div className="ticket-quantity-controls">
              <button
                onClick={() => updateQuantity(item.showId, ticket.type, ticket.quantity - 1)}
              >
                −
              </button>
              <span className="quantity">{ticket.quantity}</span>
              <button
                onClick={() => updateQuantity(item.showId, ticket.type, ticket.quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="ticket-subtotal">
              {formatPrice(TICKET_PRICES[ticket.type].price * ticket.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-item-total">
        <strong>Subtotal: {formatPrice(getItemTotal())}</strong>
      </div>
    </div>
  );
}

