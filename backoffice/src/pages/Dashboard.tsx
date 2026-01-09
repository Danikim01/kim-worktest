import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/stores/authStore';
import { apiRequest } from '../lib/utils/api';
import type { Show, Purchase, User } from '../types';
import './Dashboard.css';

export default function Dashboard() {
  const { user, signOut, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [shows, setShows] = useState<Show[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'shows' | 'purchases' | 'users'>('shows');

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load shows
      try {
        const showsData = await apiRequest<Show[]>('/api/shows');
        setShows(showsData);
        console.log('Shows loaded:', showsData.length);
      } catch (error: any) {
        console.error('Error loading shows:', error);
        setShows([]);
      }

      // Load purchases
      try {
        const purchasesData = await apiRequest<Purchase[]>('/api/purchases/admin/all');
        setPurchases(purchasesData);
        console.log('Purchases loaded:', purchasesData.length);
      } catch (error: any) {
        console.error('Error loading purchases:', error);
        setPurchases([]);
      }

      // Load users
      try {
        const usersData = await apiRequest<User[]>('/api/users/admin/all');
        setUsers(usersData);
        console.log('Users loaded:', usersData.length);
      } catch (error: any) {
        console.error('Error loading users:', error);
        setUsers([]);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <div>Acceso denegado</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Backoffice - Panel de Administración</h1>
          <p>Bienvenido, {user?.email}</p>
        </div>
        <button onClick={signOut} className="btn-logout">
          Cerrar Sesión
        </button>
      </header>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'shows' ? 'active' : ''}
          onClick={() => setActiveTab('shows')}
        >
          Eventos ({shows.length})
        </button>
        <button
          className={activeTab === 'purchases' ? 'active' : ''}
          onClick={() => setActiveTab('purchases')}
        >
          Compras ({purchases.length})
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Usuarios ({users.length})
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            {activeTab === 'shows' && (
              <div className="table-container">
                <h2>Eventos</h2>
                {shows.length === 0 ? (
                  <p>No hay eventos disponibles</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Artista</th>
                        <th>Venue</th>
                        <th>Ciudad</th>
                        <th>Fecha</th>
                        <th>Capacidad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                    {shows.map((show) => (
                      <tr key={show.id}>
                        <td>{show.artista}</td>
                        <td>{show.venue}</td>
                        <td>{show.ciudad}</td>
                        <td>{new Date(show.fecha_show).toLocaleDateString()}</td>
                        <td>{show.capacidad_total}</td>
                        <td>
                          <span className={`status status-${show.estado}`}>
                            {show.estado}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => navigate(`/shows/${show.id}`)}
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
            )}

            {activeTab === 'purchases' && (
              <div className="table-container">
                <h2>Compras</h2>
                {purchases.length === 0 ? (
                  <p>No hay compras disponibles</p>
                ) : (
                  <table>
                  <thead>
                      <tr>
                        <th>ID</th>
                        <th>Usuario</th>
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
                        <td>{purchase.user_id.substring(0, 8)}...</td>
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
            )}

            {activeTab === 'users' && (
              <div className="table-container">
                <h2>Usuarios</h2>
                {users.length === 0 ? (
                  <p>No hay usuarios disponibles</p>
                ) : (
                  <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Compras</th>
                      <th>Creado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => {
                      const userPurchases = purchases.filter(p => p.user_id === userItem.id);
                      return (
                        <tr key={userItem.id}>
                          <td>{userItem.id.substring(0, 8)}...</td>
                          <td>{userItem.email}</td>
                          <td>{userPurchases.length}</td>
                          <td>{new Date(userItem.created_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={() => navigate(`/users/${userItem.id}`)}
                              className="btn-view"
                            >
                              Ver
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

