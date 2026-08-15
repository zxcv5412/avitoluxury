'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  houseNo: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

interface CartItem {
  _id: string;
  id?: string;
  name: string;
  price: number;
  discountedPrice?: number;
  comparePrice?: number;
  quantity: number;
  image: string;
  images?: string[];
  isBundle?: boolean;
  bundleItems?: Array<{
    id?: string;
    name?: string;
    image?: string;
    volume?: string;
  }>;
}

export default function CheckoutSummaryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [alternatePhone, setAlternatePhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');
  const [selectedOffer, setSelectedOffer] = useState<{ code: string; type: string; value: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    description: string;
  } | null>(null);
  
  // Load form data from session storage and cart items from localStorage
  useEffect(() => {
    try {
      // Get checkout form data (try both keys for compatibility)
      const savedFormData = sessionStorage.getItem('checkout_form_data') || sessionStorage.getItem('checkoutFormData');
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      } else {
        // Redirect to checkout page if form data is not found
        router.push('/checkout');
        return;
      }
      
      // Get cart items from localStorage
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        
        // Calculate subtotal
        const total = parsedCart.reduce((sum: number, item: CartItem) => {
          const itemPrice = item.discountedPrice || item.price;
          return sum + (itemPrice * item.quantity);
        }, 0);
        
        setSubtotal(total);
        
        // Calculate shipping (free over ₹500)
        setShippingCost(total >= 500 ? 0 : 50);
      } else {
        // Redirect to cart page if cart is empty
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error loading checkout summary data:', error);
      router.push('/cart');
    }
  }, [router]);

  // Handle alternate phone number change
  const handleAlternatePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAlternatePhone(value);
      setPhoneError('');
    }
  };

  const handlePayment = async () => {
    if (alternatePhone && !/^\d{10}$/.test(alternatePhone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }
    
    if (!formData) {
      alert('Missing checkout information. Please try again.');
      router.push('/checkout');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const codFee = paymentMethod === 'COD' ? 50 : 0;
      const totalAmount = subtotal + shippingCost + codFee;

      // Create order
      const orderResponse = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: {
            ...formData,
            alternatePhone: alternatePhone || undefined
          },
          cartItems,
          subtotal,
          shippingCost,
          totalAmount,
          paymentMethod
        }),
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }
      
      if (paymentMethod === 'COD') {
        // Clear cart
        localStorage.setItem('cart', '[]');
        
        // Clear checkout details from session storage
        sessionStorage.removeItem('checkout_form_data');
        sessionStorage.removeItem('checkoutFormData');
        sessionStorage.removeItem('checkout_order_id');
        
        // Dispatch event to update cart count in header
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('cart-updated'));
        
        // Redirect to payment success page for COD directly
        router.push(`/checkout/payment?method=COD&trackingId=${orderData.trackingId}`);
      } else {
        // Store order ID in session storage
        sessionStorage.setItem('checkout_order_id', orderData.orderId);
        
        // Redirect to payment page
        router.push('/checkout/payment');
      }
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while processing your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold mb-6">Order Summary</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{formData.fullName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{formData.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">+91 {formData.phone}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">
                  {formData.houseNo}, {formData.address}, {formData.landmark}, {formData.city}, {formData.state} - {formData.pincode}
                </p>
              </div>
            </div>
          </div>
          
          {/* Alternate Phone Number */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Alternate Phone Number (Optional)</h2>
            
            <div className="flex">
              <div className="flex items-center bg-gray-100 px-3 border border-r-0 border-gray-300 rounded-l-md">
                <span className="text-gray-500">+91</span>
              </div>
              <input
                type="text"
                value={alternatePhone}
                onChange={handleAlternatePhoneChange}
                placeholder="10-digit phone number"
                className={`flex-1 p-2 border rounded-r-md ${
                  phoneError ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={10}
              />
            </div>
            
            {phoneError && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <FiAlertCircle className="mr-1" /> {phoneError}
              </p>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              We'll use this number as an alternate contact for delivery
            </p>
          </div>
          
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Order Items</h2>
            
            <div className="divide-y">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="py-4 flex items-center">
                  {item.bundleItems && item.bundleItems.length > 0 ? (
                    <div className="h-16 w-16 relative flex-shrink-0 bg-amber-50/50 rounded p-1 border border-amber-300/60 flex items-center justify-center">
                      <div className="flex items-center -space-x-2">
                        {item.bundleItems.slice(0, 3).map((bItem: any, idx: number) => (
                          <div 
                            key={idx} 
                            className="w-6 h-6 rounded-full border border-[#C9A24B] bg-white shadow-xs p-0.5 overflow-hidden flex-shrink-0 relative"
                            title={bItem.name}
                          >
                            <Image
                              src={bItem.image || '/perfume-placeholder.jpg'}
                              alt={bItem.name || 'Perfume'}
                              fill
                              sizes="24px"
                              className="object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-16 w-16 relative flex-shrink-0">
                      <Image
                        src={item.image || '/perfume-placeholder.jpg'}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  
                  <div className="ml-4 flex-grow">
                    <h3 className="font-lastica text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                    {item.bundleItems && item.bundleItems.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        {item.bundleItems.map((bItem: any, idx: number) => (
                          <span key={idx} className="text-[10px] bg-amber-100/70 text-gray-800 px-1.5 py-0.5 rounded">
                            {bItem.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-[#0B0B0D]">
                      ₹{((item.discountedPrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                    {item.discountedPrice && item.price && item.discountedPrice < item.price ? (
                      <p className="text-xs text-[#5A606B] line-through">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    ) : item.comparePrice && item.price && item.comparePrice > item.price ? (
                      <p className="text-xs text-[#5A606B] line-through">
                        ₹{(item.comparePrice * item.quantity).toFixed(2)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-medium mb-4">Payment Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : 'Free'}</span>
              </div>

              {paymentMethod === 'COD' && (
                <div className="flex justify-between text-gray-600">
                  <span>COD Handling Fee</span>
                  <span>₹50.00</span>
                </div>
              )}
              
              <div className="border-t pt-3 flex justify-between font-medium">
                <span>Total</span>
                <span>₹{(subtotal + shippingCost + (paymentMethod === 'COD' ? 50 : 0)).toFixed(2)}</span>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <div className="mb-6 border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Choose Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="mr-3 text-black focus:ring-black"
                  />
                  <div>
                    <span className="text-sm font-medium block">Pay Online</span>
                    <span className="text-xs text-gray-500">UPI, Cards, NetBanking, Wallets</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mr-3 text-black focus:ring-black"
                  />
                  <div>
                    <span className="text-sm font-medium block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-gray-500">Pay when your order is delivered</span>
                  </div>
                </label>
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className={`w-full py-3 rounded-md text-white font-medium ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
              }`}
            >
              {isLoading ? 'Processing...' : paymentMethod === 'COD' ? 'Confirm Order' : 'Proceed to Payment'}
            </button>
            
            <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
              <FiCheck className="text-green-500 mr-1" />
              {paymentMethod === 'COD' ? '100% safe Cash on Delivery' : 'Secure payment via Razorpay'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 