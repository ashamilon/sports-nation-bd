interface SMSConfig {
  provider: 'bulksmsbd' | 'smsbd' | 'textlocal' | 'custom'
  apiKey: string
  senderId: string
  baseUrl?: string
}

interface SMSMessage {
  to: string
  message: string
  orderNumber?: string
  customerName?: string
  totalAmount?: number
  deliveryAddress?: string
}

interface SMSResponse {
  success: boolean
  messageId?: string
  error?: string
}

export class SMSService {
  private config: SMSConfig

  constructor() {
    this.config = {
      provider: (process.env.SMS_PROVIDER as any) || 'bulksmsbd',
      apiKey: process.env.SMS_API_KEY || '',
      senderId: process.env.SMS_SENDER_ID || 'SPORTSBD',
      baseUrl: process.env.SMS_BASE_URL
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '')
    
    // Handle different formats
    if (cleaned.startsWith('880')) {
      return cleaned
    } else if (cleaned.startsWith('0')) {
      return '880' + cleaned.substring(1)
    } else if (cleaned.length === 11) {
      return '880' + cleaned
    } else if (cleaned.length === 10) {
      return '880' + cleaned
    }
    
    return '880' + cleaned
  }

  private generateOrderConfirmationMessage(data: {
    orderNumber: string
    customerName: string
    totalAmount: number
    deliveryAddress: string
    items: Array<{ name: string; quantity: number }>
  }): string {
    const { orderNumber, customerName, totalAmount, deliveryAddress, items } = data
    
    const itemsList = items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ')
    
    return `Dear ${customerName},

Your order #${orderNumber} has been confirmed!

Items: ${itemsList}
Total: ৳${totalAmount.toFixed(2)}
Delivery: ${deliveryAddress}

We'll prepare your order and notify you once it's shipped.

Thank you for choosing Sports Nation BD!

For support: +880 1234 567890`
  }

  async sendOrderConfirmation(data: {
    phone: string
    orderNumber: string
    customerName: string
    totalAmount: number
    deliveryAddress: string
    items: Array<{ name: string; quantity: number }>
  }): Promise<SMSResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(data.phone)
      const message = this.generateOrderConfirmationMessage(data)

      console.log(`Sending SMS to ${formattedPhone}: ${message.substring(0, 50)}...`)

      // Check if phone number is Bangladeshi
      if (!formattedPhone.startsWith('880')) {
        console.log('SMS not sent: Phone number is not Bangladeshi')
        return { success: false, error: 'Phone number is not Bangladeshi' }
      }

      switch (this.config.provider) {
        case 'bulksmsbd':
          return await this.sendViaBulkSMSBD(formattedPhone, message)
        case 'smsbd':
          return await this.sendViaSMSBD(formattedPhone, message)
        case 'textlocal':
          return await this.sendViaTextLocal(formattedPhone, message)
        case 'custom':
          return await this.sendViaCustomProvider(formattedPhone, message)
        default:
          return await this.sendViaBulkSMSBD(formattedPhone, message)
      }
    } catch (error) {
      console.error('SMS sending error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  private async sendViaBulkSMSBD(phone: string, message: string): Promise<SMSResponse> {
    try {
      // Use GET request as per BulkSMSBD documentation
      // URL encode the message to handle special characters
      const encodedMessage = encodeURIComponent(message)
      
      const params = new URLSearchParams({
        api_key: this.config.apiKey,
        type: 'text',
        number: phone,
        senderid: this.config.senderId,
        message: encodedMessage
      })

      const url = `https://bulksmsbd.net/api/smsapi?${params.toString()}`
      console.log('BulkSMSBD Request URL:', url.replace(this.config.apiKey, '***'))
      
      const response = await fetch(url)
      const result = await response.text()
      
      console.log('BulkSMSBD Response:', result)
      
      // Parse JSON response if possible
      let parsedResult
      try {
        parsedResult = JSON.parse(result)
      } catch {
        parsedResult = { message: result }
      }
      
      // Check for success response
      if (result.includes('SMS Sent Successfully') || 
          result.includes('SMS Submitted Successfully') ||
          result.includes('202') || 
          (parsedResult.response_code && parsedResult.response_code === '202') ||
          (parsedResult.response_code && parsedResult.response_code === 202)) {
        return { 
          success: true, 
          messageId: parsedResult.message_id || 'bulksmsbd_' + Date.now() 
        }
      } else {
        return { 
          success: false, 
          error: parsedResult.error_message || parsedResult.message || result || 'SMS sending failed' 
        }
      }
    } catch (error) {
      console.error('BulkSMSBD error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  private async sendViaSMSBD(phone: string, message: string): Promise<SMSResponse> {
    try {
      const response = await fetch('https://api.smsbd.net/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.config.apiKey,
          to: phone,
          message: message,
          sender_id: this.config.senderId
        })
      })

      const result = await response.json()
      
      if (result.status === 'success') {
        return { success: true, messageId: result.message_id }
      } else {
        return { success: false, error: result.message || 'SMS sending failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  private async sendViaTextLocal(phone: string, message: string): Promise<SMSResponse> {
    try {
      const formData = new URLSearchParams()
      formData.append('apikey', this.config.apiKey)
      formData.append('numbers', phone)
      formData.append('message', message)
      formData.append('sender', this.config.senderId)

      const response = await fetch('https://api.textlocal.in/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      })

      const result = await response.json()
      
      if (result.status === 'success') {
        return { success: true, messageId: result.batch_id }
      } else {
        return { success: false, error: result.errors?.[0]?.message || 'SMS sending failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  private async sendViaCustomProvider(phone: string, message: string): Promise<SMSResponse> {
    try {
      if (!this.config.baseUrl) {
        return { success: false, error: 'Custom provider URL not configured' }
      }

      const response = await fetch(this.config.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.config.apiKey,
          to: phone,
          message: message,
          sender_id: this.config.senderId
        })
      })

      const result = await response.json()
      
      if (result.success || result.status === 'success') {
        return { success: true, messageId: result.message_id || result.id }
      } else {
        return { success: false, error: result.error || result.message || 'SMS sending failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  // Test SMS functionality
  async sendTestSMS(phone: string): Promise<SMSResponse> {
    const testMessage = `Test SMS from Sports Nation BD. If you receive this, SMS service is working correctly!`
    
    try {
      const formattedPhone = this.formatPhoneNumber(phone)
      
      if (!formattedPhone.startsWith('880')) {
        return { success: false, error: 'Phone number is not Bangladeshi' }
      }

      return await this.sendOrderConfirmation({
        phone: formattedPhone,
        orderNumber: 'TEST-001',
        customerName: 'Test Customer',
        totalAmount: 1000,
        deliveryAddress: 'Test Address, Dhaka',
        items: [{ name: 'Test Product', quantity: 1 }]
      })
    } catch (error) {
      return { success: false, error: 'Test SMS failed' }
    }
  }
}

// Export singleton instance
export const smsService = new SMSService()
