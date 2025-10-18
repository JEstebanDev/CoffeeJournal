# Variables de Entorno para Netlify

## 🔧 Configuración en Netlify Dashboard

### Paso 1: Acceder a Environment Variables
1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio CoffeeJournal
3. Ve a **Site settings** > **Environment variables**

### Paso 2: Agregar las Variables
Agrega estas dos variables:

#### Variable 1:
- **Key**: `NG_APP_SUPABASE_URL`
- **Value**: `https://hhihxgepnxcidzxedbdr.supabase.co`

#### Variable 2:
- **Key**: `NG_APP_SUPABASE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoaWh4Z2VwbnhjaWR6eGVkYmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzQyMDAsImV4cCI6MjA3NTYxMDIwMH0.AwQQZ5oyTfK_1_NjJNX1Kn9-1H_IqhwkFbvPgk82Uzg`

### Paso 3: Guardar y Redesplegar
1. Click en **Save**
2. Ve a **Deploys** y haz **Trigger deploy** > **Deploy site**

## ✅ Verificación

Después del despliegue, las variables se inyectarán automáticamente durante el build usando `ngx-env-builder`.

### Cómo Funciona:
- **Desarrollo local**: Usa el archivo `.env` (ya creado)
- **Producción (Netlify)**: 
  1. El script `set-env.js` lee las variables de entorno de Netlify
  2. Genera el archivo `environment.prod.ts` con las credenciales
  3. Angular usa este archivo durante el build
- **El código**: Siempre usa las variables del archivo de environment correspondiente

## 🔒 Seguridad

- ✅ Las credenciales NO están en el código fuente
- ✅ El archivo `.env` está en `.gitignore`
- ✅ Las variables se inyectan solo durante el build
- ✅ Las credenciales están seguras en Netlify
