import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../lib/stores/cartStore';
import { useAuthStore } from '../lib/stores/authStore';
import { apiRequest } from '../lib/utils/api';
import Layout from '../components/ui/Layout';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    if (!user) {
      setError('Debes estar autenticado para realizar una compra');
      return;
    }

    if (items.length === 0) {
      setError('Tu carrito está vacío');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Procesar cada item del carrito
      const purchases = [];
      
      for (const item of items) {
        for (const ticket of item.tickets) {
          // Crear una compra por cada tipo de ticket
          for (let i = 0; i < ticket.quantity; i++) {
            const purchase = await apiRequest<any>('/api/purchases', {
              method: 'POST',
              body: JSON.stringify({
                show_id: item.showId,
                cantidad: 1,
                ticket_type: ticket.type,
              }),
            });
            purchases.push(purchase);
          }
        }
      }

      // Limpiar carrito y redirigir a confirmación
      clearCart();
      navigate('/purchase-confirmation', { 
        state: { purchases } 
      });
    } catch (err: any) {
      console.error('Error en checkout:', err);
      setError(err.error || 'Error al procesar la compra');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="checkout-page">
            <div className="empty-cart">
              <p>Tu carrito está vacío</p>
              <button onClick={() => navigate('/cart')} className="btn-back">
                Volver al carrito
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="checkout-page">
          <h1>Checkout</h1>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="checkout-content">
            <div className="checkout-summary">
              <h2>Resumen de Compra</h2>
              <div className="summary-items">
                {items.map((item) => (
                  <div key={item.showId} className="summary-item">
                    <h3>{item.show.artista}</h3>
                    <p>{item.show.venue} - {item.show.ciudad}</p>
                    <div className="tickets-summary">
                      {item.tickets.map((ticket) => (
                        <div key={ticket.type} className="ticket-summary">
                          <span>{ticket.quantity}x {ticket.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="total-section">
                <strong>Total: {formatPrice(getTotalPrice())}</strong>
              </div>
            </div>

            <div className="checkout-form">
              <h2>Información de Pago</h2>
              <div className="payment-note">
                <p>⚠️ Esta es una compra simulada. No se procesará ningún pago real.</p>
              </div>
              <div className="form-group">
                <label>Email de facturación</label>
                <input type="email" value={user?.email || ''} disabled />
              </div>
              <div className="form-group">
                <label>Método de pago</label>
                <select disabled>
                  <option>Tarjeta de crédito (Simulado)</option>
                </select>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-complete-purchase"
              >
                {loading ? 'Procesando...' : 'Completar Compra'}
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="btn-back"
                disabled={loading}
              >
                Volver al carrito
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

