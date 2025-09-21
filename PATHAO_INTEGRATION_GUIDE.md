# Pathao Courier Integration - Complete Guide

## Overview

This guide provides comprehensive documentation for the Pathao courier integration in Sports Nation BD. The integration includes order creation, tracking, cost calculation, and real-time status updates.

## Features

### ✅ Implemented Features

1. **Dynamic Location Selection**
   - Real-time city, zone, and area fetching from Pathao API
   - Cascading dropdown selection
   - Location-based cost calculation

2. **Order Management**
   - Automatic Pathao order creation
   - Real-time order status tracking
   - Order history and analytics

3. **Cost Calculation**
   - Dynamic delivery cost calculation based on location and weight
   - Multiple delivery type options (Standard, Express, Same Day)
   - Real-time cost updates

4. **Admin Dashboard**
   - Comprehensive Pathao-specific dashboard
   - Order analytics and reporting
   - Success rate tracking
   - Delivery time analytics

5. **Webhook Integration**
   - Real-time status updates from Pathao
   - Automatic SMS notifications
   - Order status synchronization

6. **SMS Notifications**
   - Delivery status updates
   - Order completion notifications
   - Failed delivery alerts

## API Endpoints

### Location APIs

#### Get Cities
```http
GET /api/courier/pathao/locations?type=cities
Authorization: Bearer <admin-token>
```

#### Get Zones
```http
GET /api/courier/pathao/locations?type=zones&cityId=<city-id>
Authorization: Bearer <admin-token>
```

#### Get Areas
```http
GET /api/courier/pathao/locations?type=areas&zoneId=<zone-id>
Authorization: Bearer <admin-token>
```

### Cost Calculation API

```http
POST /api/courier/pathao/cost
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "cityId": 1,
  "zoneId": 1,
  "areaId": 1,
  "weight": 0.5
}
```

### Order Management APIs

#### Create Pathao Order
```http
POST /api/courier/pathao
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "orderId": "order-123",
  "courierData": {
    "cityId": 1,
    "zoneId": 1,
    "areaId": 1,
    "deliveryType": "48",
    "specialInstruction": "Handle with care"
  }
}
```

#### Check Order Status
```http
GET /api/courier/pathao?trackingId=<tracking-id>
Authorization: Bearer <admin-token>
```

### Dashboard API

```http
GET /api/admin/courier/pathao/dashboard?range=7d
Authorization: Bearer <admin-token>
```

### Webhook Endpoint

```http
POST /api/courier/pathao/webhook
Content-Type: application/json

{
  "order_id": "123",
  "tracking_code": "TRK123",
  "status": "delivered",
  "status_description": "Order delivered successfully",
  "current_location": "Customer Location",
  "estimated_delivery_time": "2024-01-01T12:00:00Z",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Environment Variables

Add these variables to your `.env.local` file:

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

## Database Schema

The integration uses the existing `Order` model with these additional fields:

```prisma
model Order {
  // ... existing fields
  courierService        String?
  courierTrackingId     String?
  courierOrderId        String?
  courierInvoiceId      String?
  estimatedDelivery     DateTime?
  
  // Relations
  trackingUpdates       TrackingUpdate[]
}

model TrackingUpdate {
  id          String   @id @default(cuid())
  orderId     String
  status      String
  location    String
  description String
  timestamp   DateTime @default(now())
  
  order       Order    @relation(fields: [orderId], references: [id])
}
```

## Components

### PathaoCourierManager

Location: `components/admin/pathao-courier-manager.tsx`

Features:
- Dynamic city/zone/area selection
- Real-time cost calculation
- Order creation with validation
- Status tracking

### PathaoCourierDashboard

Location: `components/admin/pathao-courier-dashboard.tsx`

Features:
- Order analytics and reporting
- Success rate tracking
- Delivery time analytics
- Real-time status updates

## Usage Guide

### 1. Setting Up Pathao Integration

1. **Get Pathao API Credentials**
   - Contact Pathao business support
   - Request API access for your business
   - Receive client ID, secret, username, and password

2. **Configure Environment Variables**
   - Add all required environment variables to `.env.local`
   - Set up pickup address information

3. **Test Integration**
   - Run the test script: `node scripts/test-pathao-integration.js`
   - Verify all API endpoints are working

### 2. Creating Pathao Orders

1. **Navigate to Admin Dashboard**
   - Go to `/admin/orders`
   - Select an order to assign courier

2. **Select Pathao Courier**
   - Choose "Pathao" from courier options
   - Select delivery location (city, zone, area)
   - Choose delivery type
   - Add special instructions if needed

3. **Review and Create**
   - Review delivery cost calculation
   - Click "Create Pathao Order"
   - Order will be created automatically

### 3. Tracking Orders

1. **Pathao Dashboard**
   - Go to `/admin/courier/pathao`
   - View all Pathao orders
   - Check real-time status updates

2. **Individual Order Tracking**
   - Click "Check Status" for any order
   - View detailed tracking information
   - Monitor delivery progress

### 4. Webhook Configuration

1. **Set Up Webhook URL**
   - Configure webhook URL in Pathao dashboard
   - URL: `https://yourdomain.com/api/courier/pathao/webhook`

2. **Test Webhook**
   - Use the test script to verify webhook functionality
   - Ensure SMS notifications are working

## Testing

### Automated Testing

Run the comprehensive test suite:

```bash
node scripts/test-pathao-integration.js
```

This will test:
- API authentication
- Location data fetching
- Cost calculation
- Order creation
- Status tracking
- Webhook functionality
- Dashboard APIs

### Manual Testing

1. **Create Test Order**
   - Place a test order through the website
   - Assign Pathao courier
   - Verify order creation

2. **Test Tracking**
   - Check order status updates
   - Verify SMS notifications
   - Test webhook responses

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check API credentials
   - Verify username and password
   - Ensure account is active

2. **Location Data Not Loading**
   - Check API connectivity
   - Verify city/zone/area IDs
   - Check Pathao API status

3. **Order Creation Failed**
   - Verify pickup address configuration
   - Check order data format
   - Ensure all required fields are provided

4. **Webhook Not Working**
   - Check webhook URL configuration
   - Verify SSL certificate
   - Check server logs for errors

### Error Codes

- `401`: Unauthorized - Check API credentials
- `400`: Bad Request - Check request data format
- `404`: Not Found - Order or location not found
- `500`: Server Error - Check server logs

## Performance Optimization

### Caching

- Location data is cached for 30 minutes
- Order status is cached for 5 minutes
- Dashboard data is cached for 30 seconds

### Rate Limiting

- API calls are rate-limited to prevent abuse
- Webhook processing is queued for high volume

## Security

### API Security

- All API endpoints require admin authentication
- Webhook endpoints validate request signatures
- Sensitive data is encrypted in transit

### Data Protection

- Customer data is anonymized in logs
- API credentials are stored securely
- Webhook data is validated before processing

## Monitoring

### Logs

- All API calls are logged
- Error tracking with detailed stack traces
- Performance metrics collection

### Alerts

- Failed order creation alerts
- Webhook processing failures
- API rate limit warnings

## Support

### Technical Support

- Email: support@sportsnationbd.com
- Phone: +880 1868 556390
- Documentation: This guide

### Pathao Support

- Contact Pathao business support for API issues
- Check Pathao documentation for API updates
- Monitor Pathao status page for service updates

## Updates and Maintenance

### Regular Maintenance

- Update API credentials when they expire
- Monitor API usage and costs
- Test integration after system updates

### Version Updates

- Monitor Pathao API version changes
- Update integration code as needed
- Test thoroughly before deploying updates

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

## Best Practices

### Order Management

- Always verify customer address before creating orders
- Use appropriate delivery types based on urgency
- Monitor order status regularly

### Error Handling

- Implement proper error handling for all API calls
- Provide meaningful error messages to users
- Log all errors for debugging

### Performance

- Cache frequently accessed data
- Use pagination for large data sets
- Optimize database queries

## Future Enhancements

### Planned Features

1. **Bulk Order Processing**
   - Upload multiple orders via CSV
   - Batch courier assignment

2. **Advanced Analytics**
   - Delivery performance metrics
   - Cost optimization recommendations
   - Customer satisfaction tracking

3. **Mobile App Integration**
   - Real-time tracking for customers
   - Push notifications
   - Delivery confirmation

4. **Multi-Courier Support**
   - Sundarban courier integration
   - Courier comparison and selection
   - Automatic courier assignment based on location

## Conclusion

The Pathao courier integration provides a comprehensive solution for managing deliveries in Bangladesh. With real-time tracking, cost calculation, and automated notifications, it streamlines the delivery process and improves customer experience.

For any questions or issues, please refer to this documentation or contact the technical support team.
