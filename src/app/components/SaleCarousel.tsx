'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ShopNowButton from './ui/ShopNowButton';
import Image from 'next/image';

// Types
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  images: { url: string }[];
  discountPercentage?: number;
  slug?: string;
}

// Convert USD to INR
const convertToRupees = (dollarPrice: number) => {
  // Just return the original price without conversion
  return dollarPrice;
};

// Helper function to inject Cloudinary optimization transformations
const optimizeImageUrl = (url: string, width = 800) => {
  if (!url) return '/perfume-placeholder.jpg';
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }
  return url;
};

const processCarouselProducts = (sourceProducts: any[], exactMode?: boolean) => {
  if (exactMode) {
    return sourceProducts.map((product: any) => {
      const price = convertToRupees(product.price || 0);
      const discountedPrice = convertToRupees(product.comparePrice || product.discountedPrice || price);
      const discountPercentage = price && discountedPrice && price > discountedPrice ? ((price - discountedPrice) / price * 100) : 0;
      
      let images = [];
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        images = product.images.map((img: any) => {
          if (typeof img === 'string') return { url: img };
          else if (img && img.url) return img;
          return null;
        }).filter(Boolean);
      }
      if (images.length === 0 && product.mainImage) images = [{ url: product.mainImage }];
      if (images.length === 0) images = [{ url: '/perfume-placeholder.jpg' }];
      
      return {
        ...product,
        price,
        discountedPrice,
        discountPercentage,
        images
      };
    });
  }

  // Filter for products with discount and calculate discount percentage
  const discountedProducts = sourceProducts
    .filter((product: any) => {
      return product.price && (product.comparePrice || product.discountedPrice) && 
            product.price > 0 && (product.comparePrice || product.discountedPrice) > 0 &&
            product.price > (product.comparePrice || product.discountedPrice);
    })
    .map((product: any) => {
      const price = convertToRupees(product.price);
      const discountedPrice = convertToRupees(product.comparePrice || product.discountedPrice);
      const discountPercentage = ((price - discountedPrice) / price * 100);
      
      let images = [];
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        images = product.images.map((img: any) => {
          if (typeof img === 'string') return { url: img };
          else if (img && img.url) return img;
          return null;
        }).filter(Boolean);
      }
      if (images.length === 0 && product.mainImage) images = [{ url: product.mainImage }];
      if (images.length === 0) images = [{ url: '/perfume-placeholder.jpg' }];
      
      return {
        ...product,
        price,
        discountedPrice,
        discountPercentage,
        images
      };
    });
  
  let sortedProducts = [...discountedProducts].sort((a: any, b: any) => b.discountPercentage - a.discountPercentage);
  
  const pinnedProductRaw = sourceProducts.find((p: any) => p.isPinned === true);
  if (pinnedProductRaw) {
    const price = convertToRupees(pinnedProductRaw.price);
    const discountedPrice = pinnedProductRaw.comparePrice ? convertToRupees(pinnedProductRaw.comparePrice) : (pinnedProductRaw.discountedPrice || 0);
    const discountPercentage = price && discountedPrice && price > discountedPrice ? ((price - discountedPrice) / price * 100) : 0;
    
    let images = [];
    if (pinnedProductRaw.images && Array.isArray(pinnedProductRaw.images) && pinnedProductRaw.images.length > 0) {
      images = pinnedProductRaw.images.map((img: any) => {
        if (typeof img === 'string') return { url: img };
        else if (img && img.url) return img;
        return null;
      }).filter(Boolean);
    }
    if (images.length === 0 && pinnedProductRaw.mainImage) images = [{ url: pinnedProductRaw.mainImage }];
    if (images.length === 0) images = [{ url: '/perfume-placeholder.jpg' }];
    
    const normalizedPinned = { ...pinnedProductRaw, price, discountedPrice, discountPercentage, images };
    sortedProducts = sortedProducts.filter((p: any) => p._id !== pinnedProductRaw._id);
    sortedProducts.unshift(normalizedPinned);
  }

  const pinnedSecondProductRaw = sourceProducts.find((p: any) => p.isPinnedSecond === true);
  if (pinnedSecondProductRaw) {
    const price = convertToRupees(pinnedSecondProductRaw.price);
    const discountedPrice = pinnedSecondProductRaw.comparePrice ? convertToRupees(pinnedSecondProductRaw.comparePrice) : (pinnedSecondProductRaw.discountedPrice || 0);
    const discountPercentage = price && discountedPrice && price > discountedPrice ? ((price - discountedPrice) / price * 100) : 0;
    
    let images = [];
    if (pinnedSecondProductRaw.images && Array.isArray(pinnedSecondProductRaw.images) && pinnedSecondProductRaw.images.length > 0) {
      images = pinnedSecondProductRaw.images.map((img: any) => {
        if (typeof img === 'string') return { url: img };
        else if (img && img.url) return img;
        return null;
      }).filter(Boolean);
    }
    if (images.length === 0 && pinnedSecondProductRaw.mainImage) images = [{ url: pinnedSecondProductRaw.mainImage }];
    if (images.length === 0) images = [{ url: '/perfume-placeholder.jpg' }];
    
    const normalizedPinnedSecond = { ...pinnedSecondProductRaw, price, discountedPrice, discountPercentage, images };
    sortedProducts = sortedProducts.filter((p: any) => p._id !== pinnedSecondProductRaw._id);
    const insertIndex = sortedProducts.length >= 1 ? 1 : 0;
    sortedProducts.splice(insertIndex, 0, normalizedPinnedSecond);
  }
  
  return sortedProducts.slice(0, 6);
};

export default function SaleCarousel({ initialProducts, exactMode = false }: { initialProducts?: any[], exactMode?: boolean } = {}) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (initialProducts && initialProducts.length > 0) {
      return processCarouselProducts(initialProducts, exactMode);
    }
    return [];
  });
  
  const [loading, setLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch products if initialProducts is not provided, or sync state when initialProducts changes
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(processCarouselProducts(initialProducts, exactMode));
      setLoading(false);
      return;
    }
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        const processed = processCarouselProducts(data.products, exactMode);
        setProducts(processed);
      } catch (err: any) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [initialProducts, exactMode]);
  
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };
  
  // Auto advance slides every 5 seconds
  useEffect(() => {
    if (products.length <= 1) return;
    
    const timer = setInterval(() => {
      goToNext();
    }, 5000);
    
    return () => clearInterval(timer);
  }, [products, currentIndex]);
  
  // Use products from database
  const displayProducts = products.length > 0 ? products : [];
  
  if (loading || displayProducts.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg">Loading fragrances...</div>
      </div>
    );
  }
  
  return (
    <motion.div
      layout="size"
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative w-full overflow-hidden bg-white h-auto md:h-[500px] lg:h-[600px]"
    >
      <div className="relative w-full h-auto md:h-full">
        {displayProducts.map((product, index) => {
          const isActive = index === currentIndex;
          return (
            <motion.div
              key={product._id}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 10 : 0,
              }}
              transition={{ duration: 0.4 }}
              className={`${
                isActive ? 'relative' : 'absolute inset-0'
              } w-full h-auto md:h-full`}
              style={{
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-full">
                {/* Image - Mobile: Full screen with link, Desktop: Left side */}
                <div className="order-1 md:order-1 flex items-center justify-center h-auto md:h-full bg-white relative w-full">
                  
                  {/* Mobile fluid display: stretch to full width, adapt container height dynamically */}
                  <div className="block md:hidden w-full relative">
                    <Link href={`/product/${product.slug || product._id}`} className="block w-full">
                      <img
                        src={optimizeImageUrl(product.images && product.images[0]?.url || '/perfume-placeholder.jpg', 800)}
                        alt={product.name || "Perfume product"}
                        className="w-full h-auto block"
                      />
                      {/* Mobile-only discount badge */}
                      <div className="absolute top-4 left-4 bg-[#0B0B0D] text-white px-2.5 py-1 text-[9px] xs:text-[10px] tracking-[0.15em] uppercase font-semibold z-10">
                        {Math.round(product.discountPercentage || 0)}% OFF
                      </div>
                      {/* Mobile-only product name overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center z-10">
                        <h3 className="text-sm xs:text-base font-medium truncate">{product.name}</h3>
                      </div>
                    </Link>
                  </div>

                  {/* Desktop layout: keep original fixed-height container and Next.js Image cover details */}
                  <div className="hidden md:block relative w-full h-full">
                    <Link href={`/product/${product.slug || product._id}`} className="block relative w-full h-full">
                      <Image
                        src={optimizeImageUrl(product.images && product.images[0]?.url || '/perfume-placeholder.jpg', 800)}
                        alt={product.name || "Perfume product"}
                        fill
                        sizes="50vw"
                        priority={index === 0}
                        className="object-contain p-4 md:p-6 lg:p-8"
                      />
                    </Link>
                  </div>
                </div>
                
                {/* Content - Hidden on mobile, Visible on Desktop: Right side */}
                <div className="hidden md:flex order-2 md:order-2 flex-col items-center justify-center p-1 xs:p-2 sm:p-4 md:p-6 lg:p-8">
                  <div className="text-center space-y-0.5 xs:space-y-1 sm:space-y-2 md:space-y-4 max-w-sm mx-auto">
                    <div className="bg-[#0B0B0D] text-white px-2.5 py-1 text-[10px] sm:text-xs tracking-[0.15em] uppercase font-semibold mb-0.5 xs:mb-1 md:mb-2">
                      {Math.round(product.discountPercentage || 0)}% OFF
                    </div>
                    
                    <h2 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-bold font-serif">
                      {product.name}
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 sm:line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-row items-center justify-center gap-2 md:gap-4 my-0.5 xs:my-1 sm:my-2 md:my-4">
                      <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#0B0B0D]">
                        ₹{product.discountedPrice}
                      </span>
                      <span className="text-xs sm:text-sm text-[#5A606B] line-through">
                        ₹{product.price}
                      </span>
                    </div>
                    
                    <div className="mt-0.5 xs:mt-1 sm:mt-2 md:mt-4">
                      <ShopNowButton href={`/product/${product.slug || product._id}`} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Navigation arrows - hidden on small screens, visible on medium and up */}
      <button
        onClick={goToPrev}
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10"
        aria-label="Previous product"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={goToNext}
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10"
        aria-label="Next product"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
      
      {/* Indicators - hidden on mobile screens */}
      <div className="hidden sm:flex absolute bottom-1 sm:bottom-2 md:bottom-4 left-0 right-0 justify-center space-x-1.5 sm:space-x-2">
        {displayProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full transition-all ${
              currentIndex === index ? 'bg-black scale-125' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}