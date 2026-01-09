# Backoffice - Panel de Administración

Panel de administración para gestionar eventos, compras y usuarios.

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` y configura:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=admin@example.com
VITE_API_URL=http://localhost:3001
```

**Importante:** 
- `VITE_ADMIN_EMAIL` debe coincidir con `ADMIN_EMAIL` en `api/.env`
- El email debe corresponder a un usuario existente en Supabase
- El usuario debe poder iniciar sesión con su contraseña de Supabase (mismo login que en la web)
- Solo se verifica el email contra `.env`, la contraseña se valida con Supabase

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

El backoffice estará disponible en `http://localhost:5174`

## Autenticación

El backoffice usa un sistema de verificación de email + login de Supabase:

1. **Verificación de email**: Compara el email ingresado con `VITE_ADMIN_EMAIL` del `.env`
2. **Autenticación Supabase**: Si el email coincide, hace login normal en Supabase (mismo que en la web)
3. **Token JWT**: Usa el token de Supabase para autenticarse con el API

**Flujo:**
- Usuario ingresa email y contraseña
- Se verifica que el email coincida con `VITE_ADMIN_EMAIL`
- Si coincide, se intenta hacer login en Supabase con esas credenciales
- Si el login en Supabase es exitoso, se permite el acceso
- Solo usuarios con email que coincida con `VITE_ADMIN_EMAIL` pueden acceder al backoffice

## Estructura

```
backoffice/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.tsx          # Pantalla de login
│   │   └── ui/
│   │       └── ProtectedRoute.tsx # Protección de rutas
│   ├── lib/
│   │   ├── stores/
│   │   │   └── authStore.ts       # Store de autenticación
│   │   ├── supabase/
│   │   │   └── client.ts          # Cliente de Supabase
│   │   └── utils/
│   │       └── api.ts             # Utilidades para API
│   ├── pages/
│   │   └── Dashboard.tsx          # Panel principal
│   ├── types/
│   │   └── index.ts               # Tipos TypeScript
│   ├── App.tsx
│   └── main.tsx
└── .env                            # Variables de entorno
```

## Scripts

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción

