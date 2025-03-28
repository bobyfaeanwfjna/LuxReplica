
import fs from 'fs';
import archiver from 'archiver';
import { promisify } from 'util';
import { glob } from 'glob';

const globPromise = promisify(glob);

async function createZip() {
  try {
    const output = fs.createWriteStream('source-code.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });
    let fileList = 'Files included in the zip:\n\n';

    // Set up archive error handler
    archive.on('error', (err) => {
      throw err;
    });

    // Wait for output to close
    const closePromise = new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
      archive.on('error', reject);
    });

    // Pipe archive data to the output file
    archive.pipe(output);

    // Add source code files while excluding binary and build files
    const patterns = ['**/*.{js,jsx,ts,tsx,css,html}', 'package.json', 'tsconfig.json', 'vite.config.ts'];
    
    for (const pattern of patterns) {
      const matches = await globPromise(pattern, {
        ignore: ['node_modules/**', 'dist/**', '.git/**', 'build/**', '**/create-source-zip.js']
      });
      
      for (const file of matches) {
        archive.file(file);
        fileList += `${file}\n`;
      }
    }

    // Write the file list first
    fs.writeFileSync('source-files.txt', fileList);
    
    // Finalize the archive
    await archive.finalize();
    
    // Wait for the output to finish
    await closePromise;

    // Now read and encode the zip
    const zipContent = fs.readFileSync('source-code.zip');
    const base64Content = zipContent.toString('base64');
    fs.writeFileSync('source-code.txt', base64Content);

    console.log('Source code has been zipped and encoded!');
    console.log('The encoded content is in: source-code.txt');
    console.log('A readable list of files is in: source-files.txt');
  } catch (error) {
    console.error('Error creating zip:', error);
    process.exit(1);
  }
}

createZip();
