import ProductListing from '../components/ProductListing';
import { Metadata } from 'next';
import connectMongoDB from '@/app/lib/mongodb';
import ProductModel from '@/app/models/Product';

export const metadata: Metadata = {
  title: 'Collection | A V I T O   S C E N T S',
  description: 'Discover our complete collection of premium perfumes, luxury attars, and exquisite fragrances crafted with the finest ingredients.',
  openGraph: {
    title: 'Our Complete Collection | A V I T O   S C E N T S',
    description: 'Explore the full range of Avito Scents. From best-selling perfumes to exclusive luxury attars, find your signature scent today.',
    url: 'https://www.avitoluxury.in/collection',
    type: 'website',
  },
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

export default async function CollectionPage() {
  let products: any[] = [];
  
  try {
    await connectMongoDB();
    
    // Fetch directly from DB (all products)
    const dbProducts = await ProductModel.find({}).lean();
    
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
    console.error('Error fetching collection for SSR:', error);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Avito Scents Complete Collection',
    description: 'Discover our complete collection of premium perfumes and fragrances.',
    url: 'https://www.avitoluxury.in/collection',
    hasPart: products.slice(0, 10).map((product) => ({
      '@type': 'Product',
      name: product.name,
      url: `https://www.avitoluxury.in/product/${product.slug || product._id}`,
      image: product.images[0]?.url || product.mainImage,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductListing 
        title="Our Luxury Fragrance Collection"
        description="Discover premium perfumes crafted with the finest ingredients from around the world."
        initialProducts={products as any}
      />
    </>
  );
}