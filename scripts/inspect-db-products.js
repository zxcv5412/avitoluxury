const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  console.log('Total products in DB:', products.length);
  
  const categories = {};
  products.forEach(p => {
    const c = p.category || 'Uncategorized';
    categories[c] = (categories[c] || 0) + 1;
  });
  console.log('By category:', JSON.stringify(categories, null, 2));

  console.log('\n--- Unmatched/Targeted products to review ---');
  products.forEach(p => {
    const n = (p.name || '').toLowerCase();
    const c = (p.category || '').toLowerCase();
    const v = (p.volume || '').toLowerCase();
    console.log(`[${p.category || 'None'}] "${p.name}" | Vol: "${p.volume}"`);
  });

  await mongoose.disconnect();
})();
