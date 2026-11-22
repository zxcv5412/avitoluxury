const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const isDryRun = !process.argv.includes('--execute');

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function run() {
  console.log('=======================================================');
  console.log(`RICH IMAGEKIT GALLERY UPDATE (${isDryRun ? 'DRY-RUN MODE' : '*** LIVE EXECUTION MODE ***'})`);
  console.log('=======================================================\n');

  const auditPath = 'scripts/rich-mapping-audit.json';
  if (!fs.existsSync(auditPath)) {
    console.error('Audit file not found:', auditPath);
    process.exit(1);
  }

  const mappings = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  // 1. Create fresh pre-update backup if in execute mode
  if (!isDryRun) {
    const currentProducts = await db.collection('products').find({}).toArray();
    const backupDir = 'scripts/backups';
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const backupFile = `${backupDir}/products-backup-pre-rich-gallery-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(currentProducts, null, 2));
    console.log(`Pre-update backup saved: ${backupFile} (${currentProducts.length} products)\n`);
  }

  let updated = 0;
  for (const m of mappings) {
    if (!m.mainImage || !m.gallery || m.gallery.length === 0) {
      console.warn(`[SKIP] Missing images for: ${m.name} (${m.volume})`);
      continue;
    }

    if (!isDryRun) {
      await db.collection('products').updateOne(
        { _id: new mongoose.Types.ObjectId(m._id) },
        {
          $set: {
            mainImage: m.mainImage,
            images: m.gallery,
            updatedAt: new Date()
          }
        }
      );
    }
    updated++;
    console.log(`[OK] ${m.name} (${m.volume || 'N/A'}) - Main: ${m.mainImage.split('/').pop().split('?')[0]} | Gallery: ${m.gallery.length} images`);
  }

  console.log('\n=======================================================');
  console.log(`UPDATE SUMMARY:`);
  console.log(`Total Mapped: ${mappings.length}`);
  console.log(`Processed:    ${updated}`);
  console.log(`Mode:         ${isDryRun ? 'DRY-RUN (0 changes made)' : 'LIVE (Database updated)'}`);
  console.log('=======================================================');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Error during execution:', err);
  process.exit(1);
});
