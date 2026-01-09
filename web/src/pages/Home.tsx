import { useEffect, useState } from 'react';
import type { Show } from '../types/index';
import { apiRequest } from '../lib/utils/api';
import ShowCard from '../components/events/ShowCard';
import ShowFilters from '../components/events/ShowFilters';
import Layout from '../components/ui/Layout';
import './Home.css';

export default function Home() {
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ ciudad?: string; fecha?: string; artista?: string }>({});

  useEffect(() => {
    loadShows();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [shows, filters]);

  const loadShows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<Show[]>('/api/shows');
      setShows(data);
      setFilteredShows(data);
    } catch (err: any) {
      console.error('Error loading shows:', err);
      setError(err.error || 'Error al cargar los eventos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...shows];

    if (filters.artista) {
      filtered = filtered.filter(show =>
        show.artista.toLowerCase().includes(filters.artista!.toLowerCase())
      );
    }

    if (filters.ciudad) {
      filtered = filtered.filter(show =>
        show.ciudad.toLowerCase().includes(filters.ciudad!.toLowerCase())
      );
    }

    if (filters.fecha) {
      const filterDate = filters.fecha.split('T')[0];
      filtered = filtered.filter(show => {
        const showDate = new Date(show.fecha_show).toISOString().split('T')[0];
        return showDate === filterDate;
      });
    }

    setFilteredShows(filtered);
  };

  const handleFilter = (newFilters: { ciudad?: string; fecha?: string; artista?: string }) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <p>Cargando eventos...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={loadShows} className="btn-retry">Reintentar</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="home-page">
        <div className="page-header">
          <h1>Eventos Musicales</h1>
          <p>Descubre los mejores conciertos y shows en vivo</p>
        </div>

        <ShowFilters onFilter={handleFilter} />

        <div className="shows-section">
          <div className="shows-header">
            <h2>
              {filteredShows.length === shows.length
                ? `Todos los eventos (${filteredShows.length})`
                : `Eventos filtrados (${filteredShows.length} de ${shows.length})`}
            </h2>
          </div>

          {filteredShows.length === 0 ? (
            <div className="no-results">
              <p>No se encontraron eventos con los filtros aplicados.</p>
              <button onClick={() => setFilters({})} className="btn-clear-filters">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="shows-grid">
              {filteredShows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
