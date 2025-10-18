// set-env.js
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const targetPath = resolve(__dirname, './src/environment/environment.prod.ts');

const envFileContent = `
export const environment = {
  production: true,
  supabaseUrl: '${process.env.NG_APP_SUPABASE_URL}',
  supabaseKey: '${process.env.NG_APP_SUPABASE_KEY}',
};
`;

writeFileSync(targetPath, envFileContent);
console.log('✅ Archivo environment.prod.ts actualizado con variables de Netlify');
