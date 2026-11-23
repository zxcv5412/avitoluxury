'use client';

import React from 'react';

interface WhereToWearProps {
  occasions?: string[];
  productType?: string;
  category?: string;
}

export default function WhereToWear({ occasions, productType = '', category = '' }: WhereToWearProps) {
  // Determine relevant occasion pills based on category/type if not explicitly provided
  const defaultOccasions = (() => {
    if (occasions && occasions.length > 0) return occasions;

    const cat = (category + ' ' + productType).toLowerCase();
    if (cat.includes('attar')) {
      return ['Spiritual & Daily', 'Personal Rituals', 'Aesthetic Look', 'Festive Occasions', 'Evening Calm'];
    }
    if (cat.includes('fresh') || cat.includes('aqua') || cat.includes('citrus')) {
      return ['Everyday Fresh', 'Day Trips', 'Gym & Active', 'Casual Hangouts', 'Café Dates'];
    }
    if (cat.includes('oud') || cat.includes('amber') || cat.includes('luxury') || cat.includes('wood')) {
      return ['Date Night', 'Evening Gala', 'Special Occasions', 'Winter Luxury', 'Aesthetic Look'];
    }
    return ['Everyday Fresh', 'Day Trips', 'Aesthetic Look', 'Casual Hangouts', 'Café Dates'];
  })();

  return (
    <div className="w-full bg-[#0D0D11] text-white rounded-xl p-4 sm:p-5 my-4 border border-white/5 shadow-md">
      <h4 className="text-xs sm:text-sm font-serif tracking-[0.15em] uppercase text-gray-300 font-light mb-3">
        Where to wear it
      </h4>
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {defaultOccasions.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center text-[11px] sm:text-xs font-medium tracking-wider uppercase bg-white/10 text-gray-200 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-amber-400/40 hover:bg-white/15 transition-all cursor-default"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
