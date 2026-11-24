'use client';

import React from 'react';

interface WhereToWearProps {
  occasions?: string[];
  productType?: string;
  category?: string;
}

export default function WhereToWear({ occasions, productType = '', category = '' }: WhereToWearProps) {
  const cat = (category + ' ' + productType).toLowerCase();
  const isCarFreshener = cat.includes('car') || cat.includes('diffuser');
  const isRoomFreshener = cat.includes('room') || cat.includes('air freshener');

  // Title adapts between wear and setting
  const sectionTitle = isCarFreshener || isRoomFreshener ? 'Where to use it' : 'Where to wear it';

  // Determine relevant occasion/setting pills based on category/type
  const defaultOccasions = (() => {
    if (occasions && occasions.length > 0) return occasions;

    if (isCarFreshener) {
      return ['Daily Commute', 'Road Trips', 'Car Interiors', 'Personal Cabin', 'AC Airflow'];
    }
    if (isRoomFreshener) {
      return ['Living Rooms', 'Bed Chambers', 'Wardrobes', 'Office Spaces', 'Home Entryway'];
    }
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
    <div className="w-full bg-[#FAF9F6] text-[#0B0B0D] rounded-xl p-4 sm:p-5 my-4 border border-gray-200/80 shadow-sm">
      <h4 className="text-xs sm:text-sm font-serif tracking-[0.15em] uppercase text-[#0B0B0D] font-medium mb-3">
        {sectionTitle}
      </h4>
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {defaultOccasions.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center text-[11px] sm:text-xs font-medium tracking-wider uppercase bg-white text-gray-700 px-3.5 py-1.5 rounded-full border border-gray-200/90 hover:border-[#8C734B]/60 hover:text-[#8C734B] transition-all cursor-default shadow-xs"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
