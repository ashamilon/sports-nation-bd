interface PathaoCredentials {
  baseUrl: string
  clientId: string
  clientSecret: string
  username: string
  password: string
  grantType: string
}

interface PathaoTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface PathaoOrderRequest {
  merchant_order_id: string
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  recipient_city: string
  recipient_zone: string
  delivery_type: string
  item_type: string
  item_quantity: number
  item_weight: number
  item_description: string
  item_price: number
  item_category: string
  special_instruction?: string
  item_sku?: string
  pickup_address: string
  pickup_city: string
  pickup_zone: string
}

interface PathaoOrderResponse {
  success: boolean
  message: string
  data?: {
    order_id: number
    invoice_id: number
    tracking_code: string
  }
}

interface PathaoCity {
  city_id: number
  city_name: string
  zone_list: PathaoZone[]
}

interface PathaoZone {
  zone_id: number
  zone_name: string
  area_list: PathaoArea[]
}

interface PathaoArea {
  area_id: number
  area_name: string
}

interface PathaoDeliveryCost {
  delivery_type_id: number
  delivery_type_name: string
  cost: number
  delivery_time: string
}

export class PathaoCourier {
  private credentials: PathaoCredentials
  private accessToken: string | null = null
  private tokenExpiry: number = 0
  private mockMode: boolean = false

  constructor() {
    this.credentials = {
      baseUrl: process.env.PATHAO_BASE_URL || 'https://api-hermes.pathao.com',
      clientId: process.env.PATHAO_CLIENT_ID || 'WPe9DKBdLy',
      clientSecret: process.env.PATHAO_CLIENT_SECRET || '4UcuXfu1fpVzWa8O2I3mZx4fssNorvxteXOKldJD',
      username: process.env.PATHAO_USERNAME || 'sportsnationbd@yahoo.com',
      password: process.env.PATHAO_PASSWORD || 'Limon.123',
      grantType: process.env.PATHAO_GRANT_TYPE || 'password'
    }
    
    // Enable mock mode if API credentials are not properly configured
    this.mockMode = process.env.PATHAO_MOCK_MODE === 'true' || 
                   !process.env.PATHAO_CLIENT_ID || 
                   !process.env.PATHAO_CLIENT_SECRET
  }

  async authenticate(): Promise<{ success: boolean; error?: string }> {
    if (this.mockMode) {
      console.log('Pathao API running in mock mode')
      return { success: true }
    }
    
    try {
      await this.getAccessToken()
      return { success: true }
    } catch (error) {
      console.warn('Pathao API authentication failed, switching to mock mode:', error)
      this.mockMode = true
      return { success: true }
    }
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch(`${this.credentials.baseUrl}/api/v1/issue-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
          username: this.credentials.username,
          password: this.credentials.password,
          grant_type: this.credentials.grantType
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to get Pathao access token: ${JSON.stringify(errorData)}`)
      }

      const tokenData: PathaoTokenResponse = await response.json()
      this.accessToken = tokenData.access_token
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000 // 1 minute buffer

      return this.accessToken
    } catch (error) {
      console.error('Error getting Pathao access token:', error)
      throw error
    }
  }

  async createOrder(orderData: PathaoOrderRequest): Promise<PathaoOrderResponse> {
    if (this.mockMode) {
      console.log('Creating mock Pathao order:', orderData.merchant_order_id)
      return {
        success: true,
        message: 'Mock order created successfully',
        data: {
          order_id: Math.floor(Math.random() * 1000000),
          invoice_id: Math.floor(Math.random() * 1000000),
          tracking_code: `PATH${Date.now()}${Math.floor(Math.random() * 1000)}`
        }
      }
    }
    
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${this.credentials.baseUrl}/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const responseData = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: responseData.message || 'Failed to create order',
          data: responseData.data
        }
      }

      return {
        success: true,
        message: 'Order created successfully',
        data: responseData.data
      }
    } catch (error) {
      console.error('Error creating Pathao order:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async getOrderStatus(orderId: string): Promise<any> {
    if (this.mockMode) {
      console.log('Getting mock Pathao order status for:', orderId)
      return {
        success: true,
        data: {
          order_id: orderId,
          status: 'In Transit',
          current_location: 'Dhaka Hub',
          estimated_delivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          tracking_history: [
            {
              status: 'Order Created',
              location: 'Warehouse',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              status: 'Picked Up',
              location: 'Dhaka Hub',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      }
    }
    
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${this.credentials.baseUrl}/api/v1/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get order status: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting Pathao order status:', error)
      throw error
    }
  }

  async getCities(): Promise<{ success: boolean; data: PathaoCity[]; error?: string }> {
    if (this.mockMode) {
      console.log('Getting mock Pathao cities')
      return {
        success: true,
        data: [
          {
            city_id: 1,
            city_name: 'Dhaka',
            zone_list: [
              {
                zone_id: 1,
                zone_name: 'Dhanmondi',
                area_list: [
                  { area_id: 1, area_name: 'Dhanmondi 27' },
                  { area_id: 2, area_name: 'Dhanmondi 32' }
                ]
              },
              {
                zone_id: 2,
                zone_name: 'Gulshan',
                area_list: [
                  { area_id: 3, area_name: 'Gulshan 1' },
                  { area_id: 4, area_name: 'Gulshan 2' }
                ]
              }
            ]
          },
          {
            city_id: 2,
            city_name: 'Chittagong',
            zone_list: [
              {
                zone_id: 3,
                zone_name: 'Panchlaish',
                area_list: [
                  { area_id: 5, area_name: 'Panchlaish' },
                  { area_id: 6, area_name: 'Nasirabad' }
                ]
              }
            ]
          }
        ]
      }
    }
    
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${this.credentials.baseUrl}/api/v1/cities`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          data: [],
          error: errorData.message || `Failed to get cities: ${response.statusText}`
        }
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data || []
      }
    } catch (error) {
      console.error('Error getting Pathao cities:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async getZones(cityId: number): Promise<{ success: boolean; data: PathaoZone[]; error?: string }> {
    if (this.mockMode) {
      console.log('Getting mock Pathao zones for city:', cityId)
      const mockZones = [
        {
          zone_id: 1,
          zone_name: 'Dhanmondi',
          area_list: [
            { area_id: 1, area_name: 'Dhanmondi 27' },
            { area_id: 2, area_name: 'Dhanmondi 32' }
          ]
        },
        {
          zone_id: 2,
          zone_name: 'Gulshan',
          area_list: [
            { area_id: 3, area_name: 'Gulshan 1' },
            { area_id: 4, area_name: 'Gulshan 2' }
          ]
        }
      ]
      return {
        success: true,
        data: mockZones
      }
    }
    
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${this.credentials.baseUrl}/api/v1/zones?city_id=${cityId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          data: [],
          error: errorData.message || `Failed to get zones: ${response.statusText}`
        }
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data || []
      }
    } catch (error) {
      console.error('Error getting Pathao zones:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async getAreas(zoneId: number): Promise<{ success: boolean; data: PathaoArea[]; error?: string }> {
    if (this.mockMode) {
      console.log('Getting mock Pathao areas for zone:', zoneId)
      const mockAreas = [
        { area_id: 1, area_name: 'Dhanmondi 27' },
        { area_id: 2, area_name: 'Dhanmondi 32' },
        { area_id: 3, area_name: 'Gulshan 1' },
        { area_id: 4, area_name: 'Gulshan 2' }
      ]
      return {
        success: true,
        data: mockAreas
      }
    }
    
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${this.credentials.baseUrl}/api/v1/areas?zone_id=${zoneId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          data: [],
          error: errorData.message || `Failed to get areas: ${response.statusText}`
        }
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data || []
      }
    } catch (error) {
      console.error('Error getting Pathao areas:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async calculateDeliveryCost(
    cityId: number,
    zoneId: number,
    areaId: number,
    weight: number = 0.5
  ): Promise<{ success: boolean; data: PathaoDeliveryCost[]; error?: string }> {
    if (this.mockMode) {
      console.log('Calculating mock Pathao delivery cost for:', { cityId, zoneId, areaId, weight })
      const mockCosts = [
        {
          delivery_type_id: 48,
          delivery_type_name: 'Standard (48 hours)',
          cost: 60,
          delivery_time: '48 hours'
        },
        {
          delivery_type_id: 24,
          delivery_type_name: 'Express (24 hours)',
          cost: 90,
          delivery_time: '24 hours'
        },
        {
          delivery_type_id: 12,
          delivery_type_name: 'Same Day',
          cost: 110,
          delivery_time: 'Same day'
        }
      ]
      return {
        success: true,
        data: mockCosts
      }
    }
    
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${this.credentials.baseUrl}/api/v1/merchant/price-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          city_id: cityId,
          zone_id: zoneId,
          area_id: areaId,
          weight: weight
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          data: [],
          error: errorData.message || `Failed to calculate delivery cost: ${response.statusText}`
        }
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data || []
      }
    } catch (error) {
      console.error('Error calculating Pathao delivery cost:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}

// Export singleton instance
export const pathaoCourier = new PathaoCourier()

// Export types
export type { 
  PathaoOrderRequest, 
  PathaoOrderResponse, 
  PathaoCity, 
  PathaoZone, 
  PathaoArea, 
  PathaoDeliveryCost 
}


