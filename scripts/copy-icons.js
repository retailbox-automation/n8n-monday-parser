const fs = require('fs');
const path = require('path');

// Путь к исходной иконке
const srcPath = path.join(__dirname, '..', 'nodes', 'MondayParser', 'mondayparser.svg');
// Путь для копирования иконки
const destPath = path.join(__dirname, '..', 'dist', 'mondayparser.svg');

try {
  // Создаем папку dist если её нет
  const distDir = path.dirname(destPath);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Копируем файл
  fs.copyFileSync(srcPath, destPath);
  console.log('✅ Иконка успешно скопирована');
} catch (error) {
  console.error('❌ Ошибка при копировании иконки:', error.message);
  process.exit(1);
} 