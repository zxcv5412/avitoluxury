'use client';

import React from 'react';

export default function UpiDiscountBanner() {
  return (
    <div className="w-full my-4">
      <div className="bg-[#0B0B0D] text-white border border-gray-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        {/* Left: Offer Text & Icon */}
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            ⚡
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
            ₹50 Extra Discount On UPI / Online Payment
          </span>
        </div>

        {/* Right: Payment Brand Badges */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Google Pay (GPay) */}
          <div className="h-7 px-2 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200" title="Google Pay">
            <svg className="h-3.5 w-auto" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M72.2 92.5v30.4H57.5V47h39.1c7.3 0 13.5 2.5 18.5 7.4 5.1 4.9 7.7 11.1 7.7 18.5s-2.6 13.6-7.7 18.5c-5 4.9-11.2 7.4-18.5 7.4H72.2zm0-31.5v17.4h24.7c3.1 0 5.7-1 7.8-3.1 2.1-2.1 3.2-4.7 3.2-7.8 0-3-1.1-5.6-3.2-7.7-2.1-2.1-4.7-3.1-7.8-3.1H72.2z"/>
              <path fill="#34A853" d="M152 75.3c0 7.8-2.6 14.4-7.8 19.8-5.2 5.4-11.8 8.1-19.8 8.1-7.8 0-14.3-2.6-19.6-7.8-5.2-5.3-7.8-11.8-7.8-19.6 0-8.1 2.6-14.7 7.9-20 5.3-5.3 11.9-7.9 19.9-7.9 7.7 0 14.1 2.6 19.4 7.7l-7.3 7.3c-3.4-3.4-7.4-5.1-12.1-5.1-4.4 0-8.2 1.5-11.3 4.6-3.1 3.1-4.7 6.8-4.7 11.2s1.6 8.1 4.7 11.2c3.1 3.1 6.9 4.6 11.3 4.6 4.7 0 8.7-1.7 12.1-5.2 2.3-2.3 3.6-5.1 4.1-8.5h-16.2V75.3H152z"/>
              <path fill="#FBBC04" d="M190.2 60.5l-20.9 49.3h-15.1l7.8-16.9-13.8-32.4h15.9l7-17.5 6.9 17.5h12.2z"/>
              <path fill="#EA4335" d="M197.8 77.2c0-2.3-.2-4.6-.6-6.7h-31.5v12.7h18c-.8 4.2-3.1 7.8-6.7 10.2v8.5h10.8c6.3-5.8 10-14.4 10-24.7z"/>
            </svg>
          </div>

          {/* PhonePe */}
          <div className="h-7 px-2.5 bg-[#5f259f] rounded-full flex items-center justify-center shadow-sm text-white text-xs font-bold" title="PhonePe">
            पे PhonePe
          </div>

          {/* Paytm */}
          <div className="h-7 px-2 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200" title="Paytm">
            <span className="text-[#002e6e] font-extrabold text-xs tracking-tight">Pay<span className="text-[#00baf2]">tm</span></span>
          </div>

          {/* BHIM UPI */}
          <div className="h-7 px-2 bg-white rounded-full flex items-center justify-center space-x-1 shadow-sm border border-gray-200" title="BHIM UPI">
            <span className="text-[#FF6600] font-black text-xs italic">UPI</span>
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 18L12 4L20 18H4Z" fill="#008450" />
              <path d="M12 4L20 18H14L8 8L12 4Z" fill="#F15A24" />
            </svg>
          </div>

          {/* Razorpay */}
          <div className="h-7 px-2 bg-[#0c2340] rounded-full flex items-center justify-center space-x-1 shadow-sm border border-blue-900" title="Razorpay Secure">
            <svg className="h-3.5 w-auto" viewBox="0 0 100 100" fill="none">
              <path d="M15 85L45 15H85L55 85H15Z" fill="#072654" />
              <path d="M35 85L75 15H85L45 85H35Z" fill="#3395FF" />
            </svg>
            <span className="text-white font-bold text-[10px] tracking-tighter">Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
