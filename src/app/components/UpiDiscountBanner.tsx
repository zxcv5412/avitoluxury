'use client';

import React from 'react';

export default function UpiDiscountBanner() {
  return (
    <div className="w-full my-4">
      <div className="bg-[#FAF7F2] border border-[#C9A24B] rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Left: Offer Text matching reference image */}
        <div className="flex items-baseline space-x-2 text-center sm:text-left">
          <span className="text-[#C9A24B] font-serif font-semibold text-lg sm:text-xl">
            ₹50
          </span>
          <span className="text-[#2E2E2E] font-normal text-xs sm:text-sm tracking-tight">
            Extra Discount On UPI Payment
          </span>
        </div>

        {/* Right: Circular Brand Badges matching reference image */}
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          {/* Google Pay Badge */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden hover:scale-105 transition-transform" title="Google Pay">
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.66 0 6.84 5.38 3.12 13.22l7.98 6.19C13 13.42 18.01 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.1 24.55c0-1.57-.14-3.09-.38-4.55H24v9.02h12.42c-.54 2.9-2.18 5.36-4.64 7.02l7.5 5.81c4.38-4.04 6.82-9.98 6.82-17.3z"/>
              <path fill="#FBBC05" d="M11.1 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C1.14 16.59 0 20.14 0 24s1.14 7.41 3.12 10.78l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.5-5.81c-2.15 1.45-4.92 2.3-8.39 2.3-5.99 0-11-3.92-12.9-9.91l-7.98 6.19C6.84 42.62 14.66 48 24 48z"/>
            </svg>
          </div>

          {/* PhonePe Badge */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#5F259F] text-white shadow-sm flex items-center justify-center font-bold text-xs sm:text-sm hover:scale-105 transition-transform" title="PhonePe">
            पे
          </div>

          {/* BHIM UPI Badge */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center p-1.5 overflow-hidden hover:scale-105 transition-transform" title="BHIM UPI">
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 18L12 4L20 18H4Z" fill="#008450" />
              <path d="M12 4L20 18H14L8 8L12 4Z" fill="#F15A24" />
            </svg>
          </div>

          {/* Paytm Badge */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden hover:scale-105 transition-transform" title="Paytm">
            <span className="text-[#002E6E] font-black text-[10px] sm:text-xs tracking-tighter">
              Pay<span className="text-[#00BAF2]">tm</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
