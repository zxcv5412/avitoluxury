'use client';

import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
