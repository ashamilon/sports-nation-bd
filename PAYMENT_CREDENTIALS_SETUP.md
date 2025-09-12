# 💳 Payment Gateway Credentials Setup

## Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
./setup-payment-credentials.sh
```

### Option 2: Manual Setup

1. **Create/Edit `.env.local` file** in your project root:

```bash
# Payment Gateway Credentials
# SSL Commerz (Bangladesh)
SSLCOMMERZ_STORE_ID=your_ssl_store_id
SSLCOMMERZ_STORE_PASSWORD=your_ssl_store_password
SSLCOMMERZ_SANDBOX=true

# PayPal (International)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_SANDBOX=true

# NextAuth Configuration
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"
```

2. **Restart the development server**:
```bash
npm run dev
```

## 🔑 Getting Your Credentials

### SSL Commerz (Bangladesh)
1. Visit: https://developer.sslcommerz.com/
2. Sign up/Login to your account
3. Go to "Integration" → "API Credentials"
4. Copy your:
   - Store ID
   - Store Password
   - Set Sandbox to `true` for testing

### PayPal (International)
1. Visit: https://developer.paypal.com/
2. Sign up/Login to your account
3. Go to "My Apps & Credentials"
4. Create a new app or use existing
5. Copy your:
   - Client ID
   - Client Secret
   - Set Sandbox to `true` for testing

## 🧪 Testing Your Setup

1. **Add items to cart** on your website
2. **Go to checkout** page
3. **Select payment method**:
   - SSL Commerz for Bangladesh (BDT)
   - PayPal for International (USD/EUR)
4. **Complete payment** process

## 🔧 Troubleshooting

### Common Issues:

1. **"Unauthorized" Error**:
   - Check your credentials are correct
   - Ensure sandbox mode matches your account type
   - Verify credentials are properly set in `.env.local`

2. **"Payment initialization failed"**:
   - Check network connectivity
   - Verify API endpoints are accessible
   - Check server logs for detailed error messages

3. **Environment Variables Not Loading**:
   - Restart the development server
   - Check `.env.local` file exists in project root
   - Verify no syntax errors in `.env.local`

### Testing URLs:
- **SSL Commerz Sandbox**: https://sandbox.sslcommerz.com
- **PayPal Sandbox**: https://api.sandbox.paypal.com

## 📞 Support

If you encounter issues:
1. Check the terminal logs for detailed error messages
2. Verify your credentials with the payment gateway providers
3. Test in sandbox mode first before going live

## 🚀 Going Live

When ready for production:
1. Set `SSLCOMMERZ_SANDBOX=false`
2. Set `PAYPAL_SANDBOX=false`
3. Use live credentials from your payment gateway accounts
4. Update `NEXTAUTH_URL` to your production domain
