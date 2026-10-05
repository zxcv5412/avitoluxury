// Google Ads and Analytics Tag Helpers

export const GOOGLE_ADS_ID = 'AW-17157980266';
export const GOOGLE_ADS_PURCHASE_CONVERSION_LABEL = 'AW-17157980266/dWxZCMD84OIbEOqAyPU_';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tracks a purchase conversion event for Google Ads
 */
export const trackGoogleAdsPurchase = ({
  transactionId,
  value,
  currency = 'INR',
}: {
  transactionId: string;
  value?: number;
  currency?: string;
}) => {
  if (typeof window === 'undefined') return;

  if (!transactionId) {
    console.warn('[Google Ads] No transaction ID provided for conversion tracking');
    return;
  }

  // Deduplication: Avoid recording the same transaction multiple times on page refresh
  const dedupeKey = `gads_conv_${transactionId}`;
  if (sessionStorage.getItem(dedupeKey)) {
    console.log(`[Google Ads] Conversion for ${transactionId} already sent in this session.`);
    return;
  }

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: GOOGLE_ADS_PURCHASE_CONVERSION_LABEL,
        transaction_id: transactionId,
        value: typeof value === 'number' ? value : undefined,
        currency: currency,
      });
      sessionStorage.setItem(dedupeKey, '1');
      console.log(`[Google Ads] Purchase conversion tracked successfully:`, {
        transactionId,
        value,
        currency,
        send_to: GOOGLE_ADS_PURCHASE_CONVERSION_LABEL
      });
    } else {
      // Fallback: push to dataLayer directly if gtag function is still initializing
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push([
        'event',
        'conversion',
        {
          send_to: GOOGLE_ADS_PURCHASE_CONVERSION_LABEL,
          transaction_id: transactionId,
          value: typeof value === 'number' ? value : undefined,
          currency: currency,
        }
      ]);
      sessionStorage.setItem(dedupeKey, '1');
      console.log(`[Google Ads] Conversion pushed to dataLayer:`, transactionId);
    }
  } catch (error) {
    console.error('[Google Ads] Error tracking conversion:', error);
  }
};
