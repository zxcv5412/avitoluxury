import Link from 'next/link';

interface ShopNowButtonProps {
  href: string;
  className?: string;
}

export default function ShopNowButton({ href, className = '' }: ShopNowButtonProps) {
  return (
    <Link href={href}>
      <div className={`inline-flex items-center justify-center bg-[#0B0B0D] hover:bg-black text-white hover:text-amber-200 border border-gray-800 hover:border-amber-400/40 px-6 sm:px-8 py-3 rounded-full shadow-md transition-all duration-300 group tracking-[0.15em] uppercase text-xs sm:text-sm font-semibold cursor-pointer ${className}`}>
        <span>Shop Now</span>
        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1 text-amber-400">→</span>
      </div>
    </Link>
  );
}