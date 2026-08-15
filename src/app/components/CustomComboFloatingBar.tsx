'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiShoppingBag, FiPlus } from 'react-icons/fi';

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
  const maxSlots = 3;
  const isComplete = selectedItems.length === maxSlots;

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
        price: finalPrice,
        comparePrice: totalBasePrice,
        discountedPrice: finalPrice,
        image: selectedItems[0]?.mainImage || (typeof selectedItems[0]?.images?.[0] === 'string' ? selectedItems[0]?.images?.[0] : selectedItems[0]?.images?.[0]?.url) || '/placeholder-image.jpg',
        quantity: 1,
        isBundle: true,
        bundleItems: selectedItems.map(i => ({
          id: i._id,
          name: i.name,
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

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#121318]/95 backdrop-blur-md border-t border-[#C9A24B]/40 shadow-[0_-10px_35px_rgba(0,0,0,0.6)] py-3 px-3 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Combo Info & Slots */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full md:w-auto">
          {/* Badge & Title */}
          <div className="text-center sm:text-left flex-shrink-0">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="bg-[#C9A24B] text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                15% OFF BUNDLE
              </span>
              <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">
                Pick Any 3 (2ml Pocket Perfumes)
              </span>
            </div>
            <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">
              {isComplete 
                ? '🎉 15% discount unlocked!' 
                : `Select ${maxSlots - selectedItems.length} more fragrance${maxSlots - selectedItems.length > 1 ? 's' : ''} to unlock 15% OFF`}
            </p>
          </div>

          {/* 3 Fragrance Slots */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {[0, 1, 2].map((index) => {
              const item = selectedItems[index];
              const imageUrl = item ? (item.mainImage || (typeof item.images?.[0] === 'string' ? item.images?.[0] : item.images?.[0]?.url) || '/placeholder-image.jpg') : null;

              return (
                <div key={index} className="relative">
                  {item ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-[#C9A24B] shadow-md p-1 flex items-center justify-center group overflow-hidden"
                      title={item.name}
                    >
                      <Image
                        src={imageUrl!}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                        title="Remove Scent"
                      >
                        <FiX className="w-4 h-4 text-amber-400" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-gray-600 bg-white/5 flex flex-col items-center justify-center text-gray-400 text-[9px] font-semibold">
                      <FiPlus className="w-4 h-4 text-gray-500 mb-0.5" />
                      <span>Slot {index + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Pricing & CTA Button */}
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full md:w-auto">
          {/* Price Summary */}
          {selectedItems.length > 0 && (
            <div className="text-right">
              <div className="flex items-baseline space-x-2 justify-end">
                <span className="text-[#C9A24B] font-serif font-bold text-lg sm:text-2xl">
                  ₹{finalPrice}
                </span>
                {isComplete && (
                  <span className="text-gray-400 text-xs line-through">
                    ₹{totalBasePrice}
                  </span>
                )}
              </div>
              {isComplete && (
                <span className="text-emerald-400 text-[10px] font-bold block">
                  You Save ₹{discountAmount} (15% OFF)
                </span>
              )}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleAddComboToCart}
            disabled={!isComplete}
            className={`py-3 px-5 sm:px-7 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg ${
              isComplete
                ? 'bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#B89047] hover:from-[#B89047] hover:to-[#C5A059] text-black cursor-pointer transform hover:scale-[1.02] border border-[#E5C158]/60'
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
                    ? `Add 3-Pack to Cart • ₹${finalPrice}` 
                    : `Pick ${maxSlots - selectedItems.length} More`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
