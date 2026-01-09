import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/utils/api';
import type { Show } from '../types';
import './ShowDetail.css';

export default function ShowDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Show>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadShow();
    }
  }, [id]);

  const loadShow = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<Show>(`/api/shows/${id}`);
      setShow(data);
      setFormData(data);
    } catch (err: any) {
      console.error('Error loading show:', err);
      setError(err.error || 'Error al cargar el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacidad_total' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      await apiRequest<Show>(`/api/shows/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      setEditing(false);
      await loadShow();
      alert('Evento actualizado correctamente');
    } catch (err: any) {
      console.error('Error updating show:', err);
      setError(err.error || 'Error al actualizar el evento');
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      return;
    }

    try {
      setError(null);
      await apiRequest(`/api/shows/${id}`, {
        method: 'DELETE',
      });
      alert('Evento eliminado correctamente');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error deleting show:', err);
      setError(err.error || 'Error al eliminar el evento');
    }
  };

  if (loading) {
    return <div className="detail-container"><p>Cargando...</p></div>;
  }

  if (error && !show) {
    return (
      <div className="detail-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  if (!show) {
    return <div className="detail-container"><p>Evento no encontrado</p></div>;
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Volver
        </button>
        <div className="detail-actions">
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} className="btn-edit">
                Editar
              </button>
              <button onClick={handleDelete} className="btn-delete">
                Eliminar
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSave} className="btn-save">
                Guardar
              </button>
              <button onClick={() => { setEditing(false); setFormData(show); }} className="btn-cancel">
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="detail-content">
        <h1>{editing ? 'Editar Evento' : 'Detalle del Evento'}</h1>

        <div className="detail-form">
          <div className="form-row">
            <label>Artista/Banda</label>
            {editing ? (
              <input
                type="text"
                name="artista"
                value={formData.artista || ''}
                onChange={handleInputChange}
              />
            ) : (
              <p>{show.artista}</p>
            )}
          </div>

          <div className="form-row">
            <label>Venue</label>
            {editing ? (
              <input
                type="text"
                name="venue"
                value={formData.venue || ''}
                onChange={handleInputChange}
              />
            ) : (
              <p>{show.venue}</p>
            )}
          </div>

          <div className="form-row">
            <label>Fecha del Show</label>
            {editing ? (
              <input
                type="datetime-local"
                name="fecha_show"
                value={formData.fecha_show ? new Date(formData.fecha_show).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
              />
            ) : (
              <p>{new Date(show.fecha_show).toLocaleString('es-AR')}</p>
            )}
          </div>

          <div className="form-row">
            <label>Ciudad</label>
            {editing ? (
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad || ''}
                onChange={handleInputChange}
              />
            ) : (
              <p>{show.ciudad}</p>
            )}
          </div>

          <div className="form-row">
            <label>País</label>
            {editing ? (
              <input
                type="text"
                name="pais"
                value={formData.pais || ''}
                onChange={handleInputChange}
              />
            ) : (
              <p>{show.pais}</p>
            )}
          </div>

          <div className="form-row">
            <label>Capacidad Total</label>
            {editing ? (
              <input
                type="number"
                name="capacidad_total"
                value={formData.capacidad_total || 0}
                onChange={handleInputChange}
              />
            ) : (
              <p>{show.capacidad_total}</p>
            )}
          </div>

          <div className="form-row">
            <label>Ticketera</label>
            {editing ? (
              <input
                type="text"
                name="ticketera"
                value={formData.ticketera || ''}
                onChange={handleInputChange}
              />
            ) : (
              <p>{show.ticketera}</p>
            )}
          </div>

          <div className="form-row">
            <label>Estado</label>
            {editing ? (
              <select
                name="estado"
                value={formData.estado || ''}
                onChange={handleInputChange}
              >
                <option value="activo">Activo</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
                <option value="finalizado">Finalizado</option>
              </select>
            ) : (
              <p><span className={`status status-${show.estado}`}>{show.estado}</span></p>
            )}
          </div>

          <div className="form-row">
            <label>Categoría</label>
            {editing ? (
              <input
                type="text"
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                placeholder="Opcional"
              />
            ) : (
              <p>{show.category || 'N/A'}</p>
            )}
          </div>

          <div className="form-row">
            <label>ID</label>
            <p className="id-field">{show.id}</p>
          </div>

          <div className="form-row">
            <label>Creado</label>
            <p>{new Date(show.created_at).toLocaleString('es-AR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

