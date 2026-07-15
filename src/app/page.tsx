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
  let dbProducts: any[] = [];
  let featuredProducts: Product[] = [];
  let newArrivals: Product[] = [];
  let topSelling: Product[] = [];
  let heroProducts: any[] = [];
  let isExactHero = false;
  let settings: any = null;

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
      discountedPrice: product.comparePrice || product.discountedPrice || product.price,
      category: product.category || '',
      rating: product.rating || 0,
      featured: product.featured || false,
      new_arrival: product.isNewArrival || false,
      best_seller: product.isBestSelling || false,
      productType: product.productType || 'perfume',
      images: [{ url: getProductImage(product) }]
    }));
    
    // Filter and shuffle products correctly (as fallback options for lists)
    featuredProducts = shuffleArray(products).slice(0, 4);
    newArrivals = shuffleArray(products.filter((p) => p.new_arrival || p.category?.includes('New Arrival'))).slice(0, 4);
    topSelling = shuffleArray(products.filter((p) => p.best_seller || p.category?.includes('Bestseller'))).slice(0, 4);

    // Fetch site settings from database to check for hero override list
    try {
      settings = await SiteSettings.findOne({ settingId: 'global' }).populate({
        path: 'presets.products.product',
        model: ProductModel
      }).lean();
    } catch (err) {
      console.error('Error fetching storefront settings:', err);
    }

    const presets = settings?.presets || [];
    const activePresetId = settings?.activePresetId || 'default';
    const activePreset = presets.find((p: any) => p.id === activePresetId);
    const fetchedHero = activePreset?.products || [];
    heroProducts = fetchedHero.map((item: any) => item.product).filter(Boolean);
    isExactHero = heroProducts.length > 0;
    
  } catch (error) {
    console.error('Error fetching products during SSR:', error);
  }

  // Retrieve final hero products (fallback to dbProducts if override list is empty)
  const finalHeroProducts = isExactHero ? heroProducts : dbProducts;
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Nav />
      {/* 
        DEBUG INFO (View Source):
        Settings Found: {settings ? 'YES' : 'NO'}
        Active Preset: {activePresetId}
        Hero Products Count: {heroProducts.length}
        isExactHero: {isExactHero ? 'YES' : 'NO'}
        DB Products Count: {dbProducts.length}
      */}
      <main className="flex-grow pb-10">
        {/* Sale Carousel */}
        <SaleCarousel initialProducts={JSON.parse(JSON.stringify(finalHeroProducts))} exactMode={isExactHero} />
        
        {/* Trust Badge Ribbon */}
        <div className="bg-gray-50 py-6 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center text-center">
            {/* Lowest Price */}
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-amber-700 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.5 20.5 12 25l11-11V3h-9L3.5 14.5l4 6z" />
                <path d="M14 7h.01" />
                <path d="m9.5 15.5 5-5" />
                <circle cx="10" cy="11" r=".5" fill="currentColor" />
                <circle cx="14" cy="15" r=".5" fill="currentColor" />
              </svg>
              <span className="text-xs md:text-sm font-medium tracking-wider text-gray-700 uppercase mt-2">Lowest Price</span>
            </div>
            
            {/* Cash on Delivery */}
            <div className="flex flex-col items-center border-l border-gray-200 md:border-l">
              <svg className="w-8 h-8 text-amber-700 stroke-[1.5] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2.5" />
                <path d="M6 12h.01M18 12h.01" />
              </svg>
              <span className="text-xs md:text-sm font-medium tracking-wider text-gray-700 uppercase mt-2">Cash on Delivery</span>
            </div>
            
            {/* Easy Returns */}
            <div className="flex flex-col items-center border-l border-gray-200">
              <svg className="w-8 h-8 text-amber-700 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
                <path d="M8 16a4 4 0 0 1 7-2.8M15 16h-4v-4" />
              </svg>
              <span className="text-xs md:text-sm font-medium tracking-wider text-gray-700 uppercase mt-2">Easy Returns</span>
            </div>
            
            {/* Fast Delivery */}
            <div className="flex flex-col items-center border-l border-gray-200">
              <svg className="w-8 h-8 text-amber-700 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
                <path d="M3 6h6M3 9h4" />
              </svg>
              <span className="text-xs md:text-sm font-medium tracking-wider text-gray-700 uppercase mt-2">Fast Delivery</span>
            </div>
          </div>
        </div>
        
        {/* Featured Products */}
        <section className="py-10 px-4 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-medium mb-8 text-center">Featured Products</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No featured products available</p>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/collection" className="inline-block border border-black px-6 py-2 hover:bg-black hover:text-white transition duration-300">
              View All Products
            </Link>
          </div>
        </section>
        
        {/* New Arrivals */}
        <section className="py-10 px-4 max-w-7xl mx-auto bg-gray-50">
          <h2 className="text-2xl md:text-3xl font-medium mb-8 text-center">New Arrivals</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No new arrivals available</p>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/new-arrivals" className="inline-block border border-black px-6 py-2 hover:bg-black hover:text-white transition duration-300">
              View All New Arrivals
            </Link>
          </div>
        </section>
        
        {/* Best Selling */}
        <section className="py-10 px-4 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-medium mb-8 text-center">Best Selling</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {topSelling.length > 0 ? (
              topSelling.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No best selling products available</p>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/best-selling" className="inline-block border border-black px-6 py-2 hover:bg-black hover:text-white transition duration-300">
              View All Best Sellers
            </Link>
          </div>
        </section>
        
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
