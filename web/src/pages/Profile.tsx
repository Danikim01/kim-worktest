import { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/stores/authStore';
import { apiRequest } from '../lib/utils/api';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import Layout from '../components/ui/Layout';
import './Profile.css';

interface UserProfile {
  id: string;
  email: string;
  nombre?: string | null;
  favoritos: string[];
  created_at: string;
  updated_at: string;
  email_confirmed?: boolean;
  last_sign_in?: string | null;
  metadata?: any;
}

export default function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verify we have a user before making the request
      if (!user) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }
      
      console.log('📤 Cargando perfil para usuario:', user.id);
      const data = await apiRequest<UserProfile>('/api/users/me');
      console.log('✅ Perfil cargado:', data);
      setProfile(data);
    } catch (err: any) {
      console.error('❌ Error cargando perfil:', err);
      setError(err.error || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="profile-container">
            <p>Cargando perfil...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="profile-container">
            <div className="error-message">{error}</div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="profile-container">
        <h1>Mi Perfil</h1>
        {profile && (
          <div className="profile-info">
            <p><strong>Email:</strong> {profile.email}</p>
            {profile.email_confirmed !== undefined && (
              <p><strong>Email confirmado:</strong> {profile.email_confirmed ? '✅ Sí' : '❌ No'}</p>
            )}
            {profile.nombre && <p><strong>Nombre:</strong> {profile.nombre}</p>}
            <p><strong>Favoritos:</strong> {profile.favoritos.length} eventos</p>
            {profile.last_sign_in && (
              <p><strong>Último acceso:</strong> {new Date(profile.last_sign_in).toLocaleString()}</p>
            )}
            <p><strong>Usuario desde:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

