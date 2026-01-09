# ¿Dónde se almacenan los usuarios?

## Almacenamiento en dos lugares:

### 1. Supabase Auth (Autenticación)
- **Dónde**: En la base de datos de Supabase (en la nube)
- **Qué contiene**: Email, contraseña (hasheada), ID único, metadata
- **Cuándo se crea**: Al hacer clic en "Registrarse" en la web
- **Acceso**: Dashboard de Supabase > Authentication > Users

### 2. Archivo JSON local (Datos del perfil)
- **Dónde**: `api/data/users.json`
- **Qué contiene**: ID (referencia a Supabase), email, nombre, favoritos, fechas
- **Cuándo se crea**: Automáticamente la primera vez que accedes a `/profile` después de registrarte
- **Propósito**: Almacenar datos adicionales del perfil (favoritos, nombre, etc.)

## Flujo completo:

1. Usuario se registra en la web → Se crea en **Supabase Auth**
2. Usuario hace login → Supabase valida credenciales
3. Usuario accede a `/profile` → Backend crea entrada en `users.json` si no existe
4. Datos del perfil se guardan en `users.json` (favoritos, nombre, etc.)

## Ver usuarios en Supabase:

1. Ve a tu proyecto en Supabase Dashboard
2. Authentication > Users
3. Ahí verás todos los usuarios registrados
