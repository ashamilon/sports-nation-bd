# BulkSMSBD Setup Guide

This guide will help you configure your BulkSMSBD account for SMS order confirmations.

## 🔧 Step-by-Step Setup

### 1. Login to BulkSMSBD
- Go to [https://bulksmsbd.net](https://bulksmsbd.net)
- Login with your existing account credentials

### 2. Navigate to API Section
- Look for "API" or "Developer" section in your dashboard
- This is usually in the main menu or under "Settings"

### 3. Generate API Key
- Click on "Generate API Key" or "Create New API Key"
- Give it a name like "Sports Nation BD SMS"
- Copy the generated API key (it will look like: `abc123def456ghi789`)

### 4. Configure Sender ID
- Go to "Sender ID" section in your dashboard
- Request approval for "SPORTSBD" (recommended)
- Or use any 6-11 character sender ID you prefer
- Wait for approval (usually takes a few hours to 1 day)

### 5. Add Credentials to Environment
Add these lines to your `.env.local` file:

```bash
# SMS Configuration for BulkSMSBD
SMS_PROVIDER=bulksmsbd
SMS_API_KEY=your_actual_api_key_here
SMS_SENDER_ID=SPORTSBD
```

### 6. Test SMS Functionality
- Go to `/admin/sms-config` in your application
- Enter your API key and sender ID
- Enter your phone number for testing
- Click "Send Test SMS"
- Check your phone for the test message

## 📱 SMS Message Format

When a customer completes an order, they will receive an SMS like this:

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

## 💰 Pricing Information

- **Cost per SMS**: ~৳0.50-1.00
- **Minimum Balance**: Usually ৳100-500
- **Payment Methods**: bKash, Rocket, Bank Transfer
- **Delivery Rate**: 95%+ in Bangladesh

## 🔧 Troubleshooting

### SMS Not Sending
1. **Check API Key**: Ensure it's correct and active
2. **Verify Sender ID**: Must be approved by BulkSMSBD
3. **Check Balance**: Ensure sufficient balance in account
4. **Phone Format**: Must be Bangladeshi number (880 prefix)

### Common Error Messages
- **"Invalid API Key"**: Check your API key in BulkSMSBD dashboard
- **"Insufficient Balance"**: Top up your BulkSMSBD account
- **"Sender ID not approved"**: Wait for approval or use approved sender ID
- **"Invalid phone number"**: Ensure phone starts with 880

### Testing Tips
1. **Use Your Own Phone**: Test with your own Bangladeshi number first
2. **Check Spam**: SMS might go to spam folder
3. **Wait a Few Minutes**: SMS delivery can take 1-5 minutes
4. **Try Different Numbers**: Test with multiple Bangladeshi numbers

## 🚀 Integration Flow

1. **Customer pays** → SSL Commerz processes payment
2. **Payment success** → System updates order status
3. **SMS triggered** → If phone is Bangladeshi, SMS is sent
4. **Customer receives SMS** → Order confirmation message

## 📞 Support

- **BulkSMSBD Support**: Contact through their website
- **Technical Issues**: Check server logs for error details
- **Account Issues**: Contact BulkSMSBD customer service

## 🔒 Security Notes

- **Never share API key**: Keep it private and secure
- **Use environment variables**: Don't hardcode credentials
- **Monitor usage**: Check SMS logs regularly
- **Rotate keys**: Change API key periodically

## ✅ Verification Checklist

- [ ] BulkSMSBD account is active
- [ ] API key is generated and copied
- [ ] Sender ID is approved
- [ ] Account has sufficient balance
- [ ] Credentials added to `.env.local`
- [ ] Test SMS sent successfully
- [ ] SMS received on test phone
- [ ] Order confirmation SMS working

Once all items are checked, your SMS order confirmation system is ready! 🎉
