'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiCheck, FiShoppingBag } from 'react-icons/fi';

export interface ComboProduct {
  _id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  comparePrice?: number;
  mainImage?: string;
  images?: { url: string }[] | string[];
  volume?: string;
  slug?: string;
}

interface CustomComboFloatingBarProps {
  selectedItems: ComboProduct[];
  onRemoveItem: (index: number) => void;
  onClearAll: () => void;
}

export default function CustomComboFloatingBar({
  selectedItems,
  onRemoveItem,
  onClearAll,
}: CustomComboFloatingBarProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const maxSlots = 3;
  const isComplete = selectedItems.length === maxSlots;

  // Listen for MiniCart drawer opening / closing
  React.useEffect(() => {
    const checkMiniCart = () => {
      const miniCartElement = document.querySelector('[data-mini-cart="true"]');
      setIsCartOpen(!!miniCartElement && window.getComputedStyle(miniCartElement).display !== 'none');
    };

    checkMiniCart();

    const observer = new MutationObserver(checkMiniCart);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    const handleOpen = () => setIsCartOpen(true);
    const handleClose = () => setIsCartOpen(false);

    window.addEventListener('openMiniCart', handleOpen);
    window.addEventListener('open-minicart', handleOpen);
    window.addEventListener('closeMiniCart', handleClose);

    return () => {
      observer.disconnect();
      window.removeEventListener('openMiniCart', handleOpen);
      window.removeEventListener('open-minicart', handleOpen);
      window.removeEventListener('closeMiniCart', handleClose);
    };
  }, []);

  // Calculate pricing
  const totalBasePrice = selectedItems.reduce((sum, item) => {
    const p = item.discountedPrice && item.discountedPrice > 0 
      ? item.discountedPrice 
      : (item.price || 49);
    return sum + p;
  }, 0);

  // 15% discount applied when combo is complete
  const discountAmount = isComplete ? Math.round(totalBasePrice * 0.15) : 0;
  const finalPrice = isComplete ? (totalBasePrice - discountAmount) : totalBasePrice;

  const handleAddComboToCart = () => {
    if (!isComplete) return;

    try {
      const existingCart = localStorage.getItem('cart') || '[]';
      const cart = JSON.parse(existingCart);

      const fragranceNames = selectedItems.map(i => i.name).join(' + ');
      const bundleId = `combo-2ml-${Date.now()}`;

      const bundleItem = {
        _id: bundleId,
        id: bundleId,
        name: `Custom 2ml 3-Pack Discovery Combo (${fragranceNames})`,
        price: totalBasePrice,
        comparePrice: totalBasePrice,
        discountedPrice: finalPrice,
        image: selectedItems[0]?.mainImage || (typeof selectedItems[0]?.images?.[0] === 'string' ? selectedItems[0]?.images?.[0] : selectedItems[0]?.images?.[0]?.url) || '/placeholder-image.jpg',
        images: selectedItems.map(i => i.mainImage || (typeof i.images?.[0] === 'string' ? i.images?.[0] : i.images?.[0]?.url) || '/placeholder-image.jpg'),
        quantity: 1,
        isBundle: true,
        bundleItems: selectedItems.map(i => ({
          id: i._id,
          name: i.name,
          image: i.mainImage || (typeof i.images?.[0] === 'string' ? i.images?.[0] : i.images?.[0]?.url) || '/placeholder-image.jpg',
          volume: i.volume || '2ml'
        }))
      };

      cart.push(bundleItem);
      localStorage.setItem('cart', JSON.stringify(cart));

      // Trigger cart event updates
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new CustomEvent('openMiniCart'));

      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClearAll();
      }, 1500);

    } catch (error) {
      console.error('Error adding combo to cart:', error);
    }
  };

  // When mini cart is open, hide the floating bar so it never covers the checkout button
  if (isCartOpen) return null;

  return (
    <div className="fixed bottom-2 sm:bottom-5 inset-x-2 sm:inset-x-auto sm:w-[92%] sm:max-w-4xl sm:left-1/2 sm:-translate-x-1/2 z-30 pointer-events-auto">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full bg-[#121318] border-2 border-[#C9A24B] rounded-2xl sm:rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.95)] p-2.5 sm:p-3.5 px-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4"
      >
        {/* Left: 3 Fragrance Slots & Status */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2.5 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {[0, 1, 2].map((index) => {
              const item = selectedItems[index];
              const imageUrl = item ? (item.mainImage || (typeof item.images?.[0] === 'string' ? item.images?.[0] : item.images?.[0]?.url) || '/placeholder-image.jpg') : null;

              return (
                <div key={index} className="relative flex-shrink-0">
                  {item ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative flex items-center justify-center"
                    >
                      {/* Fragrance Circular Disc */}
                      <div 
                        onClick={() => onRemoveItem(index)}
                        className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-[#C9A24B] shadow-md p-1 flex items-center justify-center overflow-hidden cursor-pointer"
                        title={`${item.name} (Click to remove)`}
                      >
                        <Image
                          src={imageUrl!}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      {/* Micro Cancel '✕' Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onRemoveItem(index);
                        }}
                        style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px' }}
                        className="absolute -top-1 -right-1 bg-black hover:bg-zinc-800 text-[#C9A24B] border border-[#C9A24B] rounded-full flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer z-30 transition-transform active:scale-90"
                        title="Remove scent"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ) : (
                    <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-[#C9A24B]/50 bg-[#1A1A1A] flex flex-col items-center justify-center text-gray-300 shadow-inner">
                      <span className="text-[#C9A24B] text-xs sm:text-sm font-black">#{index + 1}</span>
                      <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium">Empty</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scent Counter / Status Text */}
          <div className="text-left hidden xs:block">
            <div className="flex items-center space-x-1.5">
              <span className="bg-[#C9A24B] text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                15% OFF
              </span>
            </div>
            <p className="text-white text-xs font-bold mt-1 tracking-tight">
              {isComplete 
                ? '🎉 3-Pack Ready!' 
                : `${selectedItems.length}/3 Scents Chosen`}
            </p>
          </div>
        </div>

        {/* Right: Pricing & CTA Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {/* Price Tag */}
          <div className="text-left sm:text-right">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-[#C9A24B] font-serif font-black text-lg sm:text-2xl">
                ₹{finalPrice}
              </span>
              {isComplete && (
                <span className="text-gray-400 text-xs line-through">
                  ₹{totalBasePrice}
                </span>
              )}
            </div>
            <span className="text-emerald-400 text-[10px] sm:text-[11px] font-bold block leading-none">
              {isComplete ? `Save ₹${discountAmount} (15% OFF)` : `Pick ${maxSlots - selectedItems.length} more`}
            </span>
          </div>

          {/* Main Action Button */}
          <button
            onClick={handleAddComboToCart}
            disabled={!isComplete}
            className={`py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-300 shadow-md flex-1 sm:flex-initial ${
              isComplete
                ? 'bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#B89047] hover:from-[#B89047] hover:to-[#C5A059] text-black cursor-pointer transform hover:scale-[1.02] border border-[#E5C158]/70 shadow-[0_0_15px_rgba(201,162,75,0.4)]'
                : 'bg-gray-800 text-gray-400 border border-gray-700 cursor-not-allowed'
            }`}
          >
            {isAdded ? (
              <>
                <FiCheck className="w-4 h-4 text-black" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <FiShoppingBag className="w-4 h-4" />
                <span>
                  {isComplete 
                    ? `Add 3-Pack to Cart` 
                    : `Pick ${maxSlots - selectedItems.length} More`}
                </span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
