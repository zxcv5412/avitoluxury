'use client';

import React from 'react';

export default function UpiDiscountBanner() {
  return (
    <div className="w-full my-4">
      <div className="bg-[#0B0B0D] text-white border border-gray-800 rounded-lg p-3 sm:p-3.5 flex flex-col xs:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Discount Text */}
        <div className="flex items-center space-x-2 text-center xs:text-left">
          <span className="inline-block bg-white/10 text-white p-1 rounded-full text-xs">⚡</span>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
            ₹50 Extra Discount On UPI Payment
          </span>
        </div>

        {/* Payment Provider Badges */}
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {/* GPay */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center p-1 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>

          {/* PhonePe */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5f259f] flex items-center justify-center p-1 text-white text-[10px] font-bold shadow-sm">
            पे
          </div>

          {/* BHIM / UPI */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center p-1 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path fill="#000000" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5z"/>
              <path fill="#FF6600" d="M8 10h8v4H8z"/>
            </svg>
          </div>

          {/* Paytm */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#002e6e] flex items-center justify-center p-0.5 text-white text-[9px] font-extrabold tracking-tighter shadow-sm">
            Paytm
          </div>
        </div>
      </div>
    </div>
  );
}
