
const fs = require('fs');
const archiver = require('archiver');

// Create a write stream for our zip
const output = fs.createWriteStream('source-code.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

// Listen for archive events
output.on('close', () => {
  console.log('Source code has been zipped!');
  console.log('The zip file is in: source-code.zip');
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the output file
archive.pipe(output);

// Add source code files while excluding binary and build files
archive.glob('**/*.{js,jsx,ts,tsx,css,html}', {
  ignore: [
    'node_modules/**',
    'dist/**',
    '.git/**',
    'build/**'
  ]
});

// Add specific config files
archive.file('package.json');
archive.file('tsconfig.json');
archive.file('vite.config.ts');

// Finalize the archive
archive.finalize();
