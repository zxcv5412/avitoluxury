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
    <section className="w-full bg-[#0B0B0D] text-white py-14 sm:py-20 px-4 border-t border-b border-white/5 relative overflow-hidden">
      {/* Subtle luxury ambient backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase mb-2">
            The Avito Standard
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.15em] text-white">
            Pure Luxury Without Compromise
          </h2>
          <div className="w-12 h-[1px] bg-amber-400/40 mx-auto mt-4 mb-4" />
          <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
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
                className="bg-[#141418] rounded-2xl p-6 sm:p-7 border border-white/5 hover:border-amber-400/30 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all duration-300 mb-5">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>

                  {/* Text */}
                  <p className="text-[10px] font-mono tracking-widest uppercase text-amber-300/80 font-medium mb-1">
                    {pillar.subtitle}
                  </p>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-white mb-2.5 tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
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
