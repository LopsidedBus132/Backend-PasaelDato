const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, './firebase-key.json');
const envPath = path.join(__dirname, './.env');

const json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

function escapeValue(key, value) {
  if (key === 'private_key') {
    return `"${value.replace(/\n/g, '\\n')}"`
  }
  return `"${value}"`;
}

const envContent = Object.entries(json)
  .map(([key, value]) => `FIREBASE_${key.toUpperCase()}=${escapeValue(key, value)}`)
  .join('\n');

fs.writeFileSync(envPath, envContent);
console.log('.env generado con éxito desde firebase-key.json');
