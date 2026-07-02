import { NextResponse } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import SiteSettings from '@/app/models/SiteSettings';
import Product from '@/app/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectMongoDB();
    
    const settings = await SiteSettings.findOne({ settingId: 'global' }).populate({
      path: 'presets.products.product',
      model: Product
    }).lean();
    
    return NextResponse.json({
      success: true,
      settingsFound: !!settings,
      settings
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
