'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual store page
    router.push('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#FAFAFA]">
      <p className="text-[#0B0B0D] text-lg font-medium">Redirecting to store...</p>
    </div>
  );
} 