# Pathao Courier Integration - Complete Guide

## Overview
This document provides a comprehensive guide to the Pathao Courier API integration that has been implemented in the Sports Nation BD admin dashboard.

## Features Implemented

### 1. Core Service (`lib/pathao-service.ts`)
- **OAuth 2.0 Authentication**: Automatic token management with refresh capability
- **Store Management**: Create and retrieve store information
- **Location APIs**: Get cities, zones, and areas
- **Order Management**: Create single and bulk orders
- **Price Calculation**: Calculate delivery fees before creating orders
- **Order Tracking**: Get order information and status

### 2. API Routes
- **`/api/pathao/auth`**: Test connection and authentication
- **`/api/pathao/stores`**: Store management (GET, POST)
- **`/api/pathao/locations`**: Location data (cities, zones, areas)
- **`/api/pathao/orders`**: Order operations (create, bulk create, price calculation, tracking)

### 3. Admin Interface
- **Dashboard Overview**: Connection status, quick stats, recent activity
- **Store Management**: View and manage Pathao stores
- **Order Creation**: Comprehensive order form with validation
- **Price Calculator**: Real-time delivery fee calculation
- **Settings**: Environment and API configuration

## Environment Configuration

### Sandbox Environment (Default)
```env
PATHAO_ENVIRONMENT=sandbox
PATHAO_SANDBOX_BASE_URL=https://courier-api-sandbox.pathao.com
PATHAO_SANDBOX_CLIENT_ID=7N1aMJQbWm
PATHAO_SANDBOX_CLIENT_SECRET=wRcaibZkUdSNz2EI9ZyuXLlNrnAv0TdPUPXMnD39
PATHAO_SANDBOX_USERNAME=test@pathao.com
PATHAO_SANDBOX_PASSWORD=lovePathao
```

### Production Environment
```env
PATHAO_ENVIRONMENT=production
PATHAO_BASE_URL=https://api-hermes.pathao.com
PATHAO_CLIENT_ID=WPe9DKBdLy
PATHAO_CLIENT_SECRET=4UcuXfu1fpVzWa8O2I3mZx4fssNorvxteXOKldJD
PATHAO_USERNAME=sportsnationbd@yahoo.com
PATHAO_PASSWORD=Limon.123
```

## Usage Guide

### 1. Accessing the Pathao Dashboard
1. Navigate to Admin Dashboard
2. Go to "Courier" → "Pathao Courier"
3. The dashboard will automatically test the connection

### 2. Testing Connection
- Click "Test Connection" button in the Overview tab
- Green status indicates successful connection
- Red status indicates configuration issues

### 3. Managing Stores
- View all available stores in the "Stores" tab
- Store information includes ID, name, address, and status
- Click "Refresh" to reload store data

### 4. Creating Orders
1. Go to "Orders" tab
2. Click "Create Order" button
3. Fill in the comprehensive order form:
   - **Store Selection**: Choose from available stores
   - **Recipient Information**: Name, phone, address
   - **Delivery Details**: Type, item type, weight, quantity
   - **Location Selection**: City, zone, area (cascading dropdowns)
   - **Additional Info**: Description, special instructions
4. Click "Calculate Price" to get delivery fee estimate
5. Click "Create Order" to submit

### 5. Price Calculation
- Use the "Price Calculator" tab for standalone price calculations
- Select store, item type, delivery type, weight, and destination
- Get detailed price breakdown including discounts and final cost

### 6. Settings Configuration
- Switch between sandbox and production environments
- Update API credentials
- Save configuration changes

## API Endpoints

### Authentication
```typescript
// Test connection
POST /api/pathao/auth
{
  "action": "test-connection"
}
```

### Stores
```typescript
// Get stores
GET /api/pathao/stores

// Create store
POST /api/pathao/stores
{
  "name": "Store Name",
  "contact_name": "Contact Person",
  "contact_number": "017XXXXXXXX",
  "address": "Full Address",
  "city_id": 1,
  "zone_id": 298,
  "area_id": 37
}
```

### Locations
```typescript
// Get cities
GET /api/pathao/locations?type=cities

// Get zones by city
GET /api/pathao/locations?type=zones&cityId=1

// Get areas by zone
GET /api/pathao/locations?type=areas&zoneId=298
```

### Orders
```typescript
// Create order
POST /api/pathao/orders
{
  "action": "create",
  "store_id": 123,
  "recipient_name": "John Doe",
  "recipient_phone": "017XXXXXXXX",
  "recipient_address": "Full Address",
  "delivery_type": 48,
  "item_type": 2,
  "item_quantity": 1,
  "item_weight": 0.5,
  "amount_to_collect": 0
}

// Calculate price
POST /api/pathao/orders
{
  "action": "calculate-price",
  "store_id": 123,
  "item_type": 2,
  "delivery_type": 48,
  "item_weight": 0.5,
  "recipient_city": 1,
  "recipient_zone": 298
}

// Get order info
GET /api/pathao/orders?consignmentId=CONSIGNMENT_ID
```

## Data Models

### PathaoStore
```typescript
interface PathaoStore {
  store_id: string
  store_name: string
  store_address: string
  is_active: number
  city_id: string
  zone_id: string
  hub_id: string
  is_default_store: boolean
  is_default_return_store: boolean
}
```

### PathaoOrder
```typescript
interface PathaoOrder {
  store_id: number
  merchant_order_id?: string
  recipient_name: string
  recipient_phone: string
  recipient_secondary_phone?: string
  recipient_address: string
  recipient_city?: number
  recipient_zone?: number
  recipient_area?: number
  delivery_type: number // 48 for Normal, 12 for On Demand
  item_type: number // 1 for Document, 2 for Parcel
  special_instruction?: string
  item_quantity: number
  item_weight: number
  item_description?: string
  amount_to_collect: number
}
```

### PathaoOrderResponse
```typescript
interface PathaoOrderResponse {
  consignment_id: string
  merchant_order_id?: string
  order_status: string
  delivery_fee: number
}
```

## Error Handling

The integration includes comprehensive error handling:
- **Authentication Errors**: Invalid credentials or expired tokens
- **API Errors**: Network issues, invalid requests, server errors
- **Validation Errors**: Missing required fields, invalid data formats
- **User Feedback**: Toast notifications for all operations

## Security Features

- **Admin Authentication**: All API routes require admin session
- **Token Management**: Automatic token refresh and secure storage
- **Input Validation**: Client and server-side validation
- **Error Sanitization**: Safe error messages without sensitive data

## Testing

### Sandbox Testing
1. Set `PATHAO_ENVIRONMENT=sandbox` in environment variables
2. Use sandbox credentials provided by Pathao
3. Test all features without affecting production data

### Production Deployment
1. Set `PATHAO_ENVIRONMENT=production`
2. Use your production credentials
3. Ensure all store IDs and configurations are correct

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check environment variables
   - Verify credentials
   - Ensure network connectivity

2. **Token Expired**
   - Service automatically refreshes tokens
   - Check refresh token validity

3. **Store Not Found**
   - Verify store ID exists
   - Check store status (active/inactive)

4. **Location Data Missing**
   - Ensure city/zone/area IDs are valid
   - Check API response for available locations

### Debug Mode
Enable detailed logging by checking browser console and server logs for API responses and error details.

## Future Enhancements

Potential improvements for the integration:
1. **Order History**: Track and display order history
2. **Bulk Operations**: Enhanced bulk order management
3. **Webhooks**: Real-time order status updates
4. **Analytics**: Delivery performance metrics
5. **Integration with Orders**: Connect with existing order system

## Support

For technical support:
1. Check Pathao API documentation
2. Review error logs in browser console
3. Verify environment configuration
4. Test with sandbox environment first

## Conclusion

The Pathao Courier integration provides a complete solution for managing courier orders directly from the admin dashboard. The implementation includes all essential features for order creation, tracking, and management with a user-friendly interface and robust error handling.
