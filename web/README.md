# Frontend Web - Eventos Musicales

Aplicación web frontend para descubrir eventos musicales, construida con Vite + React + TypeScript.

## 🚀 Setup

### Prerrequisitos

- Node.js 18+ y npm
- Backend API corriendo (ver `/api/README.md`)
- Cuenta de Supabase configurada

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_publishable_api_key
VITE_API_URL=http://localhost:3001
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
web/
├── src/
│   ├── components/
│   │   ├── auth/          # Componentes de autenticación
│   │   ├── events/         # Componentes de eventos
│   │   ├── cart/           # Componentes de carrito
│   │   └── ui/             # Componentes UI reutilizables
│   ├── pages/              # Páginas de la aplicación
│   ├── lib/
│   │   ├── supabase/       # Cliente de Supabase
│   │   ├── stores/         # Zustand stores
│   │   └── utils/          # Utilidades (API client, etc.)
│   ├── types/              # TypeScript types
│   ├── styles/             # Estilos CSS
│   └── App.tsx             # Componente principal
```

## 🔐 Autenticación

La autenticación está implementada usando Supabase Auth:

- **Login**: `/login` - Iniciar sesión con email y contraseña
- **Registro**: `/register` - Crear nueva cuenta
- **Rutas protegidas**: Requieren autenticación (Profile, Purchases, Favorites)

El estado de autenticación se maneja con Zustand (`authStore`) y se sincroniza automáticamente con Supabase.

## 🛣️ Rutas

- `/` - Home (público)
- `/login` - Login (público)
- `/register` - Registro (público)
- `/profile` - Perfil del usuario (protegido)
- `/purchases` - Mis compras (protegido)
- `/favorites` - Favoritos (protegido)

## 🔧 Scripts

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build de producción
- `npm run lint` - Ejecutar linter

## 📝 Notas

- Las variables de entorno deben comenzar con `VITE_` para que Vite las exponga al frontend
- El token de autenticación se obtiene automáticamente de Supabase y se incluye en las peticiones al API
- Las rutas protegidas redirigen a `/login` si el usuario no está autenticado
