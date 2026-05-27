# Vercel Deployment Guide

## Environment Variables Setup

To deploy successfully on Vercel, you need to set up the following environment variables in your Vercel dashboard:

### Required Environment Variables

#### 1. JWT Secrets (Generate strong random values)
```
JWT_SECRET=your_strong_jwt_secret_here_64_chars_minimum
ADMIN_JWT_SECRET=your_strong_admin_jwt_secret_here_64_chars_minimum
```

#### 2. Database
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

#### 3. Twilio Configuration
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_VERIFY_SERVICE_SID=your_twilio_verify_service_sid
```

#### 4. Email Configuration
```
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
EMAIL_RECIPIENT=your_email_recipient
BUSINESS_USER=your_business_email
```

#### 5. Admin Credentials
```
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_strong_admin_password
```

#### 6. Two Factor Authentication
```
TWO_FACTOR_API_KEY=your_2fa_api_key
TWO_FACTOR_SENDER_ID=AVITOS
TWO_FACTOR_TEMPLATE_NAME=Avito Orderrr
TWO_FACTOR_TEMPLATE_NAME2=Avito OTPPS
```

#### 7. Cloudinary Configuration
```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### 8. Razorpay Configuration
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### 9. RapidAPI Configuration
```
RAPIDAPI_KEY=your_rapidapi_key
```

## How to Set Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select the appropriate environments (Production, Preview, Development)

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add JWT_SECRET
vercel env add MONGODB_URI
# ... repeat for all variables
```

### Method 3: Import from .env file
```bash
# Create a .env.production file with all variables
# Then use Vercel CLI to import
vercel env pull .env.production
```

## Generate Strong Secrets

Use the provided script to generate secure secrets:

```bash
node scripts/generate-secrets.js
```

This will output strong JWT secrets and passwords that you can use in your environment variables.

## Deployment Steps

1. **Set up all environment variables** in Vercel dashboard
2. **Push your code** to the connected Git repository
3. **Vercel will automatically deploy** with the new environment variables
4. **Test the deployment** to ensure all functionality works

## Important Security Notes

### 🔒 Security Checklist
- [ ] All environment variables are set in Vercel
- [ ] JWT secrets are strong (64+ characters)
- [ ] Database credentials are rotated from exposed ones
- [ ] API keys are rotated from exposed ones
- [ ] Admin passwords are strong and unique
- [ ] No sensitive data in the codebase

### 🚨 Critical Actions
1. **Rotate all API keys** that were previously exposed
2. **Change database passwords** 
3. **Update admin credentials**
4. **Generate new JWT secrets**

## Testing Deployment

After deployment, test these critical functions:
- [ ] User registration and login
- [ ] Admin login
- [ ] Product catalog loading
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Payment processing
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Image uploads

## Troubleshooting

### Build Fails with JWT_SECRET Error
- Ensure JWT_SECRET is set in Vercel environment variables
- Check that the secret is not empty or the fallback value

### Database Connection Issues
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### API Integration Issues
- Verify all third-party API keys are set
- Check that API keys are valid and not expired
- Test API endpoints individually

## Monitoring

After deployment, monitor:
- Application logs in Vercel dashboard
- Database connection status
- Third-party API usage
- Error rates and performance metrics

---

## 🎉 Ready for Production

Once all environment variables are set and the deployment is successful, your secure e-commerce website will be live and ready for customers!