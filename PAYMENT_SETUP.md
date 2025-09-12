# Payment Gateway Setup Guide

This guide will help you set up SSL Commerz (for Bangladesh) and PayPal (for international) payment gateways.

## Environment Variables

Add the following environment variables to your `.env.local` file:

### SSL Commerz Configuration (Bangladesh)
```env
# SSL Commerz Settings
SSLCOMMERZ_STORE_ID=your_store_id_here
SSLCOMMERZ_STORE_PASSWORD=your_store_password_here
SSLCOMMERZ_SANDBOX=true  # Set to false for production
```

### PayPal Configuration (International)
```env
# PayPal Settings
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_SANDBOX=true  # Set to false for production
```

### Existing Environment Variables
Make sure you also have these existing variables:
```env
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

## SSL Commerz Setup

### 1. Create SSL Commerz Account
1. Visit [SSL Commerz](https://www.sslcommerz.com/)
2. Sign up for a merchant account
3. Complete the verification process

### 2. Get Credentials
1. Log in to your SSL Commerz merchant panel
2. Go to "Settings" > "API Credentials"
3. Copy your Store ID and Store Password
4. Add them to your `.env.local` file

### 3. Configure Webhooks
1. In your SSL Commerz panel, go to "Settings" > "Webhook"
2. Set the callback URL to: `https://yourdomain.com/api/payments/sslcommerz/callback`
3. Enable the following events:
   - Payment Success
   - Payment Failed
   - Payment Cancelled

### 4. Test Mode
- For testing, use sandbox credentials
- Set `SSLCOMMERZ_SANDBOX=true` in your environment
- Use test card numbers provided by SSL Commerz

## PayPal Setup

### 1. Create PayPal Developer Account
1. Visit [PayPal Developer](https://developer.paypal.com/)
2. Sign up or log in with your PayPal account
3. Create a new application

### 2. Get Credentials
1. In your PayPal Developer dashboard, select your app
2. Go to "App Settings" > "Credentials"
3. Copy your Client ID and Client Secret
4. Add them to your `.env.local` file

### 3. Configure Webhooks
1. In your PayPal app settings, go to "Webhooks"
2. Add a new webhook with URL: `https://yourdomain.com/api/payments/paypal/callback`
3. Select these events:
   - Payment capture completed
   - Payment capture denied
   - Payment capture pending

### 4. Test Mode
- For testing, use sandbox credentials
- Set `PAYPAL_SANDBOX=true` in your environment
- Use PayPal sandbox test accounts

## Payment Flow

### 1. Customer Journey
1. Customer adds items to cart
2. Customer proceeds to checkout
3. Customer fills in shipping information
4. Customer selects payment method:
   - **SSL Commerz** for Bangladesh (BDT)
   - **PayPal** for international (USD/EUR)
5. Customer is redirected to payment gateway
6. After payment, customer is redirected back to success/failure page

### 2. Payment Methods Available

#### SSL Commerz (Bangladesh)
- Credit/Debit Cards (Visa, Mastercard, Amex)
- Mobile Banking (bKash, Rocket, Nagad)
- Internet Banking
- Bank Transfer

#### PayPal (International)
- PayPal Account
- Credit/Debit Cards
- PayPal Credit
- Local payment methods (varies by country)

## Testing

### SSL Commerz Test Cards
```
Visa: 4111111111111111
Mastercard: 5555555555554444
Expiry: Any future date
CVV: Any 3 digits
```

### PayPal Test Accounts
1. Create sandbox accounts in PayPal Developer dashboard
2. Use sandbox buyer account for testing
3. Use sandbox merchant account for receiving payments

## Production Deployment

### 1. SSL Commerz Production
1. Complete merchant verification
2. Set `SSLCOMMERZ_SANDBOX=false`
3. Use production Store ID and Password
4. Update webhook URLs to production domain

### 2. PayPal Production
1. Complete PayPal business verification
2. Set `PAYPAL_SANDBOX=false`
3. Use production Client ID and Secret
4. Update webhook URLs to production domain

## Security Considerations

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** in production
4. **Validate all webhook signatures**
5. **Implement proper error handling**
6. **Log payment events** for debugging

## Troubleshooting

### Common Issues

1. **Payment not processing**
   - Check environment variables
   - Verify webhook URLs
   - Check network connectivity

2. **SSL Commerz errors**
   - Verify Store ID and Password
   - Check sandbox/production mode
   - Validate callback URLs

3. **PayPal errors**
   - Verify Client ID and Secret
   - Check app permissions
   - Validate webhook configuration

### Debug Mode
Set `NODE_ENV=development` to see detailed error logs.

## Support

- **SSL Commerz Support**: support@sslcommerz.com
- **PayPal Support**: [PayPal Developer Support](https://developer.paypal.com/support/)
- **Application Issues**: Check the application logs and error messages

## API Endpoints

### Payment Creation
```
POST /api/payments/create
```

### Payment Verification
```
POST /api/payments/verify
```

### SSL Commerz Callback
```
POST /api/payments/sslcommerz/callback
```

### PayPal Callback
```
GET /api/payments/paypal/callback
```

## Database Schema

The payment system uses these database tables:
- `Order` - Stores order information
- `OrderItem` - Stores individual order items
- `Payment` - Stores payment transaction details

Make sure your database is properly migrated with the latest schema.
