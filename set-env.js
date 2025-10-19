// set-env.js
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const targetPath = resolve(__dirname, './src/environment/environment.prod.ts');

const envFileContent = `export const environment = {
  production: true,
  supabaseUrl: _NGX_ENV_.NG_APP_PUBLIC_SUPABASE_URL,
  supabaseKey: _NGX_ENV_.NG_APP_PUBLIC_SUPABASE_ANON_KEY,
};
`;

writeFileSync(targetPath, envFileContent);
console.log('✅ Archivo environment.prod.ts actualizado con variables de Netlify');
