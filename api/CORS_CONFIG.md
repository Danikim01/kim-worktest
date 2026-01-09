# Configuración de CORS

El API ahora soporta múltiples orígenes para permitir tanto el frontend web como el backoffice.

## Configuración

### Opción 1: Usar valores por defecto (recomendado para desarrollo)

Si no configuras `CORS_ORIGINS` en el `.env`, el servidor permitirá automáticamente:
- `http://localhost:5173` (Frontend web)
- `http://localhost:5174` (Backoffice)

### Opción 2: Configurar manualmente

En `api/.env`, puedes especificar múltiples orígenes separados por comas:

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### Para producción

```env
CORS_ORIGINS=https://tu-dominio-web.com,https://backoffice.tu-dominio.com
```

## Notas

- Los orígenes deben estar separados por comas
- No incluyas espacios después de las comas (o serán parte del origen)
- El servidor también permite requests sin origen (para apps móviles o curl)

