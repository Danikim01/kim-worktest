import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/utils/api';
import type { Purchase, Show } from '../types';
import './PurchaseDetail.css';

export default function PurchaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPurchase();
    }
  }, [id]);

  const loadPurchase = async () => {
    try {
      setLoading(true);
      setError(null);
      const purchaseData = await apiRequest<Purchase>(`/api/purchases/${id}`);
      setPurchase(purchaseData);

      // Load show details
      try {
        const showData = await apiRequest<Show>(`/api/shows/${purchaseData.show_id}`);
        setShow(showData);
      } catch (err) {
        console.error('Error loading show:', err);
      }
    } catch (err: any) {
      console.error('Error loading purchase:', err);
      setError(err.error || 'Error al cargar la compra');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="detail-container"><p>Cargando...</p></div>;
  }

  if (error || !purchase) {
    return (
      <div className="detail-container">
        <div className="error-message">{error || 'Compra no encontrada'}</div>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Volver
        </button>
      </div>

      <div className="detail-content">
        <h1>Detalle de la Compra</h1>

        <div className="detail-form">
          <div className="form-row">
            <label>ID de Compra</label>
            <p className="id-field">{purchase.id}</p>
          </div>

          <div className="form-row">
            <label>ID de Usuario</label>
            <p className="id-field">{purchase.user_id}</p>
          </div>

          {show && (
            <div className="form-row">
              <label>Evento</label>
              <p>
                <strong>{show.artista}</strong> - {show.venue}, {show.ciudad}
              </p>
            </div>
          )}

          <div className="form-row">
            <label>ID de Evento</label>
            <p className="id-field">{purchase.show_id}</p>
          </div>

          <div className="form-row">
            <label>Cantidad</label>
            <p>{purchase.cantidad} ticket(s)</p>
          </div>

          <div className="form-row">
            <label>Tipo de Ticket</label>
            <p>{purchase.ticket_type || 'N/A'}</p>
          </div>

          <div className="form-row">
            <label>Fecha de Compra</label>
            <p>{new Date(purchase.fecha_compra).toLocaleString('es-AR')}</p>
          </div>

          <div className="form-row">
            <label>Estado</label>
            <p>
              <span className={`status status-${purchase.estado}`}>
                {purchase.estado}
              </span>
            </p>
          </div>

          <div className="form-row">
            <label>Código QR</label>
            <div className="qr-container">
              <img src={purchase.qr_code} alt="QR Code" className="qr-image" />
            </div>
          </div>

          <div className="form-row">
            <label>Creado</label>
            <p>{new Date(purchase.created_at).toLocaleString('es-AR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

