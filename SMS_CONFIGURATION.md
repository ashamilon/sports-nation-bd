# SMS Configuration for Order Confirmations

This document explains how to configure SMS notifications for order confirmations in Bangladesh.

## Environment Variables

Add the following variables to your `.env.local` file:

```bash
# SMS Configuration
SMS_PROVIDER=bulksmsbd
SMS_API_KEY=your_sms_api_key_here
SMS_SENDER_ID=SPORTSBD
SMS_BASE_URL=https://your-sms-provider.com/api/send
```

## Supported SMS Providers

### 1. BulkSMSBD (Recommended for Bangladesh)
- **Provider**: `bulksmsbd`
- **Website**: https://bulksmsbd.net
- **API Key**: Get from your BulkSMSBD dashboard
- **Features**: 
  - Low cost per SMS
  - Good delivery rates in Bangladesh
  - Easy integration

### 2. SMSBD
- **Provider**: `smsbd`
- **Website**: https://smsbd.net
- **API Key**: Get from your SMSBD dashboard
- **Features**:
  - Competitive pricing
  - Good coverage in Bangladesh

### 3. TextLocal
- **Provider**: `textlocal`
- **Website**: https://textlocal.in
- **API Key**: Get from your TextLocal account
- **Features**:
  - International coverage
  - Good for multiple countries

### 4. Custom Provider
- **Provider**: `custom`
- **Base URL**: Set your custom API endpoint
- **Features**:
  - Use your own SMS gateway
  - Full control over integration

## SMS Message Format

The system automatically generates order confirmation messages with:

- Customer name
- Order number
- Item details
- Total amount
- Delivery address
- Support contact information

Example message:
```
Dear John Doe,

Your order #ORD-1234567890 has been confirmed!

Items: Argentina Jersey (Qty: 1), Nike Shoes (Qty: 2)
Total: ৳2,500.00
Delivery: 123 Main Street, Dhaka

We'll prepare your order and notify you once it's shipped.

Thank you for choosing Sports Nation BD!

For support: +880 1868 556390
```

## Phone Number Format

The system automatically formats phone numbers for Bangladesh:
- Input: `01712345678` → Output: `8801712345678`
- Input: `+8801712345678` → Output: `8801712345678`
- Input: `8801712345678` → Output: `8801712345678`

## Testing SMS

You can test the SMS functionality using the API endpoint:

```bash
# Test SMS
GET /api/sms/send?phone=01712345678
```

## Integration Flow

1. Customer completes payment
2. SSL Commerz redirects to `/api/payments/success`
3. System updates order status to "confirmed"
4. SMS is automatically sent to customer (if phone number is Bangladeshi)
5. Customer receives order confirmation SMS

## Troubleshooting

### SMS Not Sending
1. Check if phone number is Bangladeshi (starts with 880)
2. Verify SMS provider credentials
3. Check API endpoint configuration
4. Review server logs for error messages

### Common Issues
- **Invalid API Key**: Verify your SMS provider API key
- **Insufficient Balance**: Top up your SMS provider account
- **Invalid Phone Number**: Ensure phone number is in correct format
- **Provider Down**: Check SMS provider status

## Cost Considerations

- BulkSMSBD: ~৳0.50-1.00 per SMS
- SMSBD: ~৳0.60-1.20 per SMS
- TextLocal: ~$0.05-0.10 per SMS

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Monitor SMS usage to prevent abuse
- Implement rate limiting if needed
