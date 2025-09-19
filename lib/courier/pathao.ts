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

export class PathaoCourier {
  private credentials: PathaoCredentials
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    this.credentials = {
      baseUrl: process.env.PATHAO_BASE_URL || 'https://api-hermes.pathao.com',
      clientId: process.env.PATHAO_CLIENT_ID || 'WPe9DKBdLy',
      clientSecret: process.env.PATHAO_CLIENT_SECRET || '4UcuXfu1fpVzWa8O2I3mZx4fssNorvxteXOKldJD',
      username: process.env.PATHAO_USERNAME || 'sportsnationbd@yahoo.com',
      password: process.env.PATHAO_PASSWORD || 'Limon.123',
      grantType: process.env.PATHAO_GRANT_TYPE || 'password'
    }
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch(`${this.credentials.baseUrl}/issue-token`, {
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
}

// Export singleton instance
export const pathaoCourier = new PathaoCourier()

// Export types
export type { PathaoOrderRequest, PathaoOrderResponse }


