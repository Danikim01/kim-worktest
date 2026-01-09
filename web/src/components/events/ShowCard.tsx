import { Link } from 'react-router-dom';
import type { Show } from '../../types/index';
import './ShowCard.css';

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
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

  return (
    <Link to={`/shows/${show.id}`} className="show-card">
      <div className="show-card-header">
        <h3 className="show-artist">{show.artista}</h3>
        <span className={`show-status show-status-${show.estado}`}>
          {show.estado}
        </span>
      </div>
      <div className="show-card-body">
        <p className="show-venue">
          <strong>📍 Venue:</strong> {show.venue}
        </p>
        <p className="show-location">
          <strong>🌍 Ubicación:</strong> {show.ciudad}, {show.pais}
        </p>
        <p className="show-date">
          <strong>📅 Fecha:</strong> {formatDate(show.fecha_show)}
        </p>
        {show.category && (
          <p className="show-category">
            <strong>🎵 Categoría:</strong> {show.category}
          </p>
        )}
      </div>
      <div className="show-card-footer">
        <span className="show-capacity">Capacidad: {show.capacidad_total.toLocaleString()}</span>
      </div>
    </Link>
  );
}

