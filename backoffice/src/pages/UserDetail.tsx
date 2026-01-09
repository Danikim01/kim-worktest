import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/utils/api';
import type { User, Purchase } from '../types';
import './UserDetail.css';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadUser();
      loadUserPurchases();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get user from Supabase users list
      const users = await apiRequest<User[]>('/api/users/admin/all');
      const foundUser = users.find(u => u.id === id);
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError('Usuario no encontrado');
      }
    } catch (err: any) {
      console.error('Error loading user:', err);
      setError(err.error || 'Error al cargar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPurchases = async () => {
    try {
      const allPurchases = await apiRequest<Purchase[]>('/api/purchases/admin/all');
      const userPurchases = allPurchases.filter(p => p.user_id === id);
      setPurchases(userPurchases);
    } catch (err) {
      console.error('Error loading purchases:', err);
    }
  };

  if (loading) {
    return <div className="detail-container"><p>Cargando...</p></div>;
  }

  if (error || !user) {
    return (
      <div className="detail-container">
        <div className="error-message">{error || 'Usuario no encontrado'}</div>
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
        <h1>Detalle del Usuario</h1>

        <div className="detail-form">
          <div className="form-row">
            <label>ID</label>
            <p className="id-field">{user.id}</p>
          </div>

          <div className="form-row">
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div className="form-row">
            <label>Fecha de Creación</label>
            <p>{new Date(user.created_at).toLocaleString('es-AR')}</p>
          </div>

          {user.updated_at && (
            <div className="form-row">
              <label>Última Actualización</label>
              <p>{new Date(user.updated_at).toLocaleString('es-AR')}</p>
            </div>
          )}
        </div>

        <div className="purchases-section">
          <h2>Compras Realizadas ({purchases.length})</h2>
          {purchases.length === 0 ? (
            <p>Este usuario no ha realizado compras</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Evento</th>
                  <th>Cantidad</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{purchase.id.substring(0, 8)}...</td>
                    <td>{purchase.show_id.substring(0, 8)}...</td>
                    <td>{purchase.cantidad}</td>
                    <td>{purchase.ticket_type || 'N/A'}</td>
                    <td>{new Date(purchase.fecha_compra).toLocaleDateString()}</td>
                    <td>
                      <span className={`status status-${purchase.estado}`}>
                        {purchase.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/purchases/${purchase.id}`)}
                        className="btn-view"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

