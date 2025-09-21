# Pathao Courier Integration Setup Guide

This guide will help you set up Pathao courier integration for your Sports Nation BD application.

## Prerequisites

1. **Pathao Business Account**: You need a business account with Pathao
2. **API Credentials**: Get your API credentials from Pathao
3. **Environment Variables**: Set up the required environment variables

## Environment Variables Setup

Add the following environment variables to your `.env.local` file:

```bash
# Pathao API Configuration
PATHAO_BASE_URL=https://api-hermes.pathao.com
PATHAO_CLIENT_ID=your_client_id_here
PATHAO_CLIENT_SECRET=your_client_secret_here
PATHAO_USERNAME=your_pathao_username
PATHAO_PASSWORD=your_pathao_password
PATHAO_GRANT_TYPE=password

# Pathao Pickup Information
PATHAO_PICKUP_ADDRESS=Your Business Address
PATHAO_PICKUP_CITY=Dhaka
PATHAO_PICKUP_ZONE=Your Zone Name
```

## Getting Pathao API Credentials

### Step 1: Register with Pathao
1. Visit [Pathao Business Portal](https://business.pathao.com)
2. Create a business account
3. Complete the verification process

### Step 2: Get API Access
1. Contact Pathao support for API access
2. Request API credentials for your business
3. You'll receive:
   - Client ID
   - Client Secret
   - Username
   - Password

### Step 3: Configure Your Account
1. Set up your pickup address in Pathao dashboard
2. Configure delivery zones
3. Set up payment methods

## Features Included

### 1. Automatic Order Creation
- Creates Pathao orders automatically when assigned
- Calculates delivery costs based on zone and delivery type
- Handles different delivery types (Standard, Express, Same Day)

### 2. Real-time Tracking
- Integrates with Pathao tracking API
- Updates order status automatically
- Provides delivery estimates

### 3. Admin Dashboard
- View all courier orders
- Filter by service (Pathao/Sundarban)
- Check order status
- Manage delivery zones

### 4. Customer Experience
- Automatic tracking updates
- SMS notifications
- Delivery status updates

## Delivery Zones Supported

The system supports the following Pathao delivery zones:

- Dhanmondi
- Gulshan
- Banani
- Uttara
- Mohammadpur
- Rampura
- Khilgaon
- Paltan
- Motijheel
- Tejgaon

## Delivery Types

1. **Standard (48 hours)**: Free delivery within 48 hours
2. **Express (24 hours)**: +৳30 for 24-hour delivery
3. **Same Day**: +৳50 for same-day delivery (if ordered before 2 PM)

## API Endpoints

### Create Pathao Order
```
POST /api/courier/pathao
```

### Check Order Status
```
GET /api/courier/pathao?orderId=ORDER_ID
GET /api/courier/pathao?trackingId=TRACKING_ID
```

### Courier Dashboard
```
GET /api/admin/courier/dashboard
```

## Testing the Integration

### 1. Test Order Creation
1. Go to Admin Dashboard
2. Navigate to Orders
3. Select an order
4. Choose "Pathao" as courier service
5. Fill in delivery details
6. Create order

### 2. Test Tracking
1. Go to Courier Management page
2. Find your test order
3. Click "Check Status"
4. Verify tracking information

### 3. Test Customer Experience
1. Place a test order
2. Assign Pathao courier
3. Check tracking page
4. Verify SMS notifications

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check your API credentials
   - Verify username and password
   - Ensure account is active

2. **Order Creation Failed**
   - Check pickup address configuration
   - Verify delivery zone is supported
   - Check order data format

3. **Tracking Not Working**
   - Verify tracking ID format
   - Check API connectivity
   - Ensure order exists in Pathao system

### Error Codes

- `401`: Unauthorized - Check API credentials
- `400`: Bad Request - Check order data
- `404`: Not Found - Order or tracking ID not found
- `500`: Server Error - Contact support

## Support

For technical support:
- Email: support@sportsnationbd.com
- Phone: +880 1868 556390
- Pathao Support: Contact Pathao business support

## Security Notes

1. **Never commit API credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate credentials** regularly
4. **Monitor API usage** for unusual activity

## Cost Structure

### Pathao Delivery Costs
- Base cost: ৳60 per zone
- Express delivery: +৳30
- Same day delivery: +৳50
- Weight-based pricing for heavy items

### Integration Costs
- No additional setup fees
- Standard API usage rates apply
- Volume discounts available for high-volume businesses

## Next Steps

1. Set up environment variables
2. Test with a small order
3. Configure SMS notifications
4. Train staff on new system
5. Monitor performance and costs

## Updates and Maintenance

- API endpoints may change - monitor Pathao documentation
- Update credentials when they expire
- Test integration after any system updates
- Keep backup of working configuration
