require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const privateKey = (process.env.IMAGEKIT_PUBLIC_KEY || '').startsWith('private_') 
  ? process.env.IMAGEKIT_PUBLIC_KEY 
  : process.env.IMAGEKIT_PRIVATE_KEY;

if (!privateKey) {
  console.error('Private key not found in .env.local');
  process.exit(1);
}

const authHeader = 'Basic ' + Buffer.from(privateKey.trim() + ':').toString('base64');

(async () => {
  let allFiles = [];
  let skip = 0;
  const limit = 500;

  console.log('Fetching all assets from ImageKit API...');

  while (true) {
    const url = 'https://api.imagekit.io/v1/files?limit=' + limit + '&skip=' + skip;
    const res = await fetch(url, {
      headers: { Authorization: authHeader }
    });

    if (res.status !== 200) {
      console.error('API Error:', res.status, await res.text());
      break;
    }

    const files = await res.json();
    if (!Array.isArray(files) || files.length === 0) break;
    allFiles = allFiles.concat(files);
    console.log('Fetched ' + files.length + ' files (total so far: ' + allFiles.length + ')');
    if (files.length < limit) break;
    skip += limit;
  }

  // Filter only image/media files (ignore default sample files if needed)
  const inventory = allFiles.map(f => ({
    fileId: f.fileId,
    name: f.name,
    filePath: f.filePath,
    url: f.url,
    fileType: f.fileType,
    folder: f.filePath.substring(0, f.filePath.lastIndexOf('/')) || '/'
  }));

  fs.writeFileSync('scripts/imagekit-all-files.json', JSON.stringify(inventory, null, 2));
  console.log('\nSuccessfully saved ' + inventory.length + ' files to scripts/imagekit-all-files.json');

  // Print folder summary
  const folders = {};
  inventory.forEach(f => {
    folders[f.folder] = (folders[f.folder] || 0) + 1;
  });
  console.log('\nFiles per folder:');
  console.log(JSON.stringify(folders, null, 2));
})();
