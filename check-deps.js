#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Список зависимостей, которые следует избегать или заменить
const problematicDeps = {
  'lodash': 'Используйте отдельные методы из lodash или нативные методы ES6',
  'moment': 'Замените на dayjs (у вас уже установлен) для меньшего размера бандла',
  'jquery': 'Используйте нативные методы DOM',
  'underscore': 'Используйте методы ES6 или lodash при необходимости',
  'core-js': 'Используйте только необходимые полифилы вместо всего пакета',
  'axios': 'Можно заменить на fetch с небольшой оберткой',
  'react-redux': 'Рассмотрите использование React Context API или Zustand',
  'styled-components': 'Может повлиять на размер бандла, рассмотрите CSS-in-JS альтернативы'
};

// Получаем зависимости из package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

// Проверяем на проблемные зависимости
console.log('\n🔍 Анализ зависимостей проекта...\n');
let foundProblematic = false;

Object.keys(dependencies).forEach(dep => {
  if (problematicDeps[dep]) {
    console.log(`⚠️  ${dep} - Рекомендация: ${problematicDeps[dep]}`);
    foundProblematic = true;
  }
});

if (!foundProblematic) {
  console.log('✅ Не найдено проблемных зависимостей из стандартного списка.\n');
}

// Анализ на большие зависимости
console.log('\n📊 Анализ размера установленных зависимостей...\n');

try {
  // Получаем размер node_modules
  const { stdout: sizeOutput } = execSync('du -sh ./node_modules', { encoding: 'utf8' });
  console.log(`📦 Общий размер node_modules: ${sizeOutput.trim()}`);
  
  // Получаем ТОП-10 самых больших пакетов
  console.log('\n🏆 ТОП-10 самых больших пакетов:');
  const { stdout: topPackages } = execSync(
    'find ./node_modules -type d -maxdepth 2 | xargs du -s | sort -rn | head -10',
    { encoding: 'utf8' }
  );
  
  // Форматируем вывод для лучшей читаемости
  const formattedPackages = topPackages
    .split('\n')
    .filter(line => line.includes('node_modules/'))
    .map(line => {
      const [size, path] = line.split('\t');
      const packageName = path.replace('./node_modules/', '');
      // Конвертируем в МБ для лучшей читаемости
      const sizeInMB = (parseInt(size) / 1024).toFixed(2);
      return `${packageName}: ${sizeInMB} MB`;
    });
  
  formattedPackages.forEach(pkg => console.log(`  ${pkg}`));
  
} catch (error) {
  console.error('Не удалось проанализировать размер зависимостей:', error.message);
}

console.log('\n🔎 Анализ на неиспользуемые зависимости...');
console.log('Для полного анализа неиспользуемых зависимостей рекомендуется использовать утилиту depcheck\n');
console.log('  yarn add -D depcheck');
console.log('  npx depcheck\n');

console.log('📝 Рекомендации по оптимизации:');
console.log('1. Используйте динамические импорты для разделения кода');
console.log('2. Заменяйте большие библиотеки на меньшие альтернативы');
console.log('3. Используйте анализаторы бандла, такие как webpack-bundle-analyzer');
console.log('4. Рассмотрите возможность использования pnpm для оптимизации хранения зависимостей');
