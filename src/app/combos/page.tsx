import ProductListing from '../components/ProductListing';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Combos Collection | A V I T O   S C E N T S',
  description: 'Explore our exclusive luxury combo sets and discovery packs offering complementary fragrances at exceptional value.',
};

export default async function CombosPage() {
  return (
    <ProductListing 
      category="Combo Sets"
      title="All Combos Collection"
      description="Explore our carefully curated combo sets and discovery packs offering complementary fragrances at exceptional value."
    />
  );
}
