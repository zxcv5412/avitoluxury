import { NextRequest } from 'next/server';

// Input validation and sanitization utilities

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Validate pincode (Indian format)
 */
export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'Password is too long' };
  }
  
  // Check for at least one letter and one number
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one letter and one number' };
  }
  
  return { valid: true };
}

/**
 * Validate MongoDB ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Simple in-memory rate limiter for API routes
 */
class SimpleRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(private windowMs: number, private maxRequests: number) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (record.count >= this.maxRequests) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Rate limiters for different endpoints
export const loginRateLimit = new SimpleRateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
export const otpRateLimit = new SimpleRateLimiter(60 * 1000, 3); // 3 OTP requests per minute
export const apiRateLimit = new SimpleRateLimiter(60 * 1000, 100); // 100 API calls per minute

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Validate and sanitize order data
 */
export function validateOrderData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.userData) {
    errors.push('User data is required');
    return { valid: false, errors };
  }
  
  const { userData } = data;
  
  // Validate required fields
  if (!userData.fullName || typeof userData.fullName !== 'string') {
    errors.push('Full name is required');
  } else if (userData.fullName.length > 100) {
    errors.push('Full name is too long');
  }
  
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push('Valid email is required');
  }
  
  if (!userData.phone || !isValidPhone(userData.phone)) {
    errors.push('Valid phone number is required');
  }
  
  if (!userData.pincode || !isValidPincode(userData.pincode)) {
    errors.push('Valid pincode is required');
  }
  
  // Validate cart items
  if (!data.cartItems || !Array.isArray(data.cartItems) || data.cartItems.length === 0) {
    errors.push('Cart items are required');
  } else {
    data.cartItems.forEach((item: any, index: number) => {
      if (!item.name || typeof item.name !== 'string') {
        errors.push(`Item ${index + 1}: Name is required`);
      }
      if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
        errors.push(`Item ${index + 1}: Valid price is required`);
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Valid quantity is required`);
      }
    });
  }
  
  // Validate amounts
  if (!data.totalAmount || typeof data.totalAmount !== 'number' || data.totalAmount <= 0) {
    errors.push('Valid total amount is required');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Clean up rate limiters periodically
 */
setInterval(() => {
  loginRateLimit.cleanup();
  otpRateLimit.cleanup();
  apiRateLimit.cleanup();
}, 5 * 60 * 1000); // Cleanup every 5 minutes