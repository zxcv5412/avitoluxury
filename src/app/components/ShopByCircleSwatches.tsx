'use client';

import React from 'react';
import Link from 'next/link';

export interface StorySwatch {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive?: boolean;
  order?: number;
}

// High-end default presets if no custom swatches configured in admin
export const DEFAULT_STORY_SWATCHES: StorySwatch[] = [
  {
    id: 'swatch-2ml',
    title: '2 ML ROLL-ONS',
    imageUrl: 'https://res.cloudinary.com/dqtkw2hvh/image/upload/v1720000000/placeholder_attar.jpg',
    linkUrl: '/collection?volume=2ml',
    isActive: true,
    order: 1
  },
  {
    id: 'swatch-3ml',
    title: '3 ML ATTARS',
    imageUrl: 'https://res.cloudinary.com/dqtkw2hvh/image/upload/v1720000000/placeholder_attar.jpg',
    linkUrl: '/collection?volume=3ml',
    isActive: true,
    order: 2
  },
  {
    id: 'swatch-6ml',
    title: '6 ML ATTARS',
    imageUrl: 'https://res.cloudinary.com/dqtkw2hvh/image/upload/v1720000000/placeholder_attar.jpg',
    linkUrl: '/collection?volume=6ml',
    isActive: true,
    order: 3
  },
  {
    id: 'swatch-12ml',
    title: '12 ML ATTARS',
    imageUrl: 'https://res.cloudinary.com/dqtkw2hvh/image/upload/v1720000000/placeholder_attar.jpg',
    linkUrl: '/collection?volume=12ml',
    isActive: true,
    order: 4
  },
  {
    id: 'swatch-30ml',
    title: '30 ML PERFUMES',
    imageUrl: 'https://res.cloudinary.com/dqtkw2hvh/image/upload/v1720000000/placeholder_perfume.jpg',
    linkUrl: '/collection?volume=30ml',
    isActive: true,
    order: 5
  },
  {
    id: 'swatch-50ml',
    title: '50 ML PERFUMES',
    imageUrl: 'https://res.cloudinary.com/dqtkw2hvh/image/upload/v1720000000/placeholder_perfume.jpg',
    linkUrl: '/collection?volume=50ml',
    isActive: true,
    order: 6
  },
  {
    id: 'swatch-100ml',
    title: '100 ML SPRAYS',
    imageUrl: 'https://res.cloudinary.com/dqtkw2hvh/image/upload/v1720000000/placeholder_perfume.jpg',
    linkUrl: '/collection?volume=100ml',
    isActive: true,
    order: 7
  },
  {
    id: 'swatch-car',
    title: 'CAR FRESHENERS',
    imageUrl: 'https://res.cloudinary.com/dqtkw2hvh/image/upload/v1720000000/placeholder_car.jpg',
    linkUrl: '/air-fresheners/car',
    isActive: true,
    order: 8
  }
];

interface ShopByCircleSwatchesProps {
  swatches?: StorySwatch[];
}

export default function ShopByCircleSwatches({ swatches }: ShopByCircleSwatchesProps) {
  // Only display swatches if explicitly configured and marked active in the Admin Panel
  // If no swatches are added in the Admin Panel, return null (render nothing on website)
  const activeSwatches = Array.isArray(swatches)
    ? swatches.filter(s => s.isActive !== false)
    : [];

  if (!activeSwatches || activeSwatches.length === 0) return null;

  return (
    <section className="w-full bg-white border-b border-gray-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading matching website's brand serif font */}
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-[0.15em] text-[#0B0B0D]">
            Shop By Category & Size
          </h3>
        </div>

        {/* Scrollable Story Swatches Bar */}
        <div className="flex items-center justify-start md:justify-center gap-5 sm:gap-7 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-3 px-2">
          {activeSwatches.map((item) => (
            <Link
              key={item.id}
              href={item.linkUrl}
              className="flex-shrink-0 flex flex-col items-center group snap-center cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              {/* Outer Ring Circle Container - Enlarged for pleasant aesthetic */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-[2px] bg-gradient-to-tr from-gray-900 via-gray-700 to-gray-400 group-hover:from-black group-hover:to-black transition-all shadow-md">
                <div className="w-full h-full rounded-full p-[2px] bg-white">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-white flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          // Hide broken image
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      /* Only show letter icon if NO image URL exists */
                      <span className="text-xs sm:text-sm font-bold text-gray-800 tracking-tighter uppercase px-1 text-center">
                        {item.title.split(' ')[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Title Text Under Circle - Styled matching website fonts with 2-line wrap */}
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-center uppercase text-[#0B0B0D] mt-2.5 max-w-[85px] sm:max-w-[105px] md:max-w-[125px] leading-tight group-hover:text-black">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
