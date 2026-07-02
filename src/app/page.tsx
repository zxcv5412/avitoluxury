import Link from 'next/link';
import ProductCard from './components/store/ProductCard';
import SaleCarousel from '@/app/components/SaleCarousel';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import connectMongoDB from '@/app/lib/mongodb';
import ProductModel from '@/app/models/Product';
import SiteSettings from '@/app/models/SiteSettings';

interface Product {
  _id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  category: string;
  images: { url: string }[];
  rating: number;
  featured: boolean;
  new_arrival: boolean;
  best_seller: boolean;
  productType: string;
}

// Helper function to safely get image URL from product
const getProductImage = (product: any): string => {
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    } else if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
      return firstImage.url;
    }
  }
  return product.mainImage || 'https://placehold.co/400x500';
};

// Helper to shuffle array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const dynamic = 'force-dynamic'; // Ensures the page fetches fresh data on load

export default async function HomePage() {
  let featuredProducts: Product[] = [];
  let newArrivals: Product[] = [];
  let topSelling: Product[] = [];
  let dbProducts: any[] = [];

  try {
    await connectMongoDB();
    
    // Fetch products directly from database on the server
    dbProducts = await ProductModel.find({}).lean();
    
    // Map to the required interface
    const products: Product[] = dbProducts.map((product: any) => ({
      _id: product._id.toString(),
      slug: product.slug,
      name: product.name,
      description: product.description || '',
      price: product.price,
      discountedPrice: product.comparePrice || 0,
      category: product.category || '',
      rating: product.rating || 0,
      featured: product.featured || false,
      new_arrival: product.isNewArrival || false,
      best_seller: product.isBestSelling || false,
      productType: product.productType || 'perfume',
      images: [{ url: getProductImage(product) }]
    }));
    
    // We no longer shuffle dbProducts for the old grids,
    // we rely entirely on the exact products from SiteSettings.
  } catch (error) {
    console.error('Error fetching products during SSR:', error);
  }

  let siteSettings: any = null;
  try {
    siteSettings = await SiteSettings.findOne({ settingId: 'global' }).populate({
      path: 'carousels.products.product',
      model: ProductModel
    }).lean();
  } catch (error) {
    console.error('Error fetching site settings:', error);
  }

  const carousels = siteSettings?.carousels || [];
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Nav />
      <main className="flex-grow pb-10">
        
        {/* Dynamic Carousels from Admin Storefront Settings */}
        {carousels.length > 0 ? (
          carousels.map((carousel: any, index: number) => {
            const mappedProducts = carousel.products.map((item: any) => {
              const p = item.product;
              return {
                _id: p._id.toString(),
                slug: p.slug,
                name: p.name,
                description: p.description || '',
                price: p.price,
                discountedPrice: p.comparePrice || p.discountedPrice || p.price,
                category: p.category || '',
                images: p.images && p.images.length > 0 ? p.images : [{ url: p.mainImage || 'https://placehold.co/400x500' }],
              };
            });

            if (mappedProducts.length === 0) return null;

            return (
              <div key={carousel.id} className={index > 0 ? "mt-16" : ""}>
                {index > 0 && (
                  <h2 className="text-2xl md:text-3xl font-medium mb-8 text-center px-4 max-w-7xl mx-auto">
                    {carousel.title}
                  </h2>
                )}
                <SaleCarousel initialProducts={mappedProducts} exactMode={true} />
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-gray-500">
            <p>No storefront carousels configured.</p>
            <p className="text-sm mt-2">Go to the Admin Panel &gt; Storefront to add carousels.</p>
          </div>
        )}
        
        {/* Trust Badge Ribbon */}
        <div className="bg-gray-50 py-8 border-b border-gray-100 mt-10">
          <div className="max-w-7xl mx-auto px-4 flex justify-around items-center text-center gap-2">
            <div className="flex flex-col items-center">
              <span className="text-base">🌱</span>
              <span className="text-[10px] md:text-xs font-medium text-gray-600 uppercase tracking-wider mt-1">100% Organic</span>
            </div>
            <div className="border-r border-gray-300 h-6"></div>
            <div className="flex flex-col items-center">
              <span className="text-base">⏳</span>
              <span className="text-[10px] md:text-xs font-medium text-gray-600 uppercase tracking-wider mt-1">Long Lasting</span>
            </div>
            <div className="border-r border-gray-300 h-6"></div>
            <div className="flex flex-col items-center">
              <span className="text-base">🇮🇳</span>
              <span className="text-[10px] md:text-xs font-medium text-gray-600 uppercase tracking-wider mt-1">Crafted in India</span>
            </div>
            <div className="border-r border-gray-300 h-6"></div>
            <div className="flex flex-col items-center">
              <span className="text-base">🐰</span>
              <span className="text-[10px] md:text-xs font-medium text-gray-600 uppercase tracking-wider mt-1">Cruelty Free</span>
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-xl md:text-2xl font-medium mb-2">About</h3>
              <h2 className="text-2xl md:text-3xl font-medium mb-4 whitespace-pre"> A V I T O    S C E N T S</h2>

              <p className="text-gray-600 mb-8">
              AVITO is a luxury brand renowned for its exquisite collection of premium perfumes, organic aromatic fragrances, and high-end bath and skincare products. Crafted with the finest natural and certified ingredients, AVITO’s offerings embody sophistication and indulgence, delivering long-lasting scents and nourishing care. Inspired by elegance and sustainability, the brand creates cruelty-free, paraben-free, and alcohol-free products, blending global expertise with timeless luxury to elevate everyday rituals.
              </p>
              <Link href="/about-us" className="inline-block border border-black px-6 py-2 hover:bg-black hover:text-white transition duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
