const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function runBackupAndInventory() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.\n');

    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();

    // Ensure backups directory exists
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Save full verbatim backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `products-backup-${timestamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(products, null, 2), 'utf8');

    console.log(`=======================================================`);
    console.log(`FULL DATABASE BACKUP SAVED:`);
    console.log(`File: ${backupPath}`);
    console.log(`Total Products Backed Up: ${products.length}`);
    console.log(`=======================================================\n`);

    // Group products by productType / category / volume
    console.log(`PRODUCT INVENTORY & CLOUDINARY STATUS:`);
    console.log(`---------------------------------------------------------------------------------------------------------`);
    console.log(
      'No.'.padEnd(4) +
      'Name'.padEnd(35) +
      'Volume'.padEnd(12) +
      'Category'.padEnd(20) +
      'Cloudinary?'.padEnd(14) +
      'Images Count'
    );
    console.log(`---------------------------------------------------------------------------------------------------------`);

    let cloudinaryCount = 0;
    let otherCount = 0;

    products.forEach((p, idx) => {
      const isCloudinary = (p.mainImage && p.mainImage.includes('res.cloudinary.com')) ||
        (Array.isArray(p.images) && p.images.some(img => typeof img === 'string' ? img.includes('cloudinary') : img?.url?.includes('cloudinary')));
      
      if (isCloudinary) cloudinaryCount++;
      else otherCount++;

      const imgCount = Array.isArray(p.images) ? p.images.length : (p.mainImage ? 1 : 0);
      const name = (p.name || 'Unnamed').substring(0, 33);
      const volume = (p.volume || p.volumeRaw || 'N/A').substring(0, 10);
      const cat = (p.category || p.productType || 'N/A').substring(0, 18);

      console.log(
        (idx + 1).toString().padEnd(4) +
        name.padEnd(35) +
        volume.padEnd(12) +
        cat.padEnd(20) +
        (isCloudinary ? 'YES (Broken)' : 'No (Working)').padEnd(14) +
        imgCount.toString()
      );
    });

    console.log(`---------------------------------------------------------------------------------------------------------`);
    console.log(`Summary: ${cloudinaryCount} products use Cloudinary (broken), ${otherCount} use local/Google Storage.`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB cleanly.');
  } catch (error) {
    console.error('Error during backup/inventory:', error);
    process.exit(1);
  }
}

runBackupAndInventory();
