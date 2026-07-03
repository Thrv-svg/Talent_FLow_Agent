import fs from 'fs';

const filePath = 'src/components/TalentCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace dark colors
content = content.replace(/bg-\[\#0a0f1c\]/g, 'bg-white');
content = content.replace(/border-\[\#1f2d45\]/g, 'border-gray-200');
content = content.replace(/bg-\[\#111827\]/g, 'bg-gray-50');
content = content.replace(/bg-\[\#051c17\]/g, 'bg-emerald-50');
content = content.replace(/border-emerald-500\/30/g, 'border-emerald-200');

// Fix text colors
content = content.replace(/text-zinc-500/g, 'text-gray-500');
content = content.replace(/text-zinc-400/g, 'text-gray-600');
content = content.replace(/text-blue-200/g, 'text-gray-800');
content = content.replace(/text-emerald-100/g, 'text-emerald-900');
content = content.replace(/text-emerald-300/g, 'text-emerald-700');
content = content.replace(/text-indigo-400/g, 'text-indigo-600');
content = content.replace(/text-emerald-400/g, 'text-emerald-600');
content = content.replace(/text-indigo-500/g, 'text-indigo-600');
content = content.replace(/text-rose-400/g, 'text-rose-600');
content = content.replace(/text-teal-400/g, 'text-teal-600');
content = content.replace(/text-purple-400/g, 'text-purple-600');
content = content.replace(/text-blue-400/g, 'text-blue-600');

// Fix buttons that became dark
content = content.replace(/bg-\[\#111827\] hover:bg-white text-gray-800/g, 'bg-white hover:bg-gray-50 text-gray-600');

fs.writeFileSync(filePath, content);
