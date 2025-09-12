import axios from 'axios'
import { paymentConfig } from '@/lib/payment-config'

export interface SSLCommerzPaymentRequest {
  total_amount: number
  currency: string
  tran_id: string
  success_url: string
  fail_url: string
  cancel_url: string
  emi_option: number
  cus_name: string
  cus_email: string
  cus_phone: string
  cus_add1: string
  cus_city: string
  cus_country: string
  shipping_method: string
  multi_card_name: string
  num_of_item: number
  product_name: string
  product_category: string
  product_profile: string
}

export interface SSLCommerzResponse {
  status: string
  failedreason?: string
  sessionkey?: string
  redirectGatewayURL?: string
  GatewayPageURL?: string
  gw?: {
    visa?: string
    master?: string
    amex?: string
    othercards?: string
    internetbanking?: string
    mobilebanking?: string
  }
}

export class SSLCommerzService {
  private config = paymentConfig.sslcommerz

  async createPaymentSession(paymentData: SSLCommerzPaymentRequest): Promise<SSLCommerzResponse> {
    try {
      // Format the data for SSL Commerz API
      const formData = new URLSearchParams()
      
      // Add store credentials
      formData.append('store_id', this.config.storeId)
      formData.append('store_passwd', this.config.storePassword)
      
      // Add payment data - SSL Commerz expects amount with 2 decimal places
      formData.append('total_amount', paymentData.total_amount.toFixed(2))
      formData.append('currency', paymentData.currency)
      formData.append('tran_id', paymentData.tran_id)
      formData.append('success_url', paymentData.success_url)
      formData.append('fail_url', paymentData.fail_url)
      formData.append('cancel_url', paymentData.cancel_url)
      formData.append('emi_option', paymentData.emi_option.toString())
      formData.append('cus_name', paymentData.cus_name)
      formData.append('cus_email', paymentData.cus_email)
      formData.append('cus_phone', paymentData.cus_phone)
      formData.append('cus_add1', paymentData.cus_add1)
      formData.append('cus_city', paymentData.cus_city)
      formData.append('cus_country', paymentData.cus_country)
      formData.append('shipping_method', paymentData.shipping_method)
      formData.append('multi_card_name', paymentData.multi_card_name)
      formData.append('num_of_item', paymentData.num_of_item.toString())
      formData.append('product_name', paymentData.product_name)
      formData.append('product_category', paymentData.product_category)
      formData.append('product_profile', paymentData.product_profile)

      const response = await axios.post(
        `${this.config.baseUrl}/gwprocess/v4/api.php`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return response.data
    } catch (error) {
      console.error('SSL Commerz payment creation error:', error)
      throw new Error('Failed to create SSL Commerz payment session')
    }
  }

  async validatePayment(tranId: string, amount: number, currency: string): Promise<boolean> {
    try {
      const formData = new URLSearchParams()
      formData.append('store_id', this.config.storeId)
      formData.append('store_passwd', this.config.storePassword)
      formData.append('tran_id', tranId)
      formData.append('amount', amount.toString())
      formData.append('currency', currency)

      const response = await axios.post(
        `${this.config.baseUrl}/validator/api/validationserverAPI.php`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return response.data.status === 'VALID'
    } catch (error) {
      console.error('SSL Commerz payment validation error:', error)
      return false
    }
  }

  async refundPayment(transactionId: string, amount: number, reason: string): Promise<boolean> {
    try {
      const formData = new URLSearchParams()
      formData.append('store_id', this.config.storeId)
      formData.append('store_passwd', this.config.storePassword)
      formData.append('refund_amount', amount.toString())
      formData.append('refund_remarks', reason)
      formData.append('bank_tran_id', transactionId)

      const response = await axios.post(
        `${this.config.baseUrl}/validator/api/merchantTransIDvalidationAPI.php`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return response.data.status === 'SUCCESS'
    } catch (error) {
      console.error('SSL Commerz refund error:', error)
      return false
    }
  }
}

export const sslCommerzService = new SSLCommerzService()