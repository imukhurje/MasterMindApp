// scripts/patch-pusher.js
const fs = require('fs');
const path = require('path');

function stripMap(file) {
  if (!fs.existsSync(file)) return;
  const src = fs.readFileSync(file, 'utf8');
  const out = src.replace(/\/\/#\s*sourceMappingURL=pusher\.js\.map\s*$/m, '');
  if (out !== src) {
    fs.writeFileSync(file, out, 'utf8');
    console.log('[patch-pusher] stripped sourceMappingURL in', file);
  }
}

stripMap(path.join(__dirname, '..', 'node_modules', 'pusher-js', 'dist', 'react-native', 'pusher.js'));
