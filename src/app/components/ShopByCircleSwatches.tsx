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
    <section className="w-full bg-white border-b border-gray-100 py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#0B0B0D]">
            Shop By Category & Size
          </h3>
        </div>

        {/* Scrollable Story Swatches Bar */}
        <div className="flex items-center justify-start md:justify-center gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2 px-1">
          {activeSwatches.map((item) => (
            <Link
              key={item.id}
              href={item.linkUrl}
              className="flex-shrink-0 flex flex-col items-center group snap-center cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              {/* Outer Ring Circle Container */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-tr from-gray-900 via-gray-700 to-gray-400 group-hover:from-black group-hover:to-black transition-all shadow-sm">
                <div className="w-full h-full rounded-full p-[2px] bg-white">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback placeholder icon on image error
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    {/* Default letter icon if no image */}
                    <span className="text-[11px] sm:text-xs font-bold text-gray-800 tracking-tighter uppercase px-1 text-center">
                      {item.title.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title Text Under Circle */}
              <span className="text-[9px] sm:text-[11px] font-semibold tracking-wider text-center uppercase text-[#0B0B0D] mt-2 max-w-[70px] sm:max-w-[90px] leading-tight truncate group-hover:text-black">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
