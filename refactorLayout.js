import fs from 'fs';

const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix overall page background
content = content.replace(/className="min-h-screen bg-slate-950 text-gray-900 flex flex-col font-sans"/g, 
  'className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans"');

// 2. Fix Header
// Remove the ugly `<nav className="hidden md:flex items-center gap-1.5 text-xs text-gray-600"> ... </nav>` block from the top header.
// It starts at `<nav className="hidden md:flex...` and ends before `{/* User badge + premium swift switch */}`
const topNavRegex = /<\!-- Nav icon bars \(LinkedIn style\) -->[\s\S]*?<\/nav>/;
const navContentMatch = content.match(topNavRegex);

let sidebarNav = '';
if (navContentMatch) {
  // We extract and transform it for the sidebar.
  sidebarNav = `
            {/* SIDEBAR NAVIGATION */}
            <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm hidden md:flex flex-col gap-1">
              <button onClick={() => { setActiveTab('home'); setActiveSubPsych('none'); }} className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm \${activeTab === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}>
                <Home className="w-4 h-4 shrink-0" /> Dashboard
              </button>
              <button onClick={() => { setActiveTab('academic'); setActiveSubPsych('none'); }} className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm \${activeTab === 'academic' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}>
                <BookOpen className="w-4 h-4 shrink-0" /> Kuis Akademis
              </button>
              <button onClick={() => { setActiveTab('psychology'); setActiveSubPsych('none'); }} className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm \${activeTab === 'psychology' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}>
                <Brain className="w-4 h-4 shrink-0" /> Psikotes Mandiri
              </button>
              <button onClick={() => { setActiveTab('internship'); setActiveSubPsych('none'); }} className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm \${activeTab === 'internship' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}>
                <Briefcase className="w-4 h-4 shrink-0" /> Magang Terbuka
              </button>
              <button onClick={() => { setActiveTab('leaderboard'); setActiveSubPsych('none'); }} className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm \${activeTab === 'leaderboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}>
                <Trophy className="w-4 h-4 shrink-0" /> Klasemen
              </button>
              <button onClick={() => { setActiveTab('career'); setActiveSubPsych('none'); }} className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm \${activeTab === 'career' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}>
                <Compass className="w-4 h-4 shrink-0" /> Roadmap
              </button>
              <button onClick={() => { setActiveTab('movies'); setActiveSubPsych('none'); }} className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm \${activeTab === 'movies' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}>
                <Film className="w-4 h-4 shrink-0" /> Minat Film
              </button>
              {profile.role === 'hr' && (
                <button onClick={() => { setActiveTab('hrd'); setActiveSubPsych('none'); }} className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm \${activeTab === 'hrd' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}>
                  <Eye className="w-4 h-4 shrink-0" /> Monitor HRD
                </button>
              )}
              {(profile.role === 'hr' || profile.role === 'perusahaan') && (
                <button onClick={() => setAuthState('company_dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm text-indigo-600 hover:bg-indigo-50 mt-2 border border-indigo-100">
                  <Briefcase className="w-4 h-4 shrink-0" /> Company Dashboard
                </button>
              )}
            </div>
`;
  content = content.replace(topNavRegex, '');
}

// 3. Fix Top Header classes to be solid white and removed dark classes
content = content.replace(/<header className="sticky top-0 z-40 bg-\[\#0a0f1d\] backdrop-blur-md w-full flex flex-col shadow-lg shadow-black\/20">/, 
                          '<header className="sticky top-0 z-40 bg-white w-full flex flex-col shadow-sm border-b border-gray-200">');
content = content.replace(/<div className="py-3\.5 border-b border-slate-850\/80 w-full">/, '<div className="py-3.5 w-full">');
content = content.replace(/<div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 overflow-x-auto overflow-y-hidden \[scrollbar-width:none\] \[-ms-overflow-style:none\] \[\&::-webkit-scrollbar\]:hidden">/, '<div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6">');

// Lighten up the upper HR dash mobile nav 
content = content.replace(/<nav className="md:hidden relative w-full flex items-center justify-around py-2 text-\[10px\] text-gray-500 px-2 border-t border-slate-850\/80 bg-\[\#0a0f1d\]">/g, 
  '<nav className="md:hidden sticky bottom-0 z-50 w-full flex items-center justify-around py-3 text-xs text-gray-500 px-2 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">');

content = content.replace(/{activeTab === 'home' \? 'text-teal-400'/g, "{activeTab === 'home' ? 'text-indigo-600 font-medium'");
content = content.replace(/{activeTab === 'academic' \? 'text-teal-400'/g, "{activeTab === 'academic' ? 'text-indigo-600 font-medium'");
content = content.replace(/{activeTab === 'psychology' \? 'text-teal-400'/g, "{activeTab === 'psychology' ? 'text-indigo-600 font-medium'");
content = content.replace(/{activeTab === 'internship' \? 'text-teal-400'/g, "{activeTab === 'internship' ? 'text-indigo-600 font-medium'");

// Remove `{activeTab === 'home' && (` wrap around left column.
// We'll replace `<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">` ... and the left column layout.
const layoutSplitRegex = /<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">[\s\S]*?{activeTab === 'home' && \([\s\S]*?<div className="lg:col-span-3 space-y-5">/m;
const layoutSplitMatch = content.match(layoutSplitRegex);

if (layoutSplitMatch) {
  content = content.replace(layoutSplitRegex, `<div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
          
          {/* ========================================================
              LEFT COLUMN: SIDEBAR NAV & PROFILE (30% -> col-span-3)
              ======================================================== */}
          <div className="lg:col-span-3 space-y-6">
            ${sidebarNav}`);
}

// Right column is probably `lg:col-span-9`. We need to find `</div>` that closes left column, and remove `)}`.
// Wait, the easiest way is to find `<div className="lg:col-span-9 space-y-5">` and replace it with `<div className="lg:col-span-7 space-y-6">`.

content = content.replace(/<div className="lg:col-span-9 space-y-5">/g, '<div className="lg:col-span-7 space-y-6">');
// Removing the `)}` that closed `{activeTab === 'home' && (`
// It was right before `          <div className="lg:col-span-9 space-y-5">`
content = content.replace(/}\)\s*<div className="lg:col-span-7 space-y-6">/, '<div className="lg:col-span-7 space-y-6">');

// Colors inside the profile card
content = content.replace(/bg-slate-950/g, 'bg-gray-50');
content = content.replace(/bg-slate-900/g, 'bg-white');
content = content.replace(/border-slate-805/g, 'border-gray-200');
content = content.replace(/border-slate-850/g, 'border-gray-200');
content = content.replace(/text-gray-800/g, 'text-gray-900'); 
content = content.replace(/bg-gray-1000/g, 'bg-gray-100');

// Typography enforcements on headings
content = content.replace(/className="text-md font-bold text-gray-900 font-display"/g, 'className="text-xl font-bold text-gray-900"');
content = content.replace(/className="text-lg font-bold text-gray-[0-9]+"/g, 'className="text-xl font-bold text-gray-900"');

// Fix the padding in cards to be p-6, we can look for `p-4 pt-10` or general `p-4` or `p-5`
content = content.replace(/className="p-4 pt-10/g, 'className="p-6 pt-10');

// Also remove the `light-mode` script adding because we're just light mode now.
content = content.replace(/document.documentElement.classList.add\('light-mode'\);/g, "");

fs.writeFileSync('src/App.tsx', content);

