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
    <section className="w-full bg-[#0D0D11] text-white rounded-2xl p-5 sm:p-7 my-6 shadow-xl border border-white/5 relative overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-serif text-lg sm:text-xl tracking-[0.2em] uppercase font-light text-white">
            {title}
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-400 tracking-wider uppercase mt-0.5">
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
                ? 'border-gray-700 bg-white/10 text-white hover:bg-white hover:text-black cursor-pointer'
                : 'border-gray-800 text-gray-600 cursor-not-allowed opacity-40'
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
                ? 'border-gray-700 bg-white/10 text-white hover:bg-white hover:text-black cursor-pointer'
                : 'border-gray-800 text-gray-600 cursor-not-allowed opacity-40'
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
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-900 border border-white/10 shadow-md group-hover:border-amber-400/40 transition-all duration-300">
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
                <span className="absolute top-2 left-2 text-[9px] font-bold tracking-widest uppercase bg-black/70 backdrop-blur-sm text-gray-200 px-2 py-0.5 rounded-full border border-white/10">
                  {note.type}
                </span>
              )}
            </div>

            {/* Note Name & Sensory Tag */}
            <div className="mt-2.5 text-center">
              <p className="text-xs sm:text-sm font-serif tracking-wider text-gray-200 font-medium">
                {note.name.toUpperCase()}
              </p>
              <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-amber-300/90 font-semibold mt-0.5">
                {note.descriptor}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
