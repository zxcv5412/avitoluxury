'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FragranceNoteItem } from '@/app/lib/fragranceNotesData';

interface VisualNotesProps {
  notes: FragranceNoteItem[];
  title?: string;
}

export default function VisualNotes({ notes, title = 'NOTES' }: VisualNotesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [notes]);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!notes || notes.length === 0) return null;

  return (
    <section className="w-full bg-[#FAF9F6] text-[#0B0B0D] rounded-2xl p-5 sm:p-7 my-6 border border-gray-200/80 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-serif text-base sm:text-lg tracking-[0.2em] uppercase font-normal text-[#0B0B0D]">
            {title}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#8C734B] tracking-wider uppercase font-medium mt-0.5">
            Key Olfactory Ingredients
          </p>
        </div>

        {/* Scroll Controls (Desktop & Mobile) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollBy(-180)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all ${
              canScrollLeft
                ? 'border-gray-300 bg-white text-gray-800 hover:bg-black hover:text-white cursor-pointer shadow-xs'
                : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-40'
            }`}
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollBy(180)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all ${
              canScrollRight
                ? 'border-gray-300 bg-white text-gray-800 hover:bg-black hover:text-white cursor-pointer shadow-xs'
                : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-40'
            }`}
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Cards Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 pt-1"
      >
        {notes.map((note, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[120px] sm:w-[135px] flex flex-col group snap-start cursor-default"
          >
            {/* Card Image Container */}
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 border border-gray-200/90 shadow-xs group-hover:border-[#8C734B]/60 transition-all duration-300">
              <img
                src={note.imageUrl}
                alt={note.name}
                loading="lazy"
                onError={(e) => {
                  // Fallback to botanical aroma placeholder if image fails to load
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Type pill if available */}
              {note.type && (
                <span className="absolute top-2 left-2 text-[9px] font-bold tracking-widest uppercase bg-white/90 backdrop-blur-sm text-[#0B0B0D] px-2 py-0.5 rounded-full border border-gray-200 shadow-xs">
                  {note.type}
                </span>
              )}
            </div>

            {/* Note Name & Sensory Tag */}
            <div className="mt-2.5 text-center">
              <p className="text-xs sm:text-sm font-serif tracking-wider text-[#0B0B0D] font-medium">
                {note.name.toUpperCase()}
              </p>
              <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#8C734B] font-semibold mt-0.5">
                {note.descriptor}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
