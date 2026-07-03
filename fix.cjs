const fs = require('fs');
let content = fs.readFileSync('src/components/RegisterView.tsx', 'utf8');

// Title typography
content = content.replace(
  /h2 className="text-2xl sm:text-3xl font-semibold text-\[\#262626\] mb-2"/g,
  'h2 className="text-2xl font-semibold text-[#262626] mb-2"'
);

// Subtitle typography
content = content.replace(
  /<p className="text-\\[#595959\\]">\n\s*TalentFlow Career System\n\s*<\/p>/m,
  '<p className="text-[#595959] text-sm mb-8">\n            TalentFlow Career System\n          </p>'
);

// Input type 1
content = content.replace(
  /className="w-full bg-gray-50\/50 border border-gray-200 rounded-2xl px-5 py-3\.5 text-\[\#262626\] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-\[\#262626\]\/20 focus:border-\[\#262626\] transition-all"/g,
  'className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"'
);

// Input type 2
content = content.replace(
  /className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-\[\#262626\] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-\[\#262626\]\/20 focus:border-\[\#262626\] transition-all"/g,
  'className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"'
);

// Select type 1
content = content.replace(
  /className="w-full bg-gray-50\/50 border border-gray-200 rounded-2xl px-5 py-3\.5 text-\[\#262626\] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-\[\#262626\]\/20 focus:border-\[\#262626\] transition-all appearance-none"/g,
  'className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all appearance-none"'
);

// Select type 2
content = content.replace(
  /className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-\[\#262626\] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-\[\#262626\]\/20 focus:border-\[\#262626\] transition-all appearance-none"/g,
  'className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all appearance-none"'
);

// Password Input
content = content.replace(
  /className="w-full bg-gray-50\/50 border border-gray-200 rounded-2xl px-5 py-3\.5 pr-12 text-\[\#262626\] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-\[\#262626\]\/20 focus:border-\[\#262626\] transition-all"/g,
  'className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 pr-12 text-[#262626] placeholder-gray-400 focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all"'
);

fs.writeFileSync('src/components/RegisterView.tsx', content);

console.log('Done!');