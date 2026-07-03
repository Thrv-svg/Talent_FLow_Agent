import fs from 'fs';
import path from 'path';

function applyMatrix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Root background in App.tsx
  if (path.basename(filePath) === 'App.tsx') {
    content = content.replace(/className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans"/, 
      'className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col font-sans transition-colors duration-300 ease-in-out"');
  }

  // Generic replacements using splits and maps to handle exact classes safely avoiding dupes
  
  const replaceClass = (str, oldClass, newClass) => {
      // Find oldClass, if not followed by newClass
      const regex = new RegExp(`\\b${oldClass}\\b(?!\\s+${newClass.replace(/\//g,'\\/')})`, 'g');
      return str.replace(regex, `${oldClass} ${newClass}`);
  };

  content = replaceClass(content, 'bg-white', 'dark:bg-gray-800 transition-colors duration-300 ease-in-out');
  content = replaceClass(content, 'bg-gray-50', 'dark:bg-gray-900 transition-colors duration-300 ease-in-out');
  content = replaceClass(content, 'border-gray-200', 'dark:border-gray-700');
  content = replaceClass(content, 'text-gray-900', 'dark:text-white transition-colors duration-300 ease-in-out');
  content = replaceClass(content, 'text-gray-500', 'dark:text-gray-400 transition-colors duration-300 ease-in-out');
  content = replaceClass(content, 'text-gray-600', 'dark:text-gray-400 transition-colors duration-300 ease-in-out');
  content = replaceClass(content, 'bg-gray-100', 'dark:bg-gray-700 transition-colors duration-300 ease-in-out');

  // fix any messy consecutive transitions
  content = content.replace(/(transition-colors duration-300 ease-in-out\s*)+/g, 'transition-colors duration-300 ease-in-out ');

  fs.writeFileSync(filePath, content);
  console.log('Fixed', filePath);
}

function processAll() {
  const dirs = ['./src/components', './src'];
  dirs.forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isFile() && fullPath.endsWith('.tsx')) {
        applyMatrix(fullPath);
      }
    });
  });
}

processAll();
