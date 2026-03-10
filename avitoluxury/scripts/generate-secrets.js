#!/usr/bin/env node

/**
 * Generate strong secrets for environment variables
 * Run this script to generate secure random secrets for your .env.local file
 */

const crypto = require('crypto');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function generatePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

console.log('🔐 Generated Secure Secrets for .env.local');
console.log('=' .repeat(50));
console.log('');

console.log('# JWT Secrets (copy these to your .env.local file)');
console.log(`JWT_SECRET=${generateSecret(64)}`);
console.log(`ADMIN_JWT_SECRET=${generateSecret(64)}`);
console.log('');

console.log('# Strong Admin Password');
console.log(`ADMIN_PASSWORD=${generatePassword(20)}`);
console.log('');

console.log('# Database User Password (for scripts)');
console.log(`USER_PASSWORD=${generatePassword(16)}`);
console.log('');

console.log('⚠️  IMPORTANT SECURITY NOTES:');
console.log('1. Copy these values to your .env.local file');
console.log('2. Never commit .env.local to version control');
console.log('3. Rotate these secrets periodically');
console.log('4. Use different secrets for different environments');
console.log('5. Store production secrets securely (e.g., in a password manager)');
console.log('');

console.log('📝 Next Steps:');
console.log('1. Create .env.local file with these secrets');
console.log('2. Add your actual API keys and credentials');
console.log('3. Test all functionality');
console.log('4. Rotate any previously exposed credentials');