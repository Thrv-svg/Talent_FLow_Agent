import fs from 'fs';
import path from 'path';

function fixLightShadowsAndText(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix deep shadows
  content = content.replace(/rgba\(0,0,0,0\.8\)/g, 'rgba(0,0,0,0.1)');
  content = content.replace(/rgba\(0,0,0,0\.6\)/g, 'rgba(0,0,0,0.05)');
  
  // Remaining texts
  content = content.replace(/text-slate-900/g, 'text-gray-900');
  content = content.replace(/text-slate-800/g, 'text-gray-800');
  content = content.replace(/text-slate-700/g, 'text-gray-700');
  
  // Specific input classes
  content = content.replace(/focus:border-indigo-500 text-gray-900/g, 'focus:border-indigo-500 text-gray-900 bg-white');

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
    } else if (filePath.endsWith('.tsx')) {
      fixLightShadowsAndText(filePath);
    }
  }
}

walkDir('./src/components');
