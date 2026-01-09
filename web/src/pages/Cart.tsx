import { Link } from 'react-router-dom';
import { useCartStore } from '../lib/stores/cartStore';
import Layout from '../components/ui/Layout';
import CartItem from '../components/cart/CartItem';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import './Cart.css';

export default function Cart() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="cart-page">
            <h1>Carrito de Compras</h1>
            <div className="empty-cart">
              <p>Tu carrito está vacío</p>
              <Link to="/" className="btn-continue-shopping">
                Continuar comprando
              </Link>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="cart-page">
          <div className="cart-header">
            <h1>Carrito de Compras</h1>
            <button onClick={clearCart} className="btn-clear-cart">
              Vaciar carrito
            </button>
          </div>

          <div className="cart-content">
            <div className="cart-items">
              {items.map((item) => (
                <CartItem key={item.showId} item={item} />
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h2>Resumen</h2>
                <div className="summary-row">
                  <span>Items:</span>
                  <span>{getTotalItems()}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <Link to="/checkout" className="btn-checkout">
                  Proceder al Checkout
                </Link>
                <Link to="/" className="btn-continue-shopping">
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

