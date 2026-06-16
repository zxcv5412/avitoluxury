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

export default function SaleCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch products with highest discount percentage
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        // Filter for products with discount and calculate discount percentage
        const discountedProducts = data.products
          .filter((product: any) => {
            // Ensure both price and discounted price exist and are valid numbers
            return product.price && product.comparePrice && 
                  product.price > 0 && product.comparePrice > 0 &&
                  product.price > product.comparePrice;
          })
          .map((product: any) => {
            // Convert prices to rupees
            const price = convertToRupees(product.price);
            const discountedPrice = convertToRupees(product.comparePrice);
            
            // Calculate discount percentage
            const discountPercentage = ((price - discountedPrice) / price * 100);
            
            // Normalize the product images structure
            let images = [];
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
              images = product.images.map((img: any) => {
                if (typeof img === 'string') {
                  return { url: img };
                } else if (img && img.url) {
                  return img;
                }
                return null;
              }).filter(Boolean);
            }
            
            // If no valid images found, use mainImage as fallback
            if (images.length === 0 && product.mainImage) {
              images = [{ url: product.mainImage }];
            }
            
            // If still no images, use placeholder
            if (images.length === 0) {
              images = [{ url: '/perfume-placeholder.jpg' }];
            }
            
            return {
              ...product,
              price,
              discountedPrice,
              discountPercentage,
              images
            };
          });
        
        // Sort standard products by discount percentage (highest first)
        let sortedProducts = [...discountedProducts].sort((a: any, b: any) => b.discountPercentage - a.discountPercentage);
        
        // Find if there is a pinned product in the entire product list
        const pinnedProductRaw = data.products.find((p: any) => p.isPinned === true);
        
        if (pinnedProductRaw) {
          // Normalize the pinned product
          const price = convertToRupees(pinnedProductRaw.price);
          const discountedPrice = pinnedProductRaw.comparePrice ? convertToRupees(pinnedProductRaw.comparePrice) : 0;
          const discountPercentage = price && discountedPrice && price > discountedPrice
            ? ((price - discountedPrice) / price * 100)
            : 0;
          
          let images = [];
          if (pinnedProductRaw.images && Array.isArray(pinnedProductRaw.images) && pinnedProductRaw.images.length > 0) {
            images = pinnedProductRaw.images.map((img: any) => {
              if (typeof img === 'string') {
                return { url: img };
              } else if (img && img.url) {
                return img;
              }
              return null;
            }).filter(Boolean);
          }
          
          if (images.length === 0 && pinnedProductRaw.mainImage) {
            images = [{ url: pinnedProductRaw.mainImage }];
          }
          if (images.length === 0) {
            images = [{ url: '/perfume-placeholder.jpg' }];
          }
          
          const normalizedPinned = {
            ...pinnedProductRaw,
            price,
            discountedPrice,
            discountPercentage,
            images
          };
          
          // Remove the pinned product from the regular list if it exists there to avoid duplicates
          sortedProducts = sortedProducts.filter((p: any) => p._id !== pinnedProductRaw._id);
          
          // Insert at the absolute beginning of the carousel array
          sortedProducts.unshift(normalizedPinned);
        }

        // Find if there is a second pinned product in the entire product list
        const pinnedSecondProductRaw = data.products.find((p: any) => p.isPinnedSecond === true);
        
        if (pinnedSecondProductRaw) {
          // Normalize the second pinned product
          const price = convertToRupees(pinnedSecondProductRaw.price);
          const discountedPrice = pinnedSecondProductRaw.comparePrice ? convertToRupees(pinnedSecondProductRaw.comparePrice) : 0;
          const discountPercentage = price && discountedPrice && price > discountedPrice
            ? ((price - discountedPrice) / price * 100)
            : 0;
          
          let images = [];
          if (pinnedSecondProductRaw.images && Array.isArray(pinnedSecondProductRaw.images) && pinnedSecondProductRaw.images.length > 0) {
            images = pinnedSecondProductRaw.images.map((img: any) => {
              if (typeof img === 'string') {
                return { url: img };
              } else if (img && img.url) {
                return img;
              }
              return null;
            }).filter(Boolean);
          }
          
          if (images.length === 0 && pinnedSecondProductRaw.mainImage) {
            images = [{ url: pinnedSecondProductRaw.mainImage }];
          }
          if (images.length === 0) {
            images = [{ url: '/perfume-placeholder.jpg' }];
          }
          
          const normalizedPinnedSecond = {
            ...pinnedSecondProductRaw,
            price,
            discountedPrice,
            discountPercentage,
            images
          };
          
          // Remove the second pinned product from the regular list if it exists there to avoid duplicates
          sortedProducts = sortedProducts.filter((p: any) => p._id !== pinnedSecondProductRaw._id);
          
          // Insert at the second position of the carousel array (index 1 if array size allows, otherwise 0)
          const insertIndex = sortedProducts.length >= 1 ? 1 : 0;
          sortedProducts.splice(insertIndex, 0, normalizedPinnedSecond);
        }
        
        // Take top 6 carousel slides
        const finalCarouselProducts = sortedProducts.slice(0, 6);
        
        setProducts(finalCarouselProducts);
      } catch (err: any) {
        // Silent error handling for security
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
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
    <div className="relative w-full overflow-hidden bg-white h-auto md:h-[500px] lg:h-[600px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-auto md:h-full"
        >
          {displayProducts[currentIndex] && (
            <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-full">
              {/* Image - Mobile: Full screen with link, Desktop: Left side */}
              <div className="order-1 md:order-1 flex items-center justify-center h-auto md:h-full bg-white relative w-full">
                
                {/* Mobile fluid display: stretch to full width, adapt container height dynamically */}
                <div className="block md:hidden w-full relative">
                  <Link href={`/product/${displayProducts[currentIndex].slug || displayProducts[currentIndex]._id}`} className="block w-full">
                    <img
                      src={optimizeImageUrl(displayProducts[currentIndex].images && displayProducts[currentIndex].images[0]?.url || '/perfume-placeholder.jpg', 800)}
                      alt={displayProducts[currentIndex].name || "Perfume product"}
                      className="w-full h-auto block"
                    />
                    {/* Mobile-only discount badge */}
                    <div className="absolute top-4 left-4 bg-red-600 text-white inline-block px-1.5 xs:px-2 py-0.5 text-xs uppercase tracking-wider z-10">
                      {Math.round(displayProducts[currentIndex].discountPercentage || 0)}% OFF
                    </div>
                    {/* Mobile-only product name overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center z-10">
                      <h3 className="text-sm xs:text-base font-medium truncate">{displayProducts[currentIndex].name}</h3>
                    </div>
                  </Link>
                </div>

                {/* Desktop layout: keep original fixed-height container and Next.js Image cover details */}
                <div className="hidden md:block relative w-full h-full">
                  <Link href={`/product/${displayProducts[currentIndex].slug || displayProducts[currentIndex]._id}`} className="block relative w-full h-full">
                    <Image
                      src={optimizeImageUrl(displayProducts[currentIndex].images && displayProducts[currentIndex].images[0]?.url || '/perfume-placeholder.jpg', 800)}
                      alt={displayProducts[currentIndex].name || "Perfume product"}
                      fill
                      sizes="50vw"
                      priority={currentIndex === 0}
                      className="object-contain p-4 md:p-6 lg:p-8"
                    />
                  </Link>
                </div>
              </div>
              
              {/* Content - Hidden on mobile, Visible on Desktop: Right side */}
              <div className="hidden md:flex order-2 md:order-2 flex-col items-center justify-center p-1 xs:p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="text-center space-y-0.5 xs:space-y-1 sm:space-y-2 md:space-y-4 max-w-sm mx-auto">
                  <div className="bg-red-600 text-white inline-block px-1.5 xs:px-2 py-0.5 text-xs uppercase tracking-wider mb-0.5 xs:mb-1 md:mb-2">
                    {Math.round(displayProducts[currentIndex].discountPercentage || 0)}% OFF
                  </div>
                  
                  <h2 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-bold font-serif">
                    {displayProducts[currentIndex].name}
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 sm:line-clamp-2">
                    {displayProducts[currentIndex].description}
                  </p>
                  
                  <div className="flex flex-row items-center justify-center gap-1 xs:gap-2 md:gap-4 my-0.5 xs:my-1 sm:my-2 md:my-4">
                    <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                      ₹{displayProducts[currentIndex].discountedPrice}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      ₹{displayProducts[currentIndex].price}
                    </span>
                  </div>
                  
                  <div className="mt-0.5 xs:mt-1 sm:mt-2 md:mt-4">
                    <ShopNowButton href={`/product/${displayProducts[currentIndex].slug || displayProducts[currentIndex]._id}`} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
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
    </div>
  );
}