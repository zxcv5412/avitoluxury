import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/app/lib/db-connect';
import Order from '@/app/models/Order';
import GuestOrder from '@/app/models/GuestOrder';
import User from '@/app/models/User';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const trackingIdParam = url.searchParams.get('tracking_id') || url.searchParams.get('id');
    
    if (!trackingIdParam) {
      return NextResponse.json(
        { success: false, error: 'Tracking ID is required' },
        { status: 400 }
      );
    }

    const trackingId = trackingIdParam.trim();
    
    // Connect to database
    await connectToDatabase();
    
    const isObjectId = mongoose.Types.ObjectId.isValid(trackingId);
    
    // Find order by tracking ID or orderId or _id in Order collection
    let order: any = await Order.findOne({
      $or: [
        { trackingId },
        { trackingId: new RegExp(`^${trackingId}$`, 'i') },
        { orderId: trackingId },
        ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(trackingId) }] : [])
      ]
    }).populate('user', 'email name');
    
    // Fallback to GuestOrder collection
    if (!order) {
      const guestOrder: any = await GuestOrder.findOne({
        $or: [
          { trackingNumber: trackingId },
          { trackingNumber: new RegExp(`^${trackingId}$`, 'i') },
          ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(trackingId) }] : [])
        ]
      });

      if (guestOrder) {
        const orderNumber = guestOrder.trackingNumber || `ORD-${guestOrder._id.toString().slice(-8)}`;
        return NextResponse.json({
          success: true,
          order: {
            trackingId: orderNumber,
            status: guestOrder.status || 'Pending',
            createdAt: guestOrder.createdAt,
            shippingAddress: {
              fullName: guestOrder.customerInfo?.name || 'Customer',
              address: guestOrder.shippingAddress?.addressLine1 || '',
              city: guestOrder.shippingAddress?.city || '',
              state: guestOrder.shippingAddress?.state || '',
              postalCode: guestOrder.shippingAddress?.pincode || '',
              phone: guestOrder.customerInfo?.phone || ''
            },
            items: (guestOrder.items || []).map((item: any) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image || '/perfume-placeholder.jpg'
            })),
            paymentMethod: guestOrder.paymentMethod || 'COD',
            totalPrice: guestOrder.totalPrice || 0,
            shippingPrice: guestOrder.shippingPrice || 0,
            isPaid: Boolean(guestOrder.isPaid),
            paidAt: guestOrder.paidAt,
            isDelivered: Boolean(guestOrder.isDelivered),
            deliveredAt: guestOrder.deliveredAt,
            alternatePhone: ''
          }
        });
      }
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    const displayTrackingId = order.trackingId || order.orderId || `ORD-${order._id.toString().slice(-8)}`;

    // Format order data for response
    const formattedOrder = {
      trackingId: displayTrackingId,
      status: order.status || 'Pending',
      createdAt: order.createdAt,
      shippingAddress: {
        fullName: order.shippingAddress?.fullName || order.user?.name || 'Customer',
        address: order.shippingAddress?.address || '',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        postalCode: order.shippingAddress?.postalCode || '',
        phone: order.shippingAddress?.phone || ''
      },
      items: (order.items || []).map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '/perfume-placeholder.jpg'
      })),
      paymentMethod: order.paymentMethod,
      totalPrice: order.totalPrice,
      shippingPrice: order.shippingPrice || 0,
      isPaid: Boolean(order.isPaid),
      paidAt: order.paidAt,
      isDelivered: Boolean(order.isDelivered),
      deliveredAt: order.deliveredAt,
      alternatePhone: order.alternatePhone
    };
    
    return NextResponse.json({
      success: true,
      order: formattedOrder
    });
    
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track order' },
      { status: 500 }
    );
  }
} 