const fs = require('fs');
const path = require('path');

(async () => {
  const { illustrations } = await import('../src/illustrations.js');
  const outDir = path.join(__dirname, '..', 'assets', 'words');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let count = 0;
  for (const [key, svgString] of Object.entries(illustrations)) {
    const filePath = path.join(outDir, `${key}.svg`);
    fs.writeFileSync(filePath, svgString.trim(), 'utf8');
    count++;
  }

  console.log(`Successfully exported ${count} word SVG files to assets/words/`);
})();
