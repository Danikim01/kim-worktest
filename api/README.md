# Event Ticketing API

Backend API for the event ticketing application built with Express, TypeScript, and Supabase.

## Features

- RESTful API for managing shows, purchases, and users
- Authentication via Supabase JWT tokens
- Role-based access control (user, backoffice, admin)
- QR code generation for tickets
- Dependency injection for easy database switching
- File-based JSON storage (easily switchable to PostgreSQL, MongoDB, etc.)

## Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

3. Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Shows

- `GET /api/shows` - List all shows (with optional filters: `?ciudad=`, `?fecha=`, `?artista=`)
- `GET /api/shows/:id` - Get show by ID
- `POST /api/shows` - Create show (Admin only)
- `PUT /api/shows/:id` - Update show (Admin only)
- `DELETE /api/shows/:id` - Delete show (Admin only)

### Purchases

- `GET /api/purchases` - Get current user's purchases (Auth required)
- `GET /api/purchases/:id` - Get purchase by ID (Auth required)
- `POST /api/purchases` - Create purchase/checkout (Auth required)
- `GET /api/purchases/admin/all` - Get all purchases (Backoffice/Admin only)

### Users

- `GET /api/users/me` - Get current user profile (Auth required)
- `PUT /api/users/me` - Update current user profile (Auth required)
- `POST /api/users/me/favoritos/:showId` - Add show to favorites (Auth required)
- `DELETE /api/users/me/favoritos/:showId` - Remove show from favorites (Auth required)
- `GET /api/users/admin/all` - Get all users (Backoffice/Admin only)

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <supabase_jwt_token>
```

## Role-Based Access Control

### Roles

- **`user`**: Default role for web users (can only access web app)
- **`backoffice`**: Backoffice users (can access both web and backoffice)
- **`admin`**: Administrators (full access to everything)

### Setting Roles in Supabase

1. Go to Supabase Dashboard > Authentication > Users
2. Select the user
3. Click "Edit user"
4. In "User Metadata", add:
   ```json
   {
     "role": "backoffice"  // or "admin"
   }
   ```

See `ROLES_Y_DEPENDENCIAS.md` for detailed information.

## Dependency Injection

The API uses dependency injection for data storage. To switch from JSON to PostgreSQL:

1. Create `PostgresDataRepository` implementing `IDataRepository`
2. Update `services/container.ts` to use the new repository
3. No changes needed in controllers!

See `ROLES_Y_DEPENDENCIAS.md` for detailed information.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - Type check without building
