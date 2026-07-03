import fs from 'fs';

const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/hover:bg-slate-700/g, 'hover:bg-gray-100');
content = content.replace(/placeholder-slate-600/g, 'placeholder-gray-400');
content = content.replace(/text-slate-350/g, 'text-gray-500');
content = content.replace(/text-slate-405/g, 'text-gray-500');
content = content.replace(/text-slate-450/g, 'text-gray-500');
content = content.replace(/text-slate-600/g, 'text-gray-500');

fs.writeFileSync(filePath, content);
