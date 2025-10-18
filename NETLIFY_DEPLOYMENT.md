# Guía de Despliegue en Netlify - CoffeeJournal

## Configuración de Variables de Entorno

Para mantener la seguridad, las credenciales de Supabase se configuran como variables de entorno.

### Variables Requeridas

1. **NG_APP_SUPABASE_URL**
   - Valor: Tu URL de Supabase
   - Ejemplo: `https://tu-proyecto.supabase.co`

2. **NG_APP_SUPABASE_KEY**
   - Valor: Tu clave anónima de Supabase
   - Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Para Desarrollo Local

1. **Crea un archivo `.env`** en la raíz del proyecto:
```bash
NG_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
NG_APP_SUPABASE_KEY=tu-clave-anonima-aqui
```

2. **El archivo `.env` ya está en `.gitignore`** para mantener las credenciales seguras

### Para Producción (Netlify)

1. **Accede a tu dashboard de Netlify**
2. **Selecciona tu sitio**
3. **Ve a Site settings > Environment variables**
4. **Agrega las variables:**
   - Click en "Add variable"
   - Nombre: `NG_APP_SUPABASE_URL`
   - Valor: Tu URL de Supabase
   - Repite para `NG_APP_SUPABASE_KEY`

### Pasos para el Despliegue

1. **Conecta tu repositorio:**
   - En Netlify, click en "New site from Git"
   - Conecta tu repositorio de GitHub/GitLab/Bitbucket

2. **Configura el build:**
   - Build command: `npm run build`
   - Publish directory: `dist/CoffeeJournal/browser`
   - Node version: `20`

3. **Configura las variables de entorno** (como se describe arriba)

4. **Despliega:**
   - Click en "Deploy site"
   - Netlify construirá y desplegará automáticamente

### Archivos de Configuración Incluidos

- `netlify.toml`: Configuración principal de Netlify
- `public/_redirects`: Redirecciones para SPA routing
- `src/environment/environment.prod.ts`: Variables de entorno para producción

### Notas Importantes

- Las variables de entorno deben comenzar con `NG_APP_` para que Angular las reconozca
- Asegúrate de que tu proyecto de Supabase tenga las políticas RLS configuradas correctamente
- El archivo `netlify.toml` ya está configurado con headers de seguridad y optimizaciones de caché

### Troubleshooting

Si tienes problemas:

1. **Verifica las variables de entorno** en el dashboard de Netlify
2. **Revisa los logs de build** en la sección "Deploys"
3. **Asegúrate de que el directorio de publish** sea `dist/CoffeeJournal/browser`
4. **Verifica que Node.js versión 20** esté configurada
