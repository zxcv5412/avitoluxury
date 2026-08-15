import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/app/lib/db-connect';
import GuestOrder from '@/app/models/GuestOrder';
import Order from '@/app/models/Order';
import User from '@/app/models/User';
import OTP from '@/app/models/OTP';
import Product from '@/app/models/Product';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { 
      customerInfo,
      shippingAddress,
      items,
      paymentMethod,
      paymentResult
    } = await request.json();
    
    // Validate required fields
    if (!customerInfo || !shippingAddress || !items || !items.length) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required order information' 
      }, { status: 400 });
    }
    
    // Validate phone verification
    const { phone } = customerInfo;
    if (!phone) {
      return NextResponse.json({ 
        success: false, 
        error: 'Phone number is required' 
      }, { status: 400 });
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Check if phone is verified with OTP
    const otpRecord = await OTP.findOne({ phone, isVerified: true });
    if (!otpRecord) {
      return NextResponse.json({ 
        success: false, 
        error: 'Phone number has not been verified. Please verify your phone number first.' 
      }, { status: 400 });
    }
    
    // Calculate prices
    let itemsPrice = 0;
    
    // Process items with complete product details
    const processedItems = await Promise.all(items.map(async (item: any) => {
      // Check if product exists and get current price and details safely
      const isValidId = item.product && mongoose.Types.ObjectId.isValid(item.product);
      const product = isValidId ? await Product.findById(item.product) as any : null;
      if (!product) {
        console.log('Guest Order API: Product not found by ID:', item.product, 'for item:', item.name);
        // Try to find by name as fallback
        const productByName = item.name ? await Product.findOne({ name: item.name }) as any : null;
        if (productByName) {
          console.log('Guest Order API: Found product by name:', productByName.name);
          // Use the found product
          return {
            product: productByName._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            sku: productByName.sku || '',
            productType: productByName.productType || '',
            category: productByName.category || '',
            subCategory: Array.isArray(productByName.subCategories) && productByName.subCategories.length > 0 
              ? productByName.subCategories[0] 
              : '',
            volume: productByName.volume || '',
            gender: productByName.gender || ''
          };
        }

        // Custom Bundle Fallback
        return {
          product: null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          sku: 'COMBO-2ML',
          productType: 'Discovery Set',
          category: 'Combos',
          subCategory: '2ml Combos',
          volume: '2ml',
          gender: 'Unisex',
          isBundle: item.isBundle,
          bundleItems: item.bundleItems
        };
      }
      
      console.log('Guest Order API: Found product details:', {
        id: product._id.toString(),
        name: product.name,
        sku: product.sku,
        productType: product.productType,
        category: product.category,
        subCategories: product.subCategories,
        volume: product.volume
      });
      
      // Calculate item price
      const itemTotal = item.price * item.quantity;
      itemsPrice += itemTotal;
      
      // Return item with complete product details
      return {
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        // Add complete product details
        sku: product.sku || '',
        productType: product.productType || '',
        category: product.category || '',
        subCategory: Array.isArray(product.subCategories) && product.subCategories.length > 0 
          ? product.subCategories[0] 
          : '',
        volume: product.volume || '',
        gender: product.gender || ''
      };
    }));
    
    // Calculate shipping price (₹0 if order total ≥ ₹500, ₹70 if order total < ₹500)
    const shippingPrice = itemsPrice >= 500 ? 0 : 70;
    
    // Calculate total price
    const totalPrice = itemsPrice + shippingPrice;
    
    // Create new order
    const newOrder = new GuestOrder({
      customerInfo,
      shippingAddress,
      items: processedItems,
      paymentMethod: paymentMethod || 'Razorpay', // Default to Razorpay
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentResult: paymentResult || null,
      isPaid: false,
      isDelivered: false
    });
    
    // Save order to database
    const savedOrder = await newOrder.save();
    
    return NextResponse.json({
      success: true,
      order: {
        id: savedOrder._id,
        totalPrice: savedOrder.totalPrice
      }
    });
    
  } catch (error) {
    console.error('Error creating guest order:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create order. Please try again.' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const phone = url.searchParams.get('phone')?.trim();
    const id = url.searchParams.get('id')?.trim();
    
    await connectToDatabase();
    
    const formatOrder = (raw: any) => {
      const orderNumber = raw.trackingId || raw.orderId || raw.trackingNumber || `ORD-${raw._id?.toString().slice(-8)}`;
      return {
        _id: raw._id?.toString() || '',
        orderNumber,
        trackingId: orderNumber,
        customerInfo: {
          name: raw.shippingAddress?.fullName || raw.customerInfo?.name || raw.user?.name || 'Customer',
          email: raw.customerInfo?.email || raw.user?.email || '',
          phone: raw.shippingAddress?.phone || raw.customerInfo?.phone || raw.alternatePhone || ''
        },
        shippingAddress: {
          addressLine1: raw.shippingAddress?.address || raw.shippingAddress?.addressLine1 || '',
          addressLine2: raw.shippingAddress?.addressLine2 || raw.shippingAddress?.landmark || '',
          city: raw.shippingAddress?.city || '',
          state: raw.shippingAddress?.state || '',
          pincode: raw.shippingAddress?.postalCode || raw.shippingAddress?.pincode || '',
          country: raw.shippingAddress?.country || 'India'
        },
        items: (raw.items || raw.orderItems || []).map((item: any) => ({
          name: item.name || 'Product',
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.image || '/perfume-placeholder.jpg'
        })),
        itemsPrice: raw.itemsPrice || (raw.totalPrice ? Math.max(0, raw.totalPrice - (raw.shippingPrice || 0)) : 0),
        shippingPrice: raw.shippingPrice || 0,
        totalPrice: raw.totalPrice || 0,
        paymentMethod: raw.paymentMethod || 'COD',
        isPaid: Boolean(raw.isPaid),
        paidAt: raw.paidAt ? new Date(raw.paidAt).toISOString() : undefined,
        createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
        status: raw.status || 'Pending'
      };
    };

    // If ID is provided, search Order first, then GuestOrder
    if (id) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      let order = await Order.findOne({
        $or: [
          { trackingId: id },
          { trackingId: new RegExp(`^${id}$`, 'i') },
          { orderId: id },
          ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(id) }] : [])
        ]
      }).populate('user', 'email name').lean();

      if (!order) {
        order = await GuestOrder.findOne({
          $or: [
            { trackingNumber: id },
            { trackingNumber: new RegExp(`^${id}$`, 'i') },
            ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(id) }] : [])
          ]
        }).lean();
      }

      if (!order) {
        return NextResponse.json({ 
          success: false, 
          error: 'Order not found' 
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        order: formatOrder(order)
      });
    }

    // If phone is provided, search Order first, then GuestOrder
    if (phone) {
      const sanitizedPhone = phone.replace(/\D/g, '');
      const last10 = sanitizedPhone.slice(-10);

      const orders = await Order.find({
        $or: [
          { 'shippingAddress.phone': phone },
          ...(last10 ? [{ 'shippingAddress.phone': new RegExp(last10) }] : []),
          { alternatePhone: phone },
          ...(last10 ? [{ alternatePhone: new RegExp(last10) }] : [])
        ]
      }).sort({ createdAt: -1 }).populate('user', 'email name').lean();

      const guestOrders = await GuestOrder.find({
        $or: [
          { 'customerInfo.phone': phone },
          ...(last10 ? [{ 'customerInfo.phone': new RegExp(last10) }] : [])
        ]
      }).sort({ createdAt: -1 }).lean();

      const combined = [...orders, ...guestOrders].map(formatOrder);
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return NextResponse.json({
        success: true,
        orders: combined
      });
    }

    // If no parameters, return error
    return NextResponse.json({ 
      success: false, 
      error: 'Missing required parameters' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error fetching guest orders:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch orders. Please try again.' 
    }, { status: 500 });
  }
} 