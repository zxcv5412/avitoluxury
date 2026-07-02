import ProductListing from '../components/ProductListing';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perfumes Collection | A V I T O   S C E N T S',
  description: 'Explore our exclusive collection of premium and luxury perfumes for every occasion.',
  openGraph: {
    title: 'Perfumes Collection | A V I T O   S C E N T S',
    description: 'Explore our exclusive collection of premium and luxury perfumes for every occasion.',
    url: 'https://www.avitoluxury.in/perfumes',
    type: 'website',
  },
};

export default async function PerfumesPage() {
  return (
    <ProductListing 
      productType="Perfumes"
      title="Perfumes Collection"
      description="Explore our exclusive collection of premium and luxury perfumes for every occasion."
    />
  );
} 