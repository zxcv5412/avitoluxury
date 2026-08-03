import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db-connect';
import SiteSettings from '@/app/models/SiteSettings';
import { verifyAdminToken } from '@/app/lib/auth-utils';
import Product from '@/app/models/Product'; // Ensure Product is registered

export const dynamic = 'force-dynamic';

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
    let settings = await SiteSettings.findOne({ settingId: 'global' }).populate({
      path: 'presets.products.product',
      model: Product,
      select: 'name slug mainImage images price comparePrice discountedPrice isPinnedFirst isPinnedSecond isPinnedThird isPinnedFourth'
    });
    
    if (!settings) {
      // Create default if it doesn't exist
      settings = await SiteSettings.create({
        settingId: 'global',
        presets: [
          {
            id: 'default',
            title: 'Main',
            products: []
          }
        ],
        activePresetId: 'default'
      });
    }

    return NextResponse.json(settings);
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
    const { presets, activePresetId, storySwatches } = body;

    if (presets && !Array.isArray(presets)) {
      return NextResponse.json({ error: 'Invalid payload: presets must be an array' }, { status: 400 });
    }

    await connectToDatabase();
    
    const updateData: any = {};
    if (presets) updateData.presets = presets;
    if (activePresetId) updateData.activePresetId = activePresetId;
    if (storySwatches && Array.isArray(storySwatches)) updateData.storySwatches = storySwatches;

    // Update or create the global settings
    const updatedSettings = await SiteSettings.findOneAndUpdate(
      { settingId: 'global' },
      updateData,
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Error in POST /api/admin/settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
