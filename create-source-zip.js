
import fs from 'fs';
import archiver from 'archiver';
import { glob } from 'glob';

async function createZip() {
  try {
    console.log('Starting zip creation...');
    const output = fs.createWriteStream('source-code.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });
    let fileList = 'Files included in the zip:\n\n';

    // Set up archive error handler
    archive.on('warning', function(err) {
      console.warn('Warning during zip:', err);
    });

    archive.on('error', function(err) {
      throw err;
    });

    // Pipe archive data to the output file
    archive.pipe(output);

    // Define patterns for different parts of the project
    const patterns = [
      'client/src/**/*.{ts,tsx,js,jsx,css}',
      'server/**/*.ts',
      'shared/**/*.ts',
      'package.json',
      'tsconfig.json', 
      'vite.config.ts',
      'tailwind.config.ts',
      'postcss.config.js'
    ];

    console.log('Searching for files with patterns:', patterns);

    // Add files to archive
    for (const pattern of patterns) {
      const files = await glob(pattern);
      console.log(`Found ${files.length} files for pattern: ${pattern}`);
      
      for (const file of files) {
        console.log(`Adding file: ${file}`);
        archive.file(file);
        fileList += `${file}\n`;
      }
    }

    // Write the file list first
    fs.writeFileSync('source-files.txt', fileList);
    console.log('File list written');

    // Finalize archive and wait for it to complete
    await archive.finalize();

    // Wait for the output stream to finish
    await new Promise((resolve, reject) => {
      output.on('close', () => {
        console.log('Archive created successfully');
        resolve();
      });
      output.on('error', reject);
    });

    // Create an HTML file with download links
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Download Source Code</title>
      <style>
        body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 20px; }
        .button { 
          display: inline-block;
          padding: 10px 20px;
          background: #0066ff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <h1>Download Source Code</h1>
      <a href="source-code.zip" download class="button">Download ZIP</a>
      <pre>${fileList}</pre>
    </body>
    </html>`;

    fs.writeFileSync('download.html', html);

    console.log('Process completed successfully!');
    console.log('Open download.html in your browser to download the zip file');

  } catch (error) {
    console.error('Error creating zip:', error);
    process.exit(1);
  }
}

createZip();
