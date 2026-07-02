import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db-connect';
import SiteSettings from '@/app/models/SiteSettings';
import { verifyAdminToken } from '@/app/lib/auth-utils';
import Product from '@/app/models/Product'; // Ensure Product is registered

export async function GET(request: Request) {
  try {
    // Verify admin authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const isValidAdmin = await verifyAdminToken(token);

    if (!isValidAdmin) {
      return NextResponse.json({ error: 'Forbidden: Invalid or expired token' }, { status: 403 });
    }

    await connectToDatabase();
    
    // Attempt to find existing settings
    let settings = await SiteSettings.findOne({ settingId: 'global' });
    
    const coreCarousels = [
      { id: 'hero-carousel', title: 'Main Hero Carousel', products: [] },
      { id: 'featured-products', title: 'Featured Products Section', products: [] },
      { id: 'new-arrivals', title: 'New Arrivals Section', products: [] },
      { id: 'best-sellers', title: 'Best Sellers Section', products: [] }
    ];
    
    if (!settings) {
      settings = await SiteSettings.create({
        settingId: 'global',
        carousels: coreCarousels
      });
    } else {
      let hasChanges = false;
      for (const core of coreCarousels) {
        if (!settings.carousels.some((c: any) => c.id === core.id)) {
          settings.carousels.push(core);
          hasChanges = true;
        }
      }
      if (hasChanges) {
        await settings.save();
      }
    }

    // Populate the settings after ensuring core carousels are present
    const populatedSettings = await SiteSettings.findOne({ settingId: 'global' }).populate({
      path: 'carousels.products.product',
      model: Product,
      select: 'name slug mainImage images price comparePrice discountedPrice isPinnedFirst isPinnedSecond isPinnedThird isPinnedFourth'
    });

    return NextResponse.json(populatedSettings);
  } catch (error) {
    console.error('Error in GET /api/admin/settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Verify admin authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const isValidAdmin = await verifyAdminToken(token);

    if (!isValidAdmin) {
      return NextResponse.json({ error: 'Forbidden: Invalid or expired token' }, { status: 403 });
    }

    const body = await request.json();
    const { carousels } = body;

    if (!carousels || !Array.isArray(carousels)) {
      return NextResponse.json({ error: 'Invalid payload: carousels must be an array' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Update or create the global settings
    const updatedSettings = await SiteSettings.findOneAndUpdate(
      { settingId: 'global' },
      { carousels },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Error in POST /api/admin/settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
