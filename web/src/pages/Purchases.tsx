import { useEffect, useState } from 'react';
import type { Purchase, Show } from '../types';
import { apiRequest } from '../lib/utils/api';
import Layout from '../components/ui/Layout';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import './Purchases.css';

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [shows, setShows] = useState<Record<string, Show>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<Purchase[]>('/api/purchases');
      setPurchases(data);

      // Cargar información de los shows
      const showIds = [...new Set(data.map(p => p.show_id))];
      const showsData: Record<string, Show> = {};
      
      for (const showId of showIds) {
        try {
          const show = await apiRequest<Show>(`/api/shows/${showId}`);
          showsData[showId] = show;
        } catch (err) {
          console.error(`Error loading show ${showId}:`, err);
        }
      }
      
      setShows(showsData);
    } catch (err: any) {
      console.error('Error loading purchases:', err);
      setError(err.error || 'Error al cargar las compras');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="purchases-page">
            <p>Cargando compras...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="purchases-page">
            <div className="error-message">{error}</div>
            <button onClick={loadPurchases} className="btn-retry">Reintentar</button>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="purchases-page">
          <h1>Mis Compras</h1>

          {purchases.length === 0 ? (
            <div className="no-purchases">
              <p>No tienes compras realizadas</p>
              <a href="/" className="btn-browse-events">Explorar eventos</a>
            </div>
          ) : (
            <div className="purchases-list">
              {purchases.map((purchase) => {
                const show = shows[purchase.show_id];
                return (
                  <div key={purchase.id} className="purchase-item">
                    <div className="purchase-header">
                      <div>
                        <h3>{show ? show.artista : 'Evento no encontrado'}</h3>
                        {show && (
                          <p className="purchase-venue">{show.venue} - {show.ciudad}</p>
                        )}
                      </div>
                      <span className={`purchase-status purchase-status-${purchase.estado}`}>
                        {purchase.estado}
                      </span>
                    </div>

                    <div className="purchase-details">
                      <div className="purchase-info">
                        <p><strong>Fecha de compra:</strong> {formatDate(purchase.fecha_compra)}</p>
                        <p><strong>Cantidad:</strong> {purchase.cantidad} ticket(s)</p>
                        {purchase.ticket_type && (
                          <p><strong>Tipo:</strong> {purchase.ticket_type}</p>
                        )}
                        <p><strong>ID de compra:</strong> {purchase.id.substring(0, 8)}...</p>
                      </div>

                      <div className="purchase-qr">
                        <h4>Código QR</h4>
                        <div className="qr-container">
                          <img src={purchase.qr_code} alt="QR Code" className="qr-image" />
                        </div>
                        <p className="qr-note">Presenta este código en la entrada</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
