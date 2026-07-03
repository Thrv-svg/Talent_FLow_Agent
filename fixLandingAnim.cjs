const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// More prominent animations
content = content.replace(
  /initial=\{\{ opacity: 0, y: 40, filter: 'blur\(10px\)' \}\}/,
  "initial={{ opacity: 0, y: 60, filter: 'blur(15px)', scale: 0.95 }}"
);
content = content.replace(
  /animate=\{\{ opacity: 1, y: 0, filter: 'blur\(0px\)' \}\}/,
  "animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}"
);
content = content.replace(
  /transition=\{\{ duration: 0.8, ease: \[0.16, 1, 0.3, 1\] \}\}/,
  "transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}"
);

// For text <p>
content = content.replace(
  /initial=\{\{ opacity: 0, y: 30 \}\}/,
  "initial={{ opacity: 0, y: 40 }}"
);
content = content.replace(
  /delay: 0.1/,
  "delay: 0.15"
);
content = content.replace(
  /duration: 0.8/,
  "duration: 1.2"
);

// For buttons
content = content.replace(
  /delay: 0.2/,
  "delay: 0.3"
);

// Scrollable Sections
content = content.replace(
  /initial=\{\{ opacity: 0, y: 40 \}\}/g,
  "initial={{ opacity: 0, y: 80 }}"
);
content = content.replace(
  /whileInView=\{\{ opacity: 1, y: 0 \}\}/g,
  "whileInView={{ opacity: 1, y: 0 }}\n          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}"
);

fs.writeFileSync('src/components/LandingPage.tsx', content);