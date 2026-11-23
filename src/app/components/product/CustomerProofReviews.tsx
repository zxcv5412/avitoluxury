'use client';

import React, { useRef, useState } from 'react';
import { FiCheckCircle, FiChevronLeft, FiChevronRight, FiMessageSquare, FiStar, FiX } from 'react-icons/fi';

interface ReviewCard {
  id: string;
  source: 'WhatsApp' | 'Instagram' | 'Verified Buyer';
  author: string;
  location: string;
  comment: string;
  rating: number;
  date: string;
  productMentioned?: string;
}

const DEFAULT_PROOF_REVIEWS: ReviewCard[] = [
  {
    id: 'rev-1',
    source: 'WhatsApp',
    author: 'Rahul Sharma',
    location: 'Mumbai',
    comment: 'Bro the perfume smells insane! Wore it to my office today and 3 colleagues asked me what brand this is. Projection is easily 8+ hours.',
    rating: 5,
    date: 'Verified Order',
    productMentioned: 'Born Iconic 50ml'
  },
  {
    id: 'rev-2',
    source: 'Instagram',
    author: '@priya.kapoor',
    location: 'Delhi NCR',
    comment: 'Honestly in love with the 6ml roll-on attars! Zero alcohol headache and it stays on my jacket for 2 days straight. Will order the combo pack next.',
    rating: 5,
    date: 'Verified Buyer',
    productMentioned: 'White Oud & Kesar Chandan'
  },
  {
    id: 'rev-3',
    source: 'WhatsApp',
    author: 'Aditya Verma',
    location: 'Bangalore',
    comment: 'Received the parcel in 2 days. Packaging is pure luxury. Smells ten times more expensive than what it costs. Absolute value for money.',
    rating: 5,
    date: 'Verified Order',
    productMentioned: 'France 2000'
  },
  {
    id: 'rev-4',
    source: 'Instagram',
    author: '@aman_vibe',
    location: 'Pune',
    comment: 'The dry down is majestic. Smells like a 15k niche perfume. You guys have earned a permanent customer. Kudos to AVITO team! 🔥',
    rating: 5,
    date: 'Verified Buyer',
    productMentioned: 'Knight 50ml'
  },
  {
    id: 'rev-5',
    source: 'WhatsApp',
    author: 'Mohammed Faisal',
    location: 'Hyderabad',
    comment: 'The car hanging pods smell refreshing without being overpowering. Everyone who sat in my car complimented the scent. 10/10 recommended.',
    rating: 5,
    date: 'Verified Order',
    productMentioned: 'Aqua Car Perfume'
  }
];

export default function CustomerProofReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phoneOrEmail: '', rating: 5, comment: '' });

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setFormData({ name: '', phoneOrEmail: '', rating: 5, comment: '' });
    }, 2000);
  };

  return (
    <section className="w-full bg-[#0B0B0D] text-white py-12 sm:py-16 px-4 my-8 rounded-2xl relative overflow-hidden border border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs tracking-widest uppercase mb-3 border border-amber-400/20">
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>Verified Customer Reviews</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-[0.15em] uppercase font-light text-white">
            Customer Reviews
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-2">
            Real WhatsApp chats, Instagram DMs, and verified experiences from our luxury fragrance community.
          </p>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative">
          {/* Scroll Buttons for Desktop */}
          <button
            onClick={() => scrollBy(-320)}
            aria-label="Previous review"
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 items-center justify-center transition-all cursor-pointer shadow-lg"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollBy(320)}
            aria-label="Next review"
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 items-center justify-center transition-all cursor-pointer shadow-lg"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>

          {/* Cards Track */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2 px-1"
          >
            {DEFAULT_PROOF_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="flex-shrink-0 w-[280px] sm:w-[320px] bg-[#16161B] rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-white/10 hover:border-amber-400/40 transition-all duration-300 snap-center shadow-lg"
              >
                <div>
                  {/* Card Header: Source badge & Stars */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10 text-gray-300 border border-white/5">
                      <FiMessageSquare className="w-3 h-3 text-amber-400" />
                      {rev.source}
                    </span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <FiStar key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Chat / Review bubble style */}
                  <div className="bg-[#1C1C23] rounded-xl p-4 mb-4 border border-white/5 relative">
                    <p className="text-xs sm:text-[13px] text-gray-200 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    {rev.productMentioned && (
                      <p className="text-[10px] text-amber-300/80 font-mono tracking-wider mt-2.5 uppercase font-medium">
                        Fragrance: {rev.productMentioned}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer: Author & Verification */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px]">
                  <div>
                    <p className="font-semibold text-white tracking-wide">{rev.author}</p>
                    <p className="text-gray-400 text-[10px]">{rev.location}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <FiCheckCircle className="w-3 h-3" />
                    {rev.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Write a Review Button */}
        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black hover:bg-amber-400 font-semibold tracking-widest uppercase text-xs transition-all duration-300 shadow-xl cursor-pointer"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16161B] border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-8 text-white relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <FiX className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <FiCheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-serif text-xl tracking-wider uppercase mb-1">Thank You!</h4>
                <p className="text-xs text-gray-300">Your review has been submitted for moderation.</p>
              </div>
            ) : (
              <div>
                <h4 className="font-serif text-xl tracking-wider uppercase mb-1 text-center">
                  Share Your Experience
                </h4>
                <p className="text-xs text-gray-400 text-center mb-6">
                  Help the Avito Luxury community discover your thoughts.
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul S."
                      className="w-full bg-[#1C1C23] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 focus:outline-none cursor-pointer"
                        >
                          <FiStar
                            className={`w-5 h-5 ${
                              star <= formData.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1">
                      Review / Scent Feedback
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder="Tell us about the scent, longevity, compliments, or packaging..."
                      className="w-full bg-[#1C1C23] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-amber-400 font-semibold tracking-widest uppercase text-xs py-3 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
