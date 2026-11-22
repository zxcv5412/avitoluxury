'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
    title: '2 ML ATTARS',
    imageUrl: 'https://ik.imagekit.io/kketfxdcu/2%20ml%20Listing%20Combo%20(final)/S_F_J_2ml_clean.png?updatedAt=1795276839329',
    linkUrl: '/collection?volume=2ml',
    isActive: true,
    order: 1
  },
  {
    id: 'swatch-6ml',
    title: '6 ML ATTARS',
    imageUrl: 'https://ik.imagekit.io/kketfxdcu/All%206%20ml%20Attar%20Listing%20(Final)/Avito%20Luxury%20Attar%20Collection.png',
    linkUrl: '/collection?volume=6ml',
    isActive: true,
    order: 2
  },
  {
    id: 'swatch-10ml',
    title: '10 ML EDP',
    imageUrl: 'https://ik.imagekit.io/kketfxdcu/10%20ml/cover_1.png',
    linkUrl: '/perfumes?volume=10ml',
    isActive: true,
    order: 3
  },
  {
    id: 'swatch-20ml',
    title: '20 ML EDP',
    imageUrl: 'https://ik.imagekit.io/kketfxdcu/20%20ml%20listing%20(final)/france%202000%20with%20box.png?updatedAt=1795281440653',
    linkUrl: '/collection?volume=20ml',
    isActive: true,
    order: 4
  },
  {
    id: 'swatch-50ml',
    title: '50 ML EDP',
    imageUrl: 'https://ik.imagekit.io/kketfxdcu/50%20ML%20New%20Packing/50%20ml%20listing%20(final)/new-50ml-collection.png?updatedAt=1795277351733',
    linkUrl: '/collection?volume=50ml',
    isActive: true,
    order: 5
  },
  {
    id: 'swatch-100ml',
    title: '100 ML EDP',
    imageUrl: 'https://ik.imagekit.io/kketfxdcu/100%20ml/PEACH_100_ML_TILT.png?updatedAt=1795277313806',
    linkUrl: '/collection?volume=100ml',
    isActive: true,
    order: 6
  },
  {
    id: 'swatch-combo',
    title: 'COMBOS',
    imageUrl: 'https://ik.imagekit.io/kketfxdcu/8%20ml%20combo%20listing%20(final)/1.png',
    linkUrl: '/combos',
    isActive: true,
    order: 7
  },
  {
    id: 'swatch-car',
    title: 'CAR FRESHENERS',
    imageUrl: 'https://ik.imagekit.io/kketfxdcu/Car%20Perfume%20Listing%20(Final)/car_perfume_combo_product.jpg?updatedAt=1795271494624',
    linkUrl: '/air-fresheners/car',
    isActive: true,
    order: 8
  },
  {
    id: 'swatch-room',
    title: 'ROOM FRESHENERS',
    imageUrl: 'https://ik.imagekit.io/kketfxdcu/Air%20Fresheners%20Listing%20(final)/All%20in%20One.png?updatedAt=1795271448587',
    linkUrl: '/air-fresheners/room',
    isActive: true,
    order: 9
  }
];

interface ShopByCircleSwatchesProps {
  swatches?: StorySwatch[];
}

export default function ShopByCircleSwatches({ swatches }: ShopByCircleSwatchesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Only display swatches if explicitly configured and marked active in the Admin Panel
  // If no swatches are added in the Admin Panel, return null (render nothing on website)
  const activeSwatches = Array.isArray(swatches)
    ? swatches.filter(s => s.isActive !== false)
    : [];

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [activeSwatches]);

  const scrollBy = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!activeSwatches || activeSwatches.length === 0) return null;

  return (
    <section className="w-full bg-white border-b border-gray-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading matching website's brand serif font */}
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-[0.15em] text-[#0B0B0D]">
            Shop By Category & Size
          </h3>
        </div>

        {/* Scrollable Story Swatches Bar Wrapper with relative positioning for desktop arrows */}
        <div className="relative group/swatches">
          {/* Desktop Left Scroll Button (only visible when scrolled right) */}
          {canScrollLeft && (
            <button
              onClick={() => scrollBy(-240)}
              aria-label="Scroll left"
              className="hidden md:flex absolute -left-2 sm:-left-3 top-[42%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 border border-gray-200 shadow-md items-center justify-center text-gray-800 hover:bg-black hover:text-white transition-all cursor-pointer"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Desktop Right Scroll Button (only visible when content overflows right) */}
          {canScrollRight && (
            <button
              onClick={() => scrollBy(240)}
              aria-label="Scroll right"
              className="hidden md:flex absolute -right-2 sm:-right-3 top-[42%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 border border-gray-200 shadow-md items-center justify-center text-gray-800 hover:bg-black hover:text-white transition-all cursor-pointer"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Scrollable Story Swatches Track */}
          <div
            ref={scrollContainerRef}
            className="flex items-center justify-start lg:justify-center overflow-x-auto snap-x snap-mandatory scrollbar-hide py-3.5 px-2"
          >
            <div className="flex items-center justify-start lg:justify-center gap-4 sm:gap-6 md:gap-3 lg:gap-4 xl:gap-6 min-w-full w-fit">
              {activeSwatches.map((item) => (
                <Link
                  key={item.id}
                  href={item.linkUrl}
                  className="flex-shrink-0 flex flex-col items-center group snap-center cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  {/* Outer Ring Circle Container - Optimized for mobile + desktop without overflow */}
                  <div className="w-[92px] h-[92px] xs:w-26 xs:h-26 sm:w-28 sm:h-28 md:w-[88px] md:h-[88px] lg:w-[100px] lg:h-[100px] xl:w-[108px] xl:h-[108px] rounded-full p-[2.5px] bg-gradient-to-tr from-gray-900 via-gray-700 to-gray-400 group-hover:from-black group-hover:to-black transition-all shadow-md">
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

                  {/* Title Text Under Circle - Styled matching website fonts with balanced 2-line wrap */}
                  <span className="text-[11px] sm:text-xs md:text-[11px] lg:text-xs font-semibold tracking-wider text-center uppercase text-[#0B0B0D] mt-2.5 max-w-[90px] sm:max-w-[110px] md:max-w-[88px] lg:max-w-[102px] xl:max-w-[114px] leading-tight group-hover:text-black">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
