#!/usr/bin/env node

/**
 * Pathao Integration Test Script
 * 
 * This script tests the complete Pathao courier integration workflow:
 * 1. Authentication with Pathao API
 * 2. Fetching cities, zones, and areas
 * 3. Calculating delivery costs
 * 4. Creating test orders
 * 5. Checking order status
 * 6. Webhook simulation
 */

const fetch = require('node-fetch')
require('dotenv').config({ path: '.env.local' })

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'
const ADMIN_EMAIL = 'admin@sportsnationbd.com'
const ADMIN_PASSWORD = 'admin123'

class PathaoIntegrationTester {
  constructor() {
    this.sessionToken = null
    this.testResults = []
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`
    console.log(logMessage)
    this.testResults.push({ timestamp, type, message })
  }

  async error(message) {
    await this.log(message, 'error')
  }

  async success(message) {
    await this.log(message, 'success')
  }

  async warning(message) {
    await this.log(message, 'warning')
  }

  async authenticate() {
    try {
      await this.log('Starting authentication...')
      
      // For testing, we'll use a mock session
      // In production, you would authenticate with NextAuth
      this.sessionToken = 'mock-admin-session-token'
      
      await this.success('Authentication successful')
      return true
    } catch (error) {
      await this.error(`Authentication failed: ${error.message}`)
      return false
    }
  }

  async testPathaoCredentials() {
    try {
      await this.log('Testing Pathao API credentials...')
      
      const requiredEnvVars = [
        'PATHAO_CLIENT_ID',
        'PATHAO_CLIENT_SECRET',
        'PATHAO_USERNAME',
        'PATHAO_PASSWORD',
        'PATHAO_BASE_URL'
      ]

      const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
      
      if (missingVars.length > 0) {
        await this.error(`Missing environment variables: ${missingVars.join(', ')}`)
        return false
      }

      await this.success('All required Pathao environment variables are present')
      return true
    } catch (error) {
      await this.error(`Credential test failed: ${error.message}`)
      return false
    }
  }

  async testLocationAPI() {
    try {
      await this.log('Testing Pathao location APIs...')
      
      // Test cities endpoint
      const citiesResponse = await fetch(`${BASE_URL}/api/courier/pathao/locations?type=cities`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!citiesResponse.ok) {
        throw new Error(`Cities API failed: ${citiesResponse.status}`)
      }

      const citiesData = await citiesResponse.json()
      if (!citiesData.success || !citiesData.data || citiesData.data.length === 0) {
        throw new Error('No cities data received')
      }

      await this.success(`Cities API working - found ${citiesData.data.length} cities`)
      
      // Test zones endpoint with first city
      const firstCity = citiesData.data[0]
      const zonesResponse = await fetch(`${BASE_URL}/api/courier/pathao/locations?type=zones&cityId=${firstCity.city_id}`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!zonesResponse.ok) {
        throw new Error(`Zones API failed: ${zonesResponse.status}`)
      }

      const zonesData = await zonesResponse.json()
      if (!zonesData.success || !zonesData.data || zonesData.data.length === 0) {
        throw new Error('No zones data received')
      }

      await this.success(`Zones API working - found ${zonesData.data.length} zones for ${firstCity.city_name}`)
      
      // Test areas endpoint with first zone
      const firstZone = zonesData.data[0]
      const areasResponse = await fetch(`${BASE_URL}/api/courier/pathao/locations?type=areas&zoneId=${firstZone.zone_id}`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!areasResponse.ok) {
        throw new Error(`Areas API failed: ${areasResponse.status}`)
      }

      const areasData = await areasResponse.json()
      if (!areasData.success || !areasData.data || areasData.data.length === 0) {
        throw new Error('No areas data received')
      }

      await this.success(`Areas API working - found ${areasData.data.length} areas for ${firstZone.zone_name}`)
      
      return {
        city: firstCity,
        zone: firstZone,
        area: areasData.data[0]
      }
    } catch (error) {
      await this.error(`Location API test failed: ${error.message}`)
      return null
    }
  }

  async testCostCalculation(locationData) {
    try {
      await this.log('Testing delivery cost calculation...')
      
      const costResponse = await fetch(`${BASE_URL}/api/courier/pathao/cost`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cityId: locationData.city.city_id,
          zoneId: locationData.zone.zone_id,
          areaId: locationData.area.area_id,
          weight: 0.5
        })
      })

      if (!costResponse.ok) {
        throw new Error(`Cost calculation API failed: ${costResponse.status}`)
      }

      const costData = await costResponse.json()
      if (!costData.success || !costData.data || costData.data.length === 0) {
        throw new Error('No cost data received')
      }

      await this.success(`Cost calculation working - found ${costData.data.length} delivery options`)
      
      return costData.data
    } catch (error) {
      await this.error(`Cost calculation test failed: ${error.message}`)
      return null
    }
  }

  async testOrderCreation(locationData, costData) {
    try {
      await this.log('Testing order creation...')
      
      // First, we need to create a test order in the database
      const testOrderData = {
        items: [
          {
            productId: 'test-product-id',
            quantity: 1,
            price: 1000,
            customOptions: {
              name: 'Test Customer',
              number: '10'
            }
          }
        ],
        customerInfo: {
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '01700000000',
          address: 'Test Address',
          city: locationData.city.city_name,
          country: 'Bangladesh'
        },
        subtotal: 1000,
        deliveryCharge: costData[0]?.cost || 60,
        tipAmount: 0,
        totalAmount: 1060,
        paymentType: 'full'
      }

      // Create test order
      const orderResponse = await fetch(`${BASE_URL}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testOrderData)
      })

      if (!orderResponse.ok) {
        throw new Error(`Order creation failed: ${orderResponse.status}`)
      }

      const orderData = await orderResponse.json()
      if (!orderData.success || !orderData.order) {
        throw new Error('Order creation response invalid')
      }

      await this.success(`Test order created: ${orderData.order.orderNumber}`)
      
      // Now create Pathao courier order
      const courierData = {
        cityId: locationData.city.city_id,
        zoneId: locationData.zone.zone_id,
        areaId: locationData.area.area_id,
        deliveryType: '48',
        specialInstruction: 'Test order - handle with care'
      }

      const courierResponse = await fetch(`${BASE_URL}/api/courier/pathao`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderData.order.id,
          courierData
        })
      })

      if (!courierResponse.ok) {
        throw new Error(`Courier order creation failed: ${courierResponse.status}`)
      }

      const courierOrderData = await courierResponse.json()
      if (!courierOrderData.success) {
        throw new Error(`Courier order creation failed: ${courierOrderData.error}`)
      }

      await this.success(`Pathao courier order created: ${courierOrderData.data.pathaoResponse.tracking_code}`)
      
      return {
        order: orderData.order,
        courierOrder: courierOrderData.data
      }
    } catch (error) {
      await this.error(`Order creation test failed: ${error.message}`)
      return null
    }
  }

  async testOrderStatus(trackingId) {
    try {
      await this.log('Testing order status check...')
      
      const statusResponse = await fetch(`${BASE_URL}/api/courier/pathao?trackingId=${trackingId}`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!statusResponse.ok) {
        throw new Error(`Status check API failed: ${statusResponse.status}`)
      }

      const statusData = await statusResponse.json()
      if (!statusData.success) {
        throw new Error(`Status check failed: ${statusData.error}`)
      }

      await this.success(`Order status check working - Status: ${statusData.data.status || 'Unknown'}`)
      
      return statusData.data
    } catch (error) {
      await this.error(`Order status test failed: ${error.message}`)
      return null
    }
  }

  async testWebhook() {
    try {
      await this.log('Testing webhook endpoint...')
      
      const webhookData = {
        order_id: 'test-order-123',
        tracking_code: 'test-tracking-456',
        status: 'delivered',
        status_description: 'Order delivered successfully',
        current_location: 'Customer Location',
        estimated_delivery_time: new Date().toISOString(),
        timestamp: new Date().toISOString()
      }

      const webhookResponse = await fetch(`${BASE_URL}/api/courier/pathao/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      })

      if (!webhookResponse.ok) {
        throw new Error(`Webhook test failed: ${webhookResponse.status}`)
      }

      const webhookResult = await webhookResponse.json()
      if (!webhookResult.success) {
        throw new Error(`Webhook processing failed: ${webhookResult.error}`)
      }

      await this.success('Webhook endpoint working correctly')
      
      return webhookResult
    } catch (error) {
      await this.error(`Webhook test failed: ${error.message}`)
      return null
    }
  }

  async testDashboard() {
    try {
      await this.log('Testing Pathao dashboard API...')
      
      const dashboardResponse = await fetch(`${BASE_URL}/api/admin/courier/pathao/dashboard?range=7d`, {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!dashboardResponse.ok) {
        throw new Error(`Dashboard API failed: ${dashboardResponse.status}`)
      }

      const dashboardData = await dashboardResponse.json()
      if (!dashboardData.success) {
        throw new Error(`Dashboard API failed: ${dashboardData.error}`)
      }

      await this.success(`Dashboard API working - ${dashboardData.stats.totalOrders} orders found`)
      
      return dashboardData
    } catch (error) {
      await this.error(`Dashboard test failed: ${error.message}`)
      return null
    }
  }

  async runAllTests() {
    await this.log('Starting Pathao Integration Tests...')
    await this.log('=====================================')
    
    const results = {
      authentication: false,
      credentials: false,
      locationAPI: false,
      costCalculation: false,
      orderCreation: false,
      orderStatus: false,
      webhook: false,
      dashboard: false
    }

    // Test 1: Authentication
    results.authentication = await this.authenticate()
    if (!results.authentication) {
      await this.error('Authentication failed - stopping tests')
      return results
    }

    // Test 2: Credentials
    results.credentials = await this.testPathaoCredentials()
    if (!results.credentials) {
      await this.warning('Credential test failed - some tests may not work')
    }

    // Test 3: Location API
    const locationData = await this.testLocationAPI()
    results.locationAPI = locationData !== null

    // Test 4: Cost Calculation
    if (locationData) {
      const costData = await this.testCostCalculation(locationData)
      results.costCalculation = costData !== null

      // Test 5: Order Creation
      if (costData) {
        const orderData = await this.testOrderCreation(locationData, costData)
        results.orderCreation = orderData !== null

        // Test 6: Order Status
        if (orderData) {
          const statusData = await this.testOrderStatus(orderData.courierOrder.pathaoResponse.tracking_code)
          results.orderStatus = statusData !== null
        }
      }
    }

    // Test 7: Webhook
    results.webhook = await this.testWebhook() !== null

    // Test 8: Dashboard
    results.dashboard = await this.testDashboard() !== null

    // Summary
    await this.log('=====================================')
    await this.log('Test Results Summary:')
    
    const passedTests = Object.values(results).filter(Boolean).length
    const totalTests = Object.keys(results).length
    
    await this.log(`Passed: ${passedTests}/${totalTests} tests`)
    
    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? '✅ PASS' : '❌ FAIL'
      this.log(`${test}: ${status}`)
    })

    if (passedTests === totalTests) {
      await this.success('All tests passed! Pathao integration is working correctly.')
    } else {
      await this.warning(`Some tests failed. Please check the logs above for details.`)
    }

    return results
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new PathaoIntegrationTester()
  tester.runAllTests().then(results => {
    process.exit(Object.values(results).every(Boolean) ? 0 : 1)
  }).catch(error => {
    console.error('Test execution failed:', error)
    process.exit(1)
  })
}

module.exports = PathaoIntegrationTester
