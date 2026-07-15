import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-[#0B0B0D]">
      <div className="text-center px-4">
        <h1 className="text-6xl font-serif font-bold mb-6">404</h1>
        <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
        <p className="mb-8 max-w-md mx-auto text-[#5A606B]">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link 
          href="/"
          className="inline-block bg-[#0B0B0D] hover:bg-[#1A1C21] text-white py-3 px-8 rounded-none transition duration-300 uppercase tracking-widest text-xs font-semibold"
        >
          Back to Store
        </Link>
      </div>
    </div>
  );
} 