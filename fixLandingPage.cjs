const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

content = content.replace(
  /<motion\.div\n\s*initial=\{\{ opacity: 0, y: 20 \}\}\n\s*animate=\{\{ opacity: 1, y: 0 \}\}\n\s*transition=\{\{ duration: 0\.6, ease: "easeOut" \}\}\n\s*>/m,
  ''
);

content = content.replace(
  /<h1 className="text-5xl md:text-7xl font-semibold text-\[\#262626\] tracking-tight leading-\[1\.1\] mb-6">\n\s*Masa Depan Rekrutmen, <br className="hidden md:block" \/> Dimulai dari Sini\.\n\s*<\/h1>/m,
  `<motion.h1 
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-semibold text-[#262626] tracking-tight leading-[1.1] mb-6"
            >
              Masa Depan Rekrutmen, <br className="hidden md:block" /> Dimulai dari Sini.
            </motion.h1>`
);

content = content.replace(
  /<p className="text-lg md:text-xl text-\[\#595959\] max-w-2xl mx-auto leading-relaxed mb-10">\n\s*Platform asesmen kompetensi cerdas untuk mengukur potensi sejati kandidat melalui tes psikometri dan analisis data real-time, dirancang dengan antarmuka yang modern dan minimalis\.\n\s*<\/p>/m,
  `<motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[#595959] max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Platform asesmen kompetensi cerdas untuk mengukur potensi sejati kandidat melalui tes psikometri dan analisis data real-time, dirancang dengan antarmuka yang modern dan minimalis.
            </motion.p>`
);

content = content.replace(
  /<div className="flex flex-col sm:flex-row items-center justify-center gap-4">/m,
  `<motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >`
);

// Remove the closing tag of the removed motion.div
content = content.replace(
  /<\/button>\n\s*<\/div>\n\s*<\/motion\.div>/m,
  `</button>\n            </motion.div>`
);

fs.writeFileSync('src/components/LandingPage.tsx', content);