import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Background and Surface Replaces (Dark to Light)
  content = content.replace(/bg-\[\#070a13\]/g, 'bg-gray-50');
  content = content.replace(/bg-slate-custom-900/g, 'bg-gray-50');
  content = content.replace(/bg-slate-900\/65/g, 'bg-white');
  content = content.replace(/bg-slate-900\/40/g, 'bg-gray-50');
  content = content.replace(/bg-slate-900/g, 'bg-white');
  content = content.replace(/bg-slate-800/g, 'bg-white');
  content = content.replace(/bg-slate-800\/50/g, 'bg-gray-50');
  content = content.replace(/bg-black\/60/g, 'bg-white');
  content = content.replace(/bg-black\/40/g, 'bg-gray-50');
  content = content.replace(/bg-white\/5/g, 'bg-gray-100');
  content = content.replace(/bg-white\/10/g, 'bg-gray-200');

  // Text Color Replaces
  content = content.replace(/text-slate-100/g, 'text-gray-900');
  content = content.replace(/text-slate-200/g, 'text-gray-900');
  content = content.replace(/text-slate-300/g, 'text-gray-800');
  content = content.replace(/text-white/g, 'text-gray-900'); 
  content = content.replace(/text-slate-400/g, 'text-gray-600');
  content = content.replace(/text-slate-500/g, 'text-gray-500');
  content = content.replace(/text-slate-550/g, 'text-gray-500');
  
  // Brand color replaces
  content = content.replace(/text-amber-500/g, 'text-indigo-600');
  content = content.replace(/text-amber-400/g, 'text-indigo-500');
  content = content.replace(/text-amber-300/g, 'text-indigo-400');
  content = content.replace(/hover:text-amber-400/g, 'hover:text-indigo-500');
  content = content.replace(/focus:border-amber-500/g, 'focus:border-indigo-500');
  content = content.replace(/focus:ring-amber-500\/10/g, 'focus:ring-indigo-500\/20');
  
  content = content.replace(/bg-amber-500/g, 'bg-indigo-600 text-white'); 
  content = content.replace(/hover:bg-amber-400/g, 'hover:bg-indigo-700');
  content = content.replace(/bg-amber-500\/10/g, 'bg-indigo-600\/10');
  content = content.replace(/bg-amber-500\/20/g, 'bg-indigo-600\/20');
  content = content.replace(/from-amber-500/g, 'from-indigo-600');
  content = content.replace(/via-amber-300/g, 'via-indigo-500');
  content = content.replace(/to-amber-500/g, 'to-indigo-600');
  
  content = content.replace(/text-slate-950/g, 'text-white'); 
  content = content.replace(/text-gray-900\/80/g, 'text-gray-100/80');

  // Borders
  content = content.replace(/border-white\/15/g, 'border-gray-300');
  content = content.replace(/border-white\/10/g, 'border-gray-200');
  content = content.replace(/border-slate-800/g, 'border-gray-200');
  content = content.replace(/border-slate-700/g, 'border-gray-300');

  // Specific fix for white text inside buttons (now that we broke them by replacing text-white)
  // Actually bg-indigo-600 has text-white added.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      replaceInFile(filePath);
    }
  }
}

walkDir('./src/components');
walkDir('./src');
