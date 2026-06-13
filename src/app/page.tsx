'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './components/store/ProductCard';
import SaleCarousel from '@/app/components/SaleCarousel';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';

interface Product {
  _id: string;
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

// Helper to convert prices
const convertToRupees = (dollarPrice: number) => {
  return dollarPrice;
};

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

// Shimmering Skeleton Loader for Product Cards Grid
const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-full flex flex-col bg-white border border-gray-100 overflow-hidden relative">
        <div className="h-48 xs:h-56 sm:h-60 md:h-64 bg-gray-200" />
        <div className="p-3 xs:p-4 flex-grow flex flex-col space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mt-auto mb-2" />
          <div className="h-10 bg-gray-200 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch real products from API
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        let products = data.products.map((product: any) => ({
          ...product,
          price: convertToRupees(product.price),
          discountedPrice: product.comparePrice ? convertToRupees(product.comparePrice) : 0,
          featured: product.featured || false,
          new_arrival: product.isNewArrival || false,
          best_seller: product.isBestSelling || false,
          productType: product.productType || 'perfume',
          images: [{ url: getProductImage(product) }]
        }));
        
        // Filter products correctly by their flags
        const featured = products.filter((p: any) => p.featured === true);
        const newArrival = products.filter((p: any) => p.new_arrival === true || p.category?.includes('New Arrival'));
        const bestSeller = products.filter((p: any) => p.best_seller === true || p.category?.includes('Bestseller'));
        
        // Set products for each section
        setFeaturedProducts(featured);
        setNewArrivals(newArrival);
        setTopSelling(bestSeller);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedProducts([]);
        setNewArrivals([]);
        setTopSelling([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Nav />
      <main className="flex-grow pb-10">
        {/* Sale Carousel */}
        <SaleCarousel />
        
        {/* Brand Tagline */}
        <div className="text-center py-6 border-b border-gray-100">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">A Scent Beyond Time</p>
          <h2 className="text-lg md:text-xl font-light italic font-serif">Crafted in France, Bottled in India</h2>
        </div>

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
          
          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No featured products available</p>
              )}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link href="/collection" className="inline-block border border-black px-6 py-2 hover:bg-black hover:text-white transition duration-300">
              View All Products
            </Link>
          </div>
        </section>
        
        {/* New Arrivals */}
        <section className="py-10 px-4 max-w-7xl mx-auto bg-gray-50">
          <h2 className="text-2xl md:text-3xl font-medium mb-8 text-center">New Arrivals</h2>
          
          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.length > 0 ? (
                newArrivals.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No new arrivals available</p>
              )}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link href="/new-arrivals" className="inline-block border border-black px-6 py-2 hover:bg-black hover:text-white transition duration-300">
              View All New Arrivals
            </Link>
          </div>
        </section>
        
        {/* Best Selling */}
        <section className="py-10 px-4 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-medium mb-8 text-center">Best Selling</h2>
          
          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {topSelling.length > 0 ? (
                topSelling.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No best selling products available</p>
              )}
            </div>
          )}
          
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
