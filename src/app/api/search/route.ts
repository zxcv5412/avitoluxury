import { NextRequest, NextResponse } from 'next/server';
import Product from '@/app/models/Product';
import connectMongoDB from '@/app/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    
    // Parse query parameters
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const type = url.searchParams.get('type') || 'all';
    const category = url.searchParams.get('category');
    const gender = url.searchParams.get('gender');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    
    // Build filter object
    const filter: any = {};
    
    // Handle category-based search
    if (type === 'category' && category) {
      // Handle category mapping
      if (category === 'perfumes') {
        filter.productType = 'Perfumes';
      } else if (category === 'attars') {
        filter.productType = 'Aesthetic Attars';
      } else if (category === 'fresheners') {
        filter.productType = 'Air Fresheners';
      } else if (category === 'waxfume') {
        filter.productType = 'Waxfume (Solid)';
      } else {
        filter.category = category;
      }
      
      // Add text search within the category if query exists
      if (query) {
        filter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }
    } else if (query) {
      // Text search with query for 'all' type
      // Search in multiple fields
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { productType: { $regex: query, $options: 'i' } },
        { subCategories: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Additional filters
    if (gender) {
      filter.gender = gender;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    console.log('Search filter:', filter);
    
    // Execute query with filters
    const products = await Product.find(filter).lean();
    
    console.log(`Found ${products.length} products matching search query`);
    
    // Sort products by search relevance
    const qLower = query.toLowerCase().trim();
    const sortedProducts = [...products].sort((a: any, b: any) => {
      const aName = (a.name || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      
      // 1. Exact name match gets highest priority
      const aExact = aName === qLower;
      const bExact = bName === qLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // 2. Name starting with query gets next priority
      const aStarts = aName.startsWith(qLower);
      const bStarts = bName.startsWith(qLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // 3. Name containing query gets next priority
      const aContains = aName.includes(qLower);
      const bContains = bName.includes(qLower);
      if (aContains && !bContains) return -1;
      if (!aContains && bContains) return 1;
      
      // 4. Default order
      return 0;
    });
    
    return NextResponse.json({ 
      success: true, 
      products: sortedProducts,
      query,
      type,
      category,
      count: sortedProducts.length
    }, { status: 200 });
  } catch (err) {
    console.error('Error searching products:', err);
    return NextResponse.json({ 
      success: false, 
      error: err instanceof Error ? err.message : 'Server error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic'; 