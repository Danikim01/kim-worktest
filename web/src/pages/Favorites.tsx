import ProtectedRoute from '../components/ui/ProtectedRoute';
import Layout from '../components/ui/Layout';

export default function Favorites() {
  return (
    <ProtectedRoute>
      <Layout>
        <div style={{ padding: '2rem' }}>
          <h1>Mis Favoritos</h1>
          <p>Aquí verás tus eventos favoritos</p>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

