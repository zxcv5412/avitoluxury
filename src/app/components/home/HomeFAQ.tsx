'use client';

import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FAQS = [
  {
    q: 'How long do Avito fragrances last on skin and clothes?',
    a: 'Our Eau de Parfum (EDP) formulations and concentrated Attar oils are engineered with a higher percentage of pure fragrance essence. Spray perfumes deliver 8 to 12 hours of noticeable projection, while our concentrated roll-on attars linger on clothing for up to 24 to 48 hours without fading.'
  },
  {
    q: 'What is the difference between Attars (Roll-on) and Perfumes (EDP)?',
    a: 'Attars are 100% alcohol-free, concentrated perfume oils applied via roll-on directly to pulse points, offering intimate depth and immense longevity. Eau de Parfum (EDP) sprays use fine cosmetic-grade alcohol to vaporize into a wider projection cloud, ideal for evening entrances and daytime presence.'
  },
  {
    q: 'Is Cash on Delivery (COD) available, and how fast is delivery?',
    a: 'Yes, we provide Cash on Delivery (COD) across 19,000+ pincodes in India. Orders are processed within 24 hours and delivered in 2 to 5 business days via premium air express couriers in tamper-proof luxury packaging.'
  },
  {
    q: 'Are Avito products safe for sensitive skin?',
    a: 'All our formulations adhere strictly to global IFRA standards. We use skin-friendly botanical essences and cosmetic-grade aroma molecules free from harsh phthalates, parabens, and toxic fixatives.'
  },
  {
    q: 'Can I test multiple fragrances before purchasing full 50ml or 100ml bottles?',
    a: 'Yes! We specially created the Avito Discovery Set and 2ml / 8ml Pocket Combo sets so you can experience our full olfactory range at home before committing to a signature full-size bottle.'
  }
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-14 sm:py-20 px-4 border-b border-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#5A606B] uppercase mb-2">
            Clear Answers
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.15em] text-[#0B0B0D]">
            Frequently Asked Questions
          </h2>
          <div className="w-10 h-[1.5px] bg-[#0B0B0D] mx-auto mt-3" />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-gray-50/70 hover:bg-gray-100/70 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-sm sm:text-base font-normal tracking-wide text-[#0B0B0D] pr-4">
                    {faq.q}
                  </span>
                  <FiChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-light border-t border-gray-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
