

export const metadata = {
  title: 'Luxury Fragrance Collection | Premium Perfumes',
  description: 'Explore our exclusive collection of luxury fragrances and premium perfumes. Find your signature scent with options for all genders and preferences.',
  keywords: 'luxury perfume, premium fragrance, cologne, scent collection, fragrance shop',
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 