'use client';

import React from 'react';

export default function UpiDiscountBanner() {
  return (
    <div className="w-full my-4">
      <div className="bg-[#1A1A1A] text-white border border-[#C9A24B]/30 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        {/* Left: Offer Text & Icon */}
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C9A24B]/20 text-[#C9A24B] text-xs font-bold">
            ⚡
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
            <span className="text-[#C9A24B] font-bold">₹50 Extra Discount</span> On UPI / Prepaid Orders
          </span>
        </div>

        {/* Right: Authentic Payment Brand Badges */}
        <div className="flex items-center space-x-2 flex-wrap justify-center sm:justify-end gap-y-1.5 flex-shrink-0">
          {/* Google Pay (GPay) */}
          <div className="h-7 px-3 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200 hover:scale-105 transition-transform" title="Google Pay">
            <span className="text-xs font-bold font-sans tracking-tight text-[#5F6368] flex items-center">
              <span className="text-[#4285F4] text-sm font-black mr-0.5">G</span>Pay
            </span>
          </div>

          {/* PhonePe */}
          <div className="h-7 px-3 bg-[#5F259F] rounded-lg flex items-center justify-center space-x-1 shadow-sm text-white text-xs font-bold hover:scale-105 transition-transform" title="PhonePe">
            <span className="bg-white text-[#5F259F] rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] font-black">पे</span>
            <span>PhonePe</span>
          </div>

          {/* Paytm */}
          <div className="h-7 px-3 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200 hover:scale-105 transition-transform" title="Paytm">
            <span className="text-[#002E6E] font-black text-xs tracking-tight">
              Pay<span className="text-[#00BAF2]">tm</span>
            </span>
          </div>

          {/* BHIM UPI */}
          <div className="h-7 px-3 bg-white rounded-lg flex items-center justify-center space-x-1 shadow-sm border border-gray-200 hover:scale-105 transition-transform" title="BHIM UPI">
            <span className="text-[#FF6600] font-black text-xs italic tracking-tighter">UPI</span>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 18L12 4L20 18H4Z" fill="#008450" />
              <path d="M12 4L20 18H14L8 8L12 4Z" fill="#F15A24" />
            </svg>
          </div>

          {/* Razorpay */}
          <div className="h-7 px-3 bg-[#0C2340] rounded-lg flex items-center justify-center space-x-1 shadow-sm border border-[#173860] hover:scale-105 transition-transform" title="Razorpay Secure">
            <svg className="h-3.5 w-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 80L50 20H80L50 80H20Z" fill="#0284C7" />
              <path d="M40 80L75 20H85L50 80H40Z" fill="#38BDF8" />
            </svg>
            <span className="text-white font-bold text-xs tracking-tight">Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
