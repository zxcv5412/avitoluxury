import ProductListing from '../components/ProductListing';
import { Metadata } from 'next';
import connectMongoDB from '@/app/lib/mongodb';
import ProductModel from '@/app/models/Product';

export const metadata: Metadata = {
  title: 'New Arrivals | A V I T O   S C E N T S',
  description: 'Discover our latest fragrance creations and be the first to experience our newest scents.',
};

export const dynamic = 'force-dynamic';

// Helper function to safely get image URL from product
const getProductImage = (product: any): string => {
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') return firstImage;
    if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) return firstImage.url;
  }
  return product.mainImage || 'https://placehold.co/400x500';
};

export default async function NewArrivalsPage() {
  let products: any[] = [];
  
  try {
    await connectMongoDB();
    
    // Fetch directly from DB
    const dbProducts = await ProductModel.find({ isNewArrival: true }).lean();
    
    // Format to match expected Product interface
    products = dbProducts.map((p: any) => ({
      _id: p._id.toString(),
      name: p.name,
      description: p.description || '',
      price: p.price,
      discountedPrice: p.comparePrice || 0,
      category: p.category || '',
      images: [{ url: getProductImage(p) }],
      productType: p.productType || 'perfume',
      tags: p.tags || [],
      volume: p.volume || '',
      gender: p.gender || '',
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching new arrivals for SSR:', error);
  }

  return (
    <ProductListing 
      tag="new-arrival"
      title="New Arrivals"
      description="Discover our latest fragrance creations and be the first to experience our newest scents."
      initialProducts={products as any}
    />
  );
}