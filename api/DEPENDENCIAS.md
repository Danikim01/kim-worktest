# Roles y Sistema de Inyección de Dependencias

## 1. Sistema de Inyección de Dependencias

### Arquitectura

El backend ahora usa un sistema de inyección de dependencias que permite cambiar fácilmente entre diferentes implementaciones de almacenamiento de datos.

### Estructura

```
api/src/
├── repositories/
│   ├── IDataRepository.ts          # Interface/contrato
│   └── FileDataRepository.ts       # Implementación actual (JSON)
├── services/
│   └── container.ts                # Contenedor de dependencias
└── controllers/                     # Usan container.dataRepository
```

### Cómo cambiar de JSON a PostgreSQL

1. **Crear nueva implementación:**
   ```typescript
   // api/src/repositories/PostgresDataRepository.ts
   import { IDataRepository } from './IDataRepository';
   import { Pool } from 'pg';
   
   export class PostgresDataRepository implements IDataRepository {
     private pool: Pool;
     
     constructor() {
       this.pool = new Pool({
         connectionString: process.env.DATABASE_URL
       });
     }
     
     async getAllShows(): Promise<Show[]> {
       const result = await this.pool.query('SELECT * FROM shows');
       return result.rows;
     }
     
     // ... implementar todos los métodos de IDataRepository
   }
   ```

2. **Actualizar el contenedor:**
   ```typescript
   // api/src/services/container.ts
   import { PostgresDataRepository } from '../repositories/PostgresDataRepository';
   
   constructor() {
     // Cambiar esta línea:
     this._dataRepository = new PostgresDataRepository();
   }
   ```

3. **¡Listo!** Todos los controladores seguirán funcionando sin cambios.

### Ventajas

- ✅ Fácil cambio de base de datos
- ✅ Código desacoplado
- ✅ Fácil de testear (puedes crear un MockRepository)
- ✅ Un solo punto de cambio

---

## Ejemplo: Cambiar a PostgreSQL

1. Instalar dependencias:
   ```bash
   npm install pg @types/pg
   ```

2. Crear `PostgresDataRepository.ts` implementando `IDataRepository`

3. Actualizar `container.ts` para usar `PostgresDataRepository`

4. Configurar `DATABASE_URL` en `.env`

5. ¡Sin cambios en controladores ni rutas!

