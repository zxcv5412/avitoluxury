import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import mongoose from 'mongoose';
import connectMongoDB from '@/app/lib/mongodb';
import ProductModel from '@/app/models/Product';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

async function getProductData(id: string) {
  try {
    await connectMongoDB();
    
    // Decode just in case
    const decodedId = decodeURIComponent(id);
    let product;
    
    // Try to find by MongoDB ObjectId first
    if (mongoose.Types.ObjectId.isValid(decodedId)) {
      try {
        product = await ProductModel.findById(decodedId).lean();
      } catch (err) {
        console.error("Cast error on findById, ignoring...", err);
      }
    }
    
    if (!product && mongoose.Types.ObjectId.isValid(id)) {
      try {
        product = await ProductModel.findById(id).lean();
      } catch (err) {}
    }
    
    // If not found or not a valid ObjectId, try to find by slug or custom ID field
    if (!product) {
      product = await ProductModel.findOne({ 
        $or: [
          { slug: decodedId },
          { customId: decodedId },
          { sku: decodedId },
          { slug: id },
          { customId: id },
          { sku: id }
        ]
      }).lean();
    }

    // Fallback: If not found, check if it matches a trailing random number (slug-XXXXXX)
    if (!product) {
      const suffixMatch = decodedId.match(/^(.+)-\d+$/) || id.match(/^(.+)-\d+$/);
      if (suffixMatch) {
        const baseSlug = suffixMatch[1];
        product = await ProductModel.findOne({
          $or: [
            { slug: baseSlug },
            { slug: new RegExp(`^${baseSlug}-\\d+$`, 'i') },
            { customId: baseSlug },
            { sku: baseSlug }
          ]
        }).lean();
      }
    }

    return product;
  } catch (error) {
    console.error('Error fetching product in Server Component:', error);
    return null;
  }
}

// Generate Dynamic Metadata for SEO and Social Sharing
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductData(id);

  if (!product) {
    return {
      title: 'Product Not Found | AVITO SCENTS',
    };
  }

  // Get the main image
  let imageUrl = product.mainImage || '/placeholder-image.jpg';
  if (product.images && product.images.length > 0) {
    if (typeof product.images[0] === 'string') {
      imageUrl = product.images[0];
    } else if (product.images[0] && (product.images[0] as any).url) {
      imageUrl = (product.images[0] as any).url;
    }
  }

  // Optimize Cloudinary URL for social sharing previews (1200x630 is standard)
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.includes('res.cloudinary.com') && imageUrl.includes('/upload/')) {
    imageUrl = imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_1200,h_630,c_fill/');
  }

  return {
    title: `${product.name} | AVITO SCENTS`,
    description: product.description?.substring(0, 160) || 'Discover premium luxury fragrances at AVITO SCENTS.',
    openGraph: {
      title: `${product.name} | Premium Luxury Fragrance`,
      description: product.description?.substring(0, 160),
      url: `https://avitoluxury.in/product/${product.slug || product._id}`,
      siteName: 'AVITO SCENTS',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description?.substring(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const rawProduct = await getProductData(id);

  if (!rawProduct) {
    notFound();
  }

  // Transform DB data to match what ProductClient expects
  const productData = {
    _id: rawProduct._id?.toString() || id,
    name: rawProduct.name || "Unknown Product",
    slug: rawProduct.slug || "",
    description: rawProduct.description || "No description available",
    price: rawProduct.price || 0,
    discountedPrice: rawProduct.comparePrice || 0,
    category: rawProduct.category || "Perfume",
    brand: rawProduct.brand || 'A V I T O   S C E N T S',
    images: Array.isArray(rawProduct.images) ? 
      rawProduct.images.map((img: any) => ({ url: typeof img === 'string' ? img : img?.url || '' })).filter((img: any) => img.url) : 
      [{ url: rawProduct.mainImage || 'https://placehold.co/600x800/222/fff?text=Product' }],
    videos: Array.isArray(rawProduct.videos) ? 
      rawProduct.videos.map((vid: any) => ({ url: typeof vid === 'string' ? vid : vid?.url || '' })).filter((vid: any) => vid.url) : 
      [],
    stock: rawProduct.quantity || 0,
    bulletPoints: rawProduct.bulletPoints || [],
    fragrance_notes: {
      top: [rawProduct.gender || 'Unisex'],
      middle: [rawProduct.volume || '50ml'],
      base: rawProduct.subCategories && rawProduct.subCategories.length > 0 ? 
        rawProduct.subCategories : ['Scent']
    },
    concentration: rawProduct.productType || 'Eau de Parfum',
    size: parseInt((rawProduct.volume || '').toString().replace(/[^0-9]/g, '') || '50'),
    gender: rawProduct.gender || 'Unisex',
    productType: rawProduct.productType || 'Eau de Parfum',
    volumeRaw: rawProduct.volume || ""
  };

  // Generate JSON-LD for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.name,
    image: productData.images[0]?.url,
    description: productData.description,
    sku: rawProduct.sku || productData._id,
    brand: {
      '@type': 'Brand',
      name: productData.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://avitoluxury.in/product/${productData.slug || productData._id}`,
      priceCurrency: 'INR',
      price: productData.discountedPrice > 0 ? productData.discountedPrice : productData.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: productData.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rawProduct.rating || 5.0,
      reviewCount: Math.floor(Math.random() * 50) + 10, // Placeholder until reviews feature is added
    }
  };

  return (
    <>
      {/* Inject Google Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient initialProduct={productData} id={id} />
    </>
  );
}
