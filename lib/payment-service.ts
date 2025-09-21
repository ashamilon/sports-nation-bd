import { sslCommerzService, SSLCommerzPaymentRequest } from './payment-services/sslcommerz'
import { getPaymentGateway, paymentStatus } from './payment-config'

export interface PaymentRequest {
  amount: number
  currency: string
  orderId: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    country: string
  }
  items: Array<{
    name: string
    quantity: number
    unitAmount: number
    category: string
  }>
  returnUrl: string
  cancelUrl: string
  failUrl: string
}

export interface PaymentResponse {
  success: boolean
  gateway: 'sslcommerz'
  paymentUrl?: string
  orderId?: string
  sessionKey?: string
  error?: string
}

export class PaymentService {
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    // Check if we're in test mode or if SSL Commerz credentials are missing
    const isTestMode = process.env.PAYMENT_TEST_MODE === 'true' || 
                      !process.env.SSLCOMMERZ_STORE_ID || 
                      !process.env.SSLCOMMERZ_STORE_PASSWORD
    
    if (isTestMode) {
      console.log('🧪 Using test payment mode (SSL Commerz credentials missing or test mode enabled)')
      return await this.createTestPayment(paymentData)
    }
    
    // For now, only use SSL Commerz
    const gateway = 'sslcommerz'
    
    try {
      return await this.createSSLCommerzPayment(paymentData)
    } catch (error) {
      console.error('Payment creation error:', error)
      return {
        success: false,
        gateway,
        error: error instanceof Error ? error.message : 'Payment creation failed'
      }
    }
  }

  private async createSSLCommerzPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    // Ensure amount is a number
    const totalAmount = Number(paymentData.amount)
    
    const sslData: SSLCommerzPaymentRequest = {
      total_amount: totalAmount,
      currency: paymentData.currency,
      tran_id: paymentData.orderId,
      success_url: paymentData.returnUrl,
      fail_url: paymentData.failUrl,
      cancel_url: paymentData.cancelUrl,
      emi_option: 0,
      cus_name: paymentData.customerInfo.name,
      cus_email: paymentData.customerInfo.email,
      cus_phone: paymentData.customerInfo.phone,
      cus_add1: paymentData.customerInfo.address,
      cus_city: paymentData.customerInfo.city,
      cus_country: paymentData.customerInfo.country,
      shipping_method: 'NO',
      multi_card_name: 'mastercard,visacard,amex',
      num_of_item: paymentData.items.length,
      product_name: paymentData.items.map(item => item.name).join(', '),
      product_category: 'Sports',
      product_profile: 'general'
    }
    

    const response = await sslCommerzService.createPaymentSession(sslData)
    
    if (response.status === 'SUCCESS' && response.redirectGatewayURL) {
      return {
        success: true,
        gateway: 'sslcommerz',
        paymentUrl: response.redirectGatewayURL,
        orderId: paymentData.orderId,
        sessionKey: response.sessionkey
      }
    } else {
      return {
        success: false,
        gateway: 'sslcommerz',
        error: response.failedreason || 'SSL Commerz payment creation failed'
      }
    }
  }

  private async createTestPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    console.log('🧪 Creating test payment:', {
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency
    })

    // Simulate a successful payment creation
    const testPaymentUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/test?orderId=${paymentData.orderId}&amount=${paymentData.amount}`
    
    return {
      success: true,
      gateway: 'test',
      paymentUrl: testPaymentUrl,
      orderId: paymentData.orderId,
      sessionKey: `test-session-${Date.now()}`
    }
  }

  async validatePayment(
    gateway: 'sslcommerz',
    orderId: string,
    amount: number,
    currency: string
  ): Promise<boolean> {
    try {
      return await sslCommerzService.validatePayment(orderId, amount, currency)
    } catch (error) {
      console.error('Payment validation error:', error)
      return false
    }
  }

  async capturePayment(gateway: 'sslcommerz', orderId: string): Promise<any> {
    try {
      // SSL Commerz doesn't require separate capture
      return { success: true }
    } catch (error) {
      console.error('Payment capture error:', error)
      throw error
    }
  }

  async refundPayment(
    gateway: 'sslcommerz',
    transactionId: string,
    amount: number,
    currency: string,
    reason?: string
  ): Promise<boolean> {
    try {
      return await sslCommerzService.refundPayment(transactionId, amount, reason || 'Refund')
    } catch (error) {
      console.error('Refund error:', error)
      return false
    }
  }
}

export const paymentService = new PaymentService()
