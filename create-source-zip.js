
import fs from 'fs';
import archiver from 'archiver';

// Create a buffer to store the zip content
const output = fs.createWriteStream('source-code.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

// Listen for archive events
output.on('close', () => {
  // Read the zip file and convert to Base64
  const zipContent = fs.readFileSync('source-code.zip');
  const base64Content = zipContent.toString('base64');
  
  // Write the Base64 content to a text file
  fs.writeFileSync('source-code.txt', base64Content);
  
  console.log('Source code has been zipped and encoded!');
  console.log('The encoded content is in: source-code.txt');
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
