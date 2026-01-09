# Verificación de Compras

## Cómo verificar que las compras se guardan correctamente

1. **Hacer una compra desde el frontend:**
   - Inicia sesión en la web
   - Ve a un evento y selecciona tickets
   - Agrega al carrito
   - Procede al checkout
   - Completa la compra

2. **Verificar en el backend (terminal):**
   - Deberías ver logs como:
     - `📝 Creating purchase: {...}`
     - `✅ Purchase saved to purchases.json: {...}`
     - `💾 File written to: /path/to/api/data/purchases.json`

3. **Verificar el archivo:**
   ```bash
   cd api
   cat data/purchases.json
   ```

   Deberías ver un array con objetos como:
   ```json
   [
     {
       "id": "uuid",
       "user_id": "supabase-user-id",
       "show_id": "show-uuid",
       "cantidad": 1,
       "fecha_compra": "2025-01-09T...",
       "qr_code": "data:image/png;base64,...",
       "estado": "confirmado",
       "created_at": "2025-01-09T...",
       "ticket_type": "platea_baja"
     }
   ]
   ```

## Estructura esperada de una compra

- `id`: UUID único
- `user_id`: ID del usuario de Supabase
- `show_id`: ID del evento
- `cantidad`: Cantidad de tickets (siempre 1 por compra individual)
- `fecha_compra`: Timestamp ISO
- `qr_code`: Base64 data URL del código QR
- `estado`: "confirmado"
- `created_at`: Timestamp ISO
- `ticket_type`: "platea_baja" | "platea_alta" | "campo" (opcional)
