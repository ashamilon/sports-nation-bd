// Pathao Courier API Service
export interface PathaoConfig {
  baseUrl: string
  clientId: string
  clientSecret: string
  username: string
  password: string
  environment: 'sandbox' | 'production'
}

export interface PathaoToken {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
  expires_at: number
}

export interface PathaoStore {
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

export interface PathaoCity {
  city_id: number
  city_name: string
}

export interface PathaoZone {
  zone_id: number
  zone_name: string
}

export interface PathaoArea {
  area_id: number
  area_name: string
  home_delivery_available: boolean
  pickup_available: boolean
}

export interface PathaoOrder {
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

export interface PathaoOrderResponse {
  consignment_id: string
  merchant_order_id?: string
  order_status: string
  delivery_fee: number
}

export interface PathaoPriceResponse {
  price: number
  discount: number
  promo_discount: number
  plan_id: number
  cod_enabled: number
  cod_percentage: number
  additional_charge: number
  final_price: number
}

class PathaoService {
  private config: PathaoConfig
  private token: PathaoToken | null = null

  constructor(config: PathaoConfig) {
    this.config = config
  }

  // Get or refresh access token
  async getAccessToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expires_at) {
      return this.token.access_token
    }

    if (this.token?.refresh_token) {
      try {
        await this.refreshToken()
        return this.token!.access_token
      } catch (error) {
        console.error('Failed to refresh token, getting new one:', error)
      }
    }

    await this.issueToken()
    return this.token!.access_token
  }

  // Issue new access token
  private async issueToken(): Promise<void> {
    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/issue-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'password',
        username: this.config.username,
        password: this.config.password,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to issue token: ${error}`)
    }

    const data = await response.json()
    this.token = {
      ...data,
      expires_at: Date.now() + (data.expires_in * 1000),
    }
  }

  // Refresh access token
  private async refreshToken(): Promise<void> {
    if (!this.token?.refresh_token) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/issue-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: this.token.refresh_token,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to refresh token: ${error}`)
    }

    const data = await response.json()
    this.token = {
      ...data,
      expires_at: Date.now() + (data.expires_in * 1000),
    }
  }

  // Get stores
  async getStores(): Promise<PathaoStore[]> {
    const token = await this.getAccessToken()
    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/stores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get stores: ${error}`)
    }

    const data = await response.json()
    return data.data.data
  }

  // Create store
  async createStore(storeData: {
    name: string
    contact_name: string
    contact_number: string
    secondary_contact?: string
    otp_number?: string
    address: string
    city_id: number
    zone_id: number
    area_id: number
  }): Promise<any> {
    const token = await this.getAccessToken()
    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(storeData),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create store: ${error}`)
    }

    return await response.json()
  }

  // Get cities
  async getCities(): Promise<PathaoCity[]> {
    const token = await this.getAccessToken()
    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/city-list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get cities: ${error}`)
    }

    const data = await response.json()
    return data.data.data
  }

  // Get zones by city
  async getZonesByCity(cityId: number): Promise<PathaoZone[]> {
    const token = await this.getAccessToken()
    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/cities/${cityId}/zone-list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get zones: ${error}`)
    }

    const data = await response.json()
    return data.data.data
  }

  // Get areas by zone
  async getAreasByZone(zoneId: number): Promise<PathaoArea[]> {
    const token = await this.getAccessToken()
    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/zones/${zoneId}/area-list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get areas: ${error}`)
    }

    const data = await response.json()
    return data.data.data
  }

  // Calculate price
  async calculatePrice(priceData: {
    store_id: number
    item_type: number
    delivery_type: number
    item_weight: number
    recipient_city: number
    recipient_zone: number
  }): Promise<PathaoPriceResponse> {
    const token = await this.getAccessToken()
    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/merchant/price-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(priceData),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to calculate price: ${error}`)
    }

    const data = await response.json()
    return data.data
  }

  // Create order
  async createOrder(orderData: PathaoOrder): Promise<PathaoOrderResponse> {
    const token = await this.getAccessToken()
    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create order: ${error}`)
    }

    const data = await response.json()
    return data.data
  }

  // Create bulk orders
  async createBulkOrders(orders: PathaoOrder[]): Promise<any> {
    const token = await this.getAccessToken()
    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/orders/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ orders }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create bulk orders: ${error}`)
    }

    return await response.json()
  }

  // Get order info
  async getOrderInfo(consignmentId: string): Promise<any> {
    const token = await this.getAccessToken()
    const response = await fetch(`${this.config.baseUrl}/aladdin/api/v1/orders/${consignmentId}/info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get order info: ${error}`)
    }

    const data = await response.json()
    return data.data
  }
}

// Default configuration
const getPathaoConfig = (): PathaoConfig => {
  const environment = (process.env.PATHAO_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
  
  if (environment === 'production') {
    return {
      baseUrl: process.env.PATHAO_BASE_URL || 'https://api-hermes.pathao.com',
      clientId: process.env.PATHAO_CLIENT_ID || '',
      clientSecret: process.env.PATHAO_CLIENT_SECRET || '',
      username: process.env.PATHAO_USERNAME || '',
      password: process.env.PATHAO_PASSWORD || '',
      environment: 'production',
    }
  } else {
    return {
      baseUrl: process.env.PATHAO_SANDBOX_BASE_URL || 'https://courier-api-sandbox.pathao.com',
      clientId: process.env.PATHAO_SANDBOX_CLIENT_ID || '7N1aMJQbWm',
      clientSecret: process.env.PATHAO_SANDBOX_CLIENT_SECRET || 'wRcaibZkUdSNz2EI9ZyuXLlNrnAv0TdPUPXMnD39',
      username: process.env.PATHAO_SANDBOX_USERNAME || 'test@pathao.com',
      password: process.env.PATHAO_SANDBOX_PASSWORD || 'lovePathao',
      environment: 'sandbox',
    }
  }
}

const defaultConfig = getPathaoConfig()

export const pathaoService = new PathaoService(defaultConfig)
export default PathaoService
