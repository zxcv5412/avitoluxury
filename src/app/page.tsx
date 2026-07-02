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
  let overrideHeroProducts: any[] = [];
  let isExactHero = false;
  let customCarousels: any[] = [];

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
    
    // Filter and shuffle products correctly (as fallback options)
    const defaultFeatured = shuffleArray(products).slice(0, 4);
    const defaultNewArrivals = shuffleArray(products.filter((p) => p.new_arrival || p.category?.includes('New Arrival'))).slice(0, 4);
    const defaultTopSelling = shuffleArray(products.filter((p) => p.best_seller || p.category?.includes('Bestseller'))).slice(0, 4);

    // Fetch site settings from database to check for overrides
    let settings: any = null;
    try {
      settings = await SiteSettings.findOne({ settingId: 'global' }).populate({
        path: 'carousels.products.product',
        model: ProductModel
      }).lean();
    } catch (err) {
      console.error('Error fetching storefront settings:', err);
    }

    const carousels = settings?.carousels || [];
    
    // Get slots map, defaulting to core IDs if missing
    const slots = settings?.slots || {
      hero: 'hero-carousel',
      featured: 'featured-products',
      newArrivals: 'new-arrivals',
      bestSellers: 'best-sellers'
    };

    // 1. Hero Override Check
    const heroConfig = carousels.find((c: any) => c.id === slots.hero);
    const heroProducts = heroConfig?.products?.map((item: any) => item.product).filter(Boolean) || [];

    // If hero override has products, we'll format them to match expected structure
    let overrideHeroProducts: any[] = [];
    if (heroProducts.length > 0) {
      overrideHeroProducts = heroProducts;
    } else {
      overrideHeroProducts = dbProducts; // Fallback to all products (SaleCarousel handles filtering)
    }

    // 2. Featured Override Check
    const featuredConfig = carousels.find((c: any) => c.id === slots.featured);
    const featuredOverrideProducts = featuredConfig?.products?.map((item: any) => {
      const p = item.product;
      if (!p) return null;
      return {
        _id: p._id.toString(),
        slug: p.slug,
        name: p.name,
        description: p.description || '',
        price: p.price,
        discountedPrice: p.comparePrice || p.discountedPrice || 0,
        category: p.category || '',
        rating: p.rating || 0,
        featured: p.featured || false,
        new_arrival: p.isNewArrival || false,
        best_seller: p.isBestSelling || false,
        productType: p.productType || 'perfume',
        images: [{ url: getProductImage(p) }]
      };
    }).filter(Boolean) || [];
    
    featuredProducts = featuredOverrideProducts.length > 0 ? featuredOverrideProducts : defaultFeatured;

    // 3. New Arrivals Override Check
    const newArrivalsConfig = carousels.find((c: any) => c.id === slots.newArrivals);
    const newArrivalsOverrideProducts = newArrivalsConfig?.products?.map((item: any) => {
      const p = item.product;
      if (!p) return null;
      return {
        _id: p._id.toString(),
        slug: p.slug,
        name: p.name,
        description: p.description || '',
        price: p.price,
        discountedPrice: p.comparePrice || p.discountedPrice || 0,
        category: p.category || '',
        rating: p.rating || 0,
        featured: p.featured || false,
        new_arrival: p.isNewArrival || false,
        best_seller: p.isBestSelling || false,
        productType: p.productType || 'perfume',
        images: [{ url: getProductImage(p) }]
      };
    }).filter(Boolean) || [];

    newArrivals = newArrivalsOverrideProducts.length > 0 ? newArrivalsOverrideProducts : defaultNewArrivals;

    // 4. Best Sellers Override Check
    const bestSellersConfig = carousels.find((c: any) => c.id === slots.bestSellers);
    const bestSellersOverrideProducts = bestSellersConfig?.products?.map((item: any) => {
      const p = item.product;
      if (!p) return null;
      return {
        _id: p._id.toString(),
        slug: p.slug,
        name: p.name,
        description: p.description || '',
        price: p.price,
        discountedPrice: p.comparePrice || p.discountedPrice || 0,
        category: p.category || '',
        rating: p.rating || 0,
        featured: p.featured || false,
        new_arrival: p.isNewArrival || false,
        best_seller: p.isBestSelling || false,
        productType: p.productType || 'perfume',
        images: [{ url: getProductImage(p) }]
      };
    }).filter(Boolean) || [];

    topSelling = bestSellersOverrideProducts.length > 0 ? bestSellersOverrideProducts : defaultTopSelling;

    // 5. Custom Carousels Check (only those not assigned to active slots)
    const assignedIds = [slots.hero, slots.featured, slots.newArrivals, slots.bestSellers];
    customCarousels = carousels.filter((c: any) => !assignedIds.includes(c.id)).map((c: any) => {
      const mappedProducts = c.products?.map((item: any) => {
        const p = item.product;
        if (!p) return null;
        return {
          _id: p._id.toString(),
          slug: p.slug,
          name: p.name,
          description: p.description || '',
          price: p.price,
          discountedPrice: p.comparePrice || p.discountedPrice || p.price,
          category: p.category || '',
          rating: p.rating || 0,
          featured: p.featured || false,
          new_arrival: p.isNewArrival || false,
          best_seller: p.isBestSelling || false,
          productType: p.productType || 'perfume',
          images: [{ url: getProductImage(p) }]
        };
      }).filter(Boolean) || [];

      return {
        id: c.id,
        title: c.title,
        products: mappedProducts
      };
    }).filter((c: any) => c.products.length > 0);

    // Set custom hero mode and override array variables
    overrideHeroProducts = heroProducts.length > 0 ? heroProducts : dbProducts;
    isExactHero = heroProducts.length > 0;
    
  } catch (error) {
    console.error('Error fetching products during SSR:', error);
  }

  // Retrieve hero and custom carousel variables
  const finalHeroProducts = overrideHeroProducts.length > 0 ? overrideHeroProducts : dbProducts;
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Nav />
      {/* 
        DEBUG INFO (View Source):
        Settings Found: {settings ? 'YES' : 'NO'}
        Carousels Count: {carousels.length}
        Hero Products Count: {heroProducts.length}
        isExactHero: {isExactHero ? 'YES' : 'NO'}
        Custom Carousels Count: {customCarousels.length}
        DB Products Count: {dbProducts.length}
      */}
      <main className="flex-grow pb-10">
        {/* Sale Carousel */}
        <SaleCarousel initialProducts={JSON.parse(JSON.stringify(finalHeroProducts))} exactMode={isExactHero} />
        
        {/* Trust Badge Ribbon */}
        <div className="bg-gray-50 py-4 border-b border-gray-100">
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

        {/* Custom Carousels (e.g. Summer Sale, etc.) */}
        {customCarousels.map((carousel: any) => (
          <section key={carousel.id} className="py-10 px-4 max-w-7xl mx-auto border-t border-gray-100">
            <h2 className="text-2xl md:text-3xl font-medium mb-8 text-center">{carousel.title}</h2>
            <SaleCarousel initialProducts={carousel.products} exactMode={true} />
          </section>
        ))}
        
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
