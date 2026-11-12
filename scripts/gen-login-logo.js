// scripts/gen-login-logo.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.resolve(__dirname, '..', 'assets', 'master-logo-1024.png');
const OUT = path.resolve(__dirname, '..', 'assets');

const targets = [
  { name: 'logo.png', size: 72 },
  { name: 'logo@2x.png', size: 144 },
  { name: 'logo@3x.png', size: 216 },
];

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error('✖ Source not found:', SRC);
    process.exit(1);
  }
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  for (const t of targets) {
    const dst = path.join(OUT, t.name);
    await sharp(SRC)
      .resize(t.size, t.size, { fit: 'contain' })
      .png()
      .toFile(dst);
    console.log('✓', dst);
  }
  console.log('All login logo variants generated.');
})();
