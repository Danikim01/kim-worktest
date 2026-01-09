import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import type { Purchase } from '../types';
import Layout from '../components/ui/Layout';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import './PurchaseConfirmation.css';

export default function PurchaseConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (location.state?.purchases) {
      setPurchases(location.state.purchases);
    } else {
      // Si no hay purchases en el state, redirigir a home
      navigate('/');
    }
  }, [location.state, navigate]);

  if (purchases.length === 0) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="confirmation-page">
            <p>Cargando...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="confirmation-page">
          <div className="confirmation-header">
            <div className="success-icon">✅</div>
            <h1>¡Compra Confirmada!</h1>
            <p>Tu compra se ha realizado exitosamente</p>
          </div>

          <div className="purchases-list">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="purchase-card">
                <div className="purchase-info">
                  <h3>Ticket #{purchase.id.substring(0, 8)}</h3>
                  <p><strong>Estado:</strong> {purchase.estado}</p>
                  <p><strong>Fecha de compra:</strong> {new Date(purchase.fecha_compra).toLocaleString('es-AR')}</p>
                  {purchase.ticket_type && (
                    <p><strong>Tipo de ticket:</strong> {purchase.ticket_type}</p>
                  )}
                </div>
                <div className="qr-code-section">
                  <h4>Código QR</h4>
                  <div className="qr-code-container">
                    <img src={purchase.qr_code} alt="QR Code" className="qr-code-image" />
                  </div>
                  <p className="qr-note">Presenta este código QR en la entrada del evento</p>
                </div>
              </div>
            ))}
          </div>

          <div className="confirmation-actions">
            <Link to="/purchases" className="btn-view-purchases">
              Ver todas mis compras
            </Link>
            <Link to="/" className="btn-back-home">
              Volver a eventos
            </Link>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

