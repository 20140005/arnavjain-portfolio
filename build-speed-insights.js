// Simple script to copy the Speed Insights browser module
const fs = require('fs');
const path = require('path');

// Copy the browser-ready module to a public location
const source = path.join(__dirname, 'node_modules/@vercel/speed-insights/dist/index.mjs');
const dest = path.join(__dirname, 'speed-insights-bundle.js');

fs.copyFileSync(source, dest);
console.log('Speed Insights bundle created successfully');
