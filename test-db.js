import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function test() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");
  
  // Just find one product
  const db = mongoose.connection.db;
  const product = await db.collection('products').findOne({});
  console.log("Sample Product Slug:", product?.slug);
  console.log("Sample Product ID:", product?._id.toString());
  
  // Now try to find it using the same logic
  const id = product?.slug || product?._id.toString();
  console.log(`Searching for ID: ${id}`);
  
  let found = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    console.log("Valid ObjectId, searching by ID...");
    found = await db.collection('products').findOne({ _id: new mongoose.Types.ObjectId(id) });
  }
  
  if (!found) {
    console.log("Not found by ID, searching by slug/sku/customId...");
    found = await db.collection('products').findOne({
        $or: [
          { slug: id },
          { customId: id },
          { sku: id }
        ]
    });
  }
  
  console.log("Found Result:", !!found);
  process.exit(0);
}

test().catch(console.error);
