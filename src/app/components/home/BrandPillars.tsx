'use client';

import React from 'react';
import { FiClock, FiDroplet, FiShield, FiAward } from 'react-icons/fi';

const PILLARS = [
  {
    icon: FiDroplet,
    title: 'Extrait de Parfum Density',
    subtitle: 'Higher Oil Concentration',
    description: 'Blended with premium fragrance oils for rich depth, avoiding the harsh alcoholic blast of mass-market colognes.'
  },
  {
    icon: FiClock,
    title: 'Extended Maceration',
    subtitle: 'Artisanal 60-Day Aging',
    description: 'Every batch is aged in controlled temperatures to allow the top, heart, and base notes to reach full olfactory maturity.'
  },
  {
    icon: FiAward,
    title: '12+ Hours Longevity',
    subtitle: 'Climate-Tested Sillage',
    description: 'Engineered specifically for the Indian climate. Delivers powerful initial projection that settles into an enduring skin trail.'
  },
  {
    icon: FiShield,
    title: '100% Skin Safe',
    subtitle: 'Zero Harsh Chemicals',
    description: 'Non-irritating, IFRA-compliant formulations. Alcohol-free roll-ons and dermatologically safe perfume sprays.'
  }
];

export default function BrandPillars() {
  return (
    <section className="w-full bg-white text-[#0B0B0D] py-16 sm:py-24 px-4 border-t border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#8C734B] uppercase mb-2">
            The Avito Standard
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.15em] text-[#0B0B0D]">
            Pure Luxury Without Compromise
          </h2>
          <div className="w-12 h-[1.5px] bg-[#8C734B]/60 mx-auto mt-4 mb-4" />
          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
            Crafted for fragrance connoisseurs who refuse to settle for weak projection or synthetic aftertastes.
          </p>
        </div>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="bg-[#FAF9F6] rounded-2xl p-6 sm:p-7 border border-gray-200/70 hover:border-[#8C734B]/40 hover:bg-white transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Luxury Icon Badge */}
                  <div className="w-12 h-12 rounded-xl bg-[#FAF6EE] border border-[#EADBCE] text-[#8C734B] flex items-center justify-center mb-5 group-hover:bg-[#8C734B] group-hover:text-white group-hover:border-[#8C734B] transition-all duration-300">
                    <Icon className="w-5 h-5 stroke-[1.6]" />
                  </div>

                  {/* Subtitle / Eyebrow */}
                  <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#8C734B] font-semibold mb-1">
                    {pillar.subtitle}
                  </p>

                  {/* Title */}
                  <h3 className="font-serif text-base sm:text-lg font-medium text-[#0B0B0D] mb-2.5 tracking-wide">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
