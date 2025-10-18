const fs = require('fs');
const path = require('path');

/**
 * Script para sincronizar archivos de traducción desde src/locale a public/assets/locale
 * Esto asegura que los archivos de traducción estén disponibles para el servicio de traducción
 */

const sourceDir = path.join(__dirname, '../src/locale');
const targetDir = path.join(__dirname, '../public/assets/locale');

// Crear el directorio de destino si no existe
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Archivos de traducción a sincronizar
const translationFiles = [
  'messages.es.xlf',
  'messages.en.xlf',
  'messages.xlf'
];

console.log('🔄 Sincronizando archivos de traducción...');

translationFiles.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ ${file} sincronizado correctamente`);
    } catch (error) {
      console.error(`❌ Error sincronizando ${file}:`, error.message);
    }
  } else {
    console.warn(`⚠️  Archivo no encontrado: ${sourcePath}`);
  }
});

console.log('✨ Sincronización de traducciones completada');
