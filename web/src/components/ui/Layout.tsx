import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../lib/stores/authStore';
import { useCartStore } from '../../lib/stores/cartStore';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <div className="layout-container">
      <header className="header">
        <Link to="/" className="logo">
          <h1>Eventos Musicales</h1>
        </Link>
        <nav className="nav">
          {user ? (
            <>
              <Link to="/">Eventos</Link>
              <Link to="/cart">Carrito {totalItems > 0 && `(${totalItems})`}</Link>
              <Link to="/favorites">Favoritos</Link>
              <Link to="/purchases">Mis Compras</Link>
              <Link to="/profile">Mi Perfil</Link>
              <button onClick={signOut} className="btn-logout">Cerrar Sesión</button>
            </>
          ) : (
            <>
              <Link to="/">Eventos</Link>
              <Link to="/login">Iniciar Sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

