import Link from 'next/link';

interface ShopNowButtonProps {
  href: string;
  className?: string;
}

export default function ShopNowButton({ href, className = '' }: ShopNowButtonProps) {
  return (
    <Link href={href}>
      <div className={`bg-[#0B0B0D] text-white px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-none flex items-center justify-between hover:bg-[#1A1C21] transition-colors text-xs xs:text-sm sm:text-base ${className}`}>
        <span className="font-medium">Shop Now</span>
        <span className="ml-2">→</span>
      </div>
    </Link>
  );
} 