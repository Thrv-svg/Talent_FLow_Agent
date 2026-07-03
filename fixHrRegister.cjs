const fs = require('fs');
let content = fs.readFileSync('src/components/CompanyRegisterView.tsx', 'utf8');

// Container & cards
content = content.replace(/rounded-3xl/g, 'rounded-[2rem]');

// Title typography
content = content.replace(
  /h2 className="text-2xl sm:text-3xl font-semibold text-\[\#262626\] mb-2"/g,
  'h2 className="text-2xl font-semibold text-[#262626] mb-2"'
);

// Subtitle typography
content = content.replace(
  /<p className="text-\\[#595959\\]">\n\s*TalentFlow Employer System\n\s*<\/p>/m,
  '<p className="text-[#595959] text-sm mb-8">\n            TalentFlow Employer System\n          </p>'
);

// Focus rings
content = content.replace(/focus:ring-2 focus:ring-\[\#262626\]\/20/g, 'focus:ring-1 focus:ring-[#262626]');

// Back button using onBack
content = content.replace(
  /<button \n\s*onClick=\{\(\) => navigate\('\/'\)\}\n\s*className="fixed top-6 left-6 flex items-center gap-2 bg-white\/80 backdrop-blur-md border border-gray-200 shadow-sm text-\[\#595959\] hover:text-\[\#262626\] hover:bg-gray-50 px-4 py-2 rounded-full transition-all text-sm font-medium cursor-pointer z-\[60\]"\n\s*>\n\s*<ArrowLeft className="w-4 h-4" \/> Kembali\n\s*<\/button>/g,
  `<button 
        type="button"
        onClick={(e) => { 
          e.preventDefault(); 
          if(onBack) onBack();
          navigate('/'); 
        }}
        className="group flex items-center gap-2.5 bg-white/50 backdrop-blur-md border border-gray-200/80 shadow-sm text-[#595959] hover:text-[#262626] hover:bg-white px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium z-50 fixed top-6 left-6"
      >
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali
      </button>`
);

fs.writeFileSync('src/components/CompanyRegisterView.tsx', content);