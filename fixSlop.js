  import fs from 'fs';
  import path from 'path';

  function fixSlop(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/bg-slate-950/g, 'bg-gray-50');
    content = content.replace(/placeholder-slate-600/g, 'placeholder-gray-400');
    content = content.replace(/border-slate-805/g, 'border-gray-200');
    content = content.replace(/border-slate-[0-9]+\/?[0-9]*/g, 'border-gray-200');
    content = content.replace(/bg-slate-100/g, 'bg-gray-100');
    content = content.replace(/text-slate-[a-zA-Z0-9]+/g, 'text-gray-500');
    content = content.replace(/hover:text-slate-[a-zA-Z0-9]+/g, 'hover:text-gray-600');
    content = content.replace(/bg-slate-[0-9]+\/?[0-9]*/g, 'bg-white');
    content = content.replace(/hover:bg-slate-700/g, 'hover:bg-gray-100');
    content = content.replace(/bg-gray-1000/g, 'bg-gray-100');

    fs.writeFileSync(filePath, content);
  }

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        walkDir(filePath);
      } else if (filePath.endsWith('.tsx')) {
        fixSlop(filePath);
      }
    }
  }

  walkDir('./src/components');
  walkDir('./src');
