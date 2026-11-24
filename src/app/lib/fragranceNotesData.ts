export interface FragranceNoteItem {
  name: string;
  descriptor: string;
  imageUrl: string;
  type?: 'TOP' | 'HEART' | 'BASE';
}

export const FRAGRANCE_NOTES_DICTIONARY: Record<string, FragranceNoteItem> = {
  pineapple: {
    name: 'Pineapple',
    descriptor: 'JUICY OPENING',
    imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=400&q=80',
    type: 'TOP'
  },
  bergamot: {
    name: 'Bergamot',
    descriptor: 'SPARKLING CITRUS',
    imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=400&q=80',
    type: 'TOP'
  },
  mandarin: {
    name: 'Mandarin',
    descriptor: 'CITRUSY SWEET',
    imageUrl: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=400&q=80',
    type: 'TOP'
  },
  citrus: {
    name: 'Citrus Zest',
    descriptor: 'CRISP & FRESH',
    imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=400&q=80',
    type: 'TOP'
  },
  sea: {
    name: 'Sea Breeze',
    descriptor: 'AQUATIC MINERAL',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    type: 'TOP'
  },
  aqua: {
    name: 'Aqua Marine',
    descriptor: 'OCEANIC FRESH',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    type: 'TOP'
  },
  rose: {
    name: 'Royal Rose',
    descriptor: 'VELVET FLORAL',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    type: 'HEART'
  },
  jasmine: {
    name: 'Jasmine',
    descriptor: 'INTOXICATING BLOOM',
    imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=400&q=80',
    type: 'HEART'
  },
  lavender: {
    name: 'French Lavender',
    descriptor: 'CALMING AROMATIC',
    imageUrl: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?auto=format&fit=crop&w=400&q=80',
    type: 'HEART'
  },
  saffron: {
    name: 'Kesar Saffron',
    descriptor: 'GOLDEN SPICE',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
    type: 'HEART'
  },
  coffee: {
    name: 'Roasted Coffee',
    descriptor: 'WARM GOURMAND',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
    type: 'HEART'
  },
  peach: {
    name: 'Velvet Peach',
    descriptor: 'LUSCIOUS FRUITY',
    imageUrl: 'https://images.unsplash.com/photo-1629828874514-c1e5103f2150?auto=format&fit=crop&w=400&q=80',
    type: 'HEART'
  },
  oud: {
    name: 'Royal Oud',
    descriptor: 'SMOKY RESIN',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    type: 'BASE'
  },
  sandalwood: {
    name: 'Sandalwood',
    descriptor: 'CREAMY SACRED WOOD',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    type: 'BASE'
  },
  chandan: {
    name: 'Chandan',
    descriptor: 'SACRED WOOD',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    type: 'BASE'
  },
  cedarwood: {
    name: 'Cedarwood',
    descriptor: 'DRY WOODY DEPTH',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80',
    type: 'BASE'
  },
  amber: {
    name: 'Golden Amber',
    descriptor: 'WARM SENSUAL GLOW',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80',
    type: 'BASE'
  },
  vanilla: {
    name: 'Bourbon Vanilla',
    descriptor: 'RICH CREAMY SWEET',
    imageUrl: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=400&q=80',
    type: 'BASE'
  },
  musk: {
    name: 'White Musk',
    descriptor: 'CLEAN VELVET TRAIL',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
    type: 'BASE'
  },
  leather: {
    name: 'Supple Leather',
    descriptor: 'BOLD & TIMELESS',
    imageUrl: 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=400&q=80',
    type: 'BASE'
  },
  cinnamon: {
    name: 'Ceylon Cinnamon',
    descriptor: 'WARM SPICE',
    imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80',
    type: 'TOP'
  }
};

/**
 * Derives visual notes for any product based on its fragrance_notes, description, or category/subCategories.
 */
export function getProductVisualNotes(product?: {
  name?: string;
  description?: string;
  category?: string;
  subCategories?: string[];
  productType?: string;
  fragrance_notes?: {
    top?: string[];
    middle?: string[];
    base?: string[];
  };
}): FragranceNoteItem[] {
  if (!product) return [];
  const result: FragranceNoteItem[] = [];
  const addedKeys = new Set<string>();

  const textToScan = [
    product.name || '',
    product.description || '',
    product.category || '',
    ...(product.subCategories || []),
    ...(product.fragrance_notes?.top || []),
    ...(product.fragrance_notes?.middle || []),
    ...(product.fragrance_notes?.base || [])
  ].join(' ').toLowerCase();

  // Check dictionary keys
  for (const [key, item] of Object.entries(FRAGRANCE_NOTES_DICTIONARY)) {
    if (textToScan.includes(key)) {
      if (!addedKeys.has(key)) {
        addedKeys.add(key);
        result.push(item);
      }
    }
    if (result.length >= 6) break;
  }

  // If none matched, provide a luxury default set based on category or general luxury
  if (result.length < 3) {
    const isAttar = product.productType?.toLowerCase().includes('attar');
    const isWoody = textToScan.includes('wood') || textToScan.includes('oud');
    const isFresh = textToScan.includes('aqua') || textToScan.includes('fresh') || textToScan.includes('citrus');

    const defaultKeys = isFresh
      ? ['bergamot', 'sea', 'citrus', 'musk', 'cedarwood']
      : isWoody
      ? ['bergamot', 'sandalwood', 'amber', 'oud', 'vanilla']
      : isAttar
      ? ['rose', 'saffron', 'sandalwood', 'amber', 'musk']
      : ['bergamot', 'rose', 'vanilla', 'cedarwood', 'amber'];

    for (const key of defaultKeys) {
      if (!addedKeys.has(key) && FRAGRANCE_NOTES_DICTIONARY[key]) {
        addedKeys.add(key);
        result.push(FRAGRANCE_NOTES_DICTIONARY[key]);
      }
      if (result.length >= 5) break;
    }
  }

  return result;
}
