import { useState, FormEvent } from 'react';
import './ShowFilters.css';

interface ShowFiltersProps {
  onFilter: (filters: { ciudad?: string; fecha?: string; artista?: string }) => void;
}

export default function ShowFilters({ onFilter }: ShowFiltersProps) {
  const [ciudad, setCiudad] = useState('');
  const [fecha, setFecha] = useState('');
  const [artista, setArtista] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilter({
      ciudad: ciudad || undefined,
      fecha: fecha || undefined,
      artista: artista || undefined,
    });
  };

  const handleReset = () => {
    setCiudad('');
    setFecha('');
    setArtista('');
    onFilter({});
  };

  return (
    <form className="show-filters" onSubmit={handleSubmit}>
      <div className="filter-group">
        <label htmlFor="artista">Artista</label>
        <input
          type="text"
          id="artista"
          value={artista}
          onChange={(e) => setArtista(e.target.value)}
          placeholder="Buscar por artista..."
        />
      </div>

      <div className="filter-group">
        <label htmlFor="ciudad">Ciudad</label>
        <input
          type="text"
          id="ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Buscar por ciudad..."
        />
      </div>

      <div className="filter-group">
        <label htmlFor="fecha">Fecha</label>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn-filter">Filtrar</button>
        <button type="button" onClick={handleReset} className="btn-reset">
          Limpiar
        </button>
      </div>
    </form>
  );
}

