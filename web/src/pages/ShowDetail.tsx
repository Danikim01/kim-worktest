import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Show } from '../types/index';
import { apiRequest } from '../lib/utils/api';
import Layout from '../components/ui/Layout';
import TicketSelector from '../components/cart/TicketSelector';
import './ShowDetail.css';

export default function ShowDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadShow(id);
    }
  }, [id]);

  const loadShow = async (showId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<Show>(`/api/shows/${showId}`);
      setShow(data);
    } catch (err: any) {
      console.error('Error loading show:', err);
      setError(err.error || 'Error al cargar el evento');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <p>Cargando evento...</p>
        </div>
      </Layout>
    );
  }

  if (error || !show) {
    return (
      <Layout>
        <div className="error-container">
          <div className="error-message">{error || 'Evento no encontrado'}</div>
          <button onClick={() => navigate('/')} className="btn-back">
            Volver a eventos
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="show-detail">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Volver a eventos
        </button>

        <div className="show-detail-header">
          <div className="show-title-section">
            <h1>{show.artista}</h1>
            <span className={`show-status show-status-${show.estado}`}>
              {show.estado}
            </span>
          </div>
        </div>

        <div className="show-detail-content">
          <div className="show-info-card">
            <h2>Información del Evento</h2>
            
            <div className="info-row">
              <strong>📍 Venue:</strong>
              <span>{show.venue}</span>
            </div>

            <div className="info-row">
              <strong>🌍 Ubicación:</strong>
              <span>{show.ciudad}, {show.pais}</span>
            </div>

            <div className="info-row">
              <strong>📅 Fecha y Hora:</strong>
              <span>{formatDate(show.fecha_show)}</span>
            </div>

            <div className="info-row">
              <strong>🎫 Capacidad:</strong>
              <span>{show.capacidad_total.toLocaleString()} personas</span>
            </div>

            {show.category && (
              <div className="info-row">
                <strong>🎵 Categoría:</strong>
                <span>{show.category}</span>
              </div>
            )}

            <div className="info-row">
              <strong>🎟️ Ticketera:</strong>
              <span>{show.ticketera}</span>
            </div>
          </div>

          <div className="show-actions">
            <TicketSelector show={show} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

