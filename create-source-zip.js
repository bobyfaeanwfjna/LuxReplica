
import fs from 'fs';
import archiver from 'archiver';
import glob from 'glob';
import { promisify } from 'util';

const globPromise = promisify(glob);

async function createZip() {
  // Create a buffer to store the zip content
  const output = fs.createWriteStream('source-code.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  // Keep track of files being added
  let fileList = 'Files included in the zip:\n\n';
  
  // Listen for archive events
  output.on('close', () => {
    // Read the zip file and convert to Base64
    const zipContent = fs.readFileSync('source-code.zip');
    const base64Content = zipContent.toString('base64');
    
    // Write the Base64 content to a text file
    fs.writeFileSync('source-code.txt', base64Content);
    
    // Write the file list
    fs.writeFileSync('source-files.txt', fileList);
    
    console.log('Source code has been zipped and encoded!');
    console.log('The encoded content is in: source-code.txt');
    console.log('A readable list of files is in: source-files.txt');
  });
  
  archive.on('error', (err) => {
    throw err;
  });
  
  // Pipe archive data to the output file
  archive.pipe(output);
  
  // Add source code files while excluding binary and build files
  const patterns = ['**/*.{js,jsx,ts,tsx,css,html}', 'package.json', 'tsconfig.json', 'vite.config.ts'];
  
  for (const pattern of patterns) {
    const matches = await globPromise(pattern, {
      ignore: ['node_modules/**', 'dist/**', '.git/**', 'build/**']
    });
    
    for (const file of matches) {
      archive.file(file);
      fileList += `${file}\n`;
    }
  }
  
  // Finalize the archive
  archive.finalize();
}

createZip();
