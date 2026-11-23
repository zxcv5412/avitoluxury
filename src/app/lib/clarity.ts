/**
 * Microsoft Clarity analytics integration helper
 * Documentation: https://clarity.microsoft.com/
 */

declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}

/**
 * Dispatches a custom event to Microsoft Clarity safely.
 * Will not throw if Clarity is blocked by an ad-blocker or window is undefined.
 */
export function trackClarityEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.clarity === 'function') {
      window.clarity('event', eventName, eventData);
    }
  } catch (err) {
    // Fail silently so user interactions and cart operations are never interrupted
    console.debug('Clarity event dispatch failed silently:', err);
  }
}

/**
 * Tracks an Add to Cart event in Microsoft Clarity.
 */
export function trackAddToCart(product: {
  id?: string;
  _id?: string;
  name?: string;
  price?: number;
  volume?: string;
  quantity?: number;
}) {
  trackClarityEvent('add_to_cart', {
    productId: product.id || product._id || '',
    productName: product.name || '',
    price: product.price || 0,
    volume: product.volume || '',
    quantity: product.quantity || 1,
    timestamp: new Date().toISOString()
  });
}

/**
 * Tracks a Buy Now (Instant Checkout) event in Microsoft Clarity.
 */
export function trackBuyNow(product: {
  id?: string;
  _id?: string;
  name?: string;
  price?: number;
}) {
  trackClarityEvent('buy_now', {
    productId: product.id || product._id || '',
    productName: product.name || '',
    price: product.price || 0,
    timestamp: new Date().toISOString()
  });
}
