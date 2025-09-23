import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface OTPConfig {
  smsProvider: 'textlocal' | 'twilio' | 'bulksms' | 'smsglobal'
  emailProvider: 'brevo' | 'sendgrid' | 'mailgun' | 'ses'
  textlocalApiKey?: string
  textlocalSenderId?: string
  twilioAccountSid?: string
  twilioAuthToken?: string
  twilioPhoneNumber?: string
  brevoApiKey?: string
  brevoFromEmail?: string
  brevoFromName?: string
  sendgridApiKey?: string
  sendgridFromEmail?: string
  mailgunApiKey?: string
  mailgunDomain?: string
  mailgunFromEmail?: string
}

export class OTPService {
  private config: OTPConfig

  constructor(config: OTPConfig) {
    this.config = config
  }

  /**
   * Generate a 6-digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Store OTP in database with expiration
   */
  private async storeOTP(identifier: string, otp: string, type: 'phone' | 'email'): Promise<void> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.otp.upsert({
      where: { identifier },
      update: {
        code: otp,
        type,
        expiresAt,
        attempts: 0,
        isVerified: false
      },
      create: {
        identifier,
        code: otp,
        type,
        expiresAt,
        attempts: 0,
        isVerified: false
      }
    })
  }

  /**
   * Send SMS OTP
   */
  private async sendSMSOTP(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      switch (this.config.smsProvider) {
        case 'textlocal':
          return await this.sendTextLocalSMS(phoneNumber, otp)
        case 'twilio':
          return await this.sendTwilioSMS(phoneNumber, otp)
        case 'bulksms':
          return await this.sendBulkSMSSMS(phoneNumber, otp)
        case 'smsglobal':
          return await this.sendSMSGlobalSMS(phoneNumber, otp)
        default:
          throw new Error('SMS provider not configured')
      }
    } catch (error) {
      console.error('SMS OTP sending failed:', error)
      return false
    }
  }

  /**
   * Send Email OTP
   */
  private async sendEmailOTP(email: string, otp: string): Promise<boolean> {
    try {
      switch (this.config.emailProvider) {
        case 'brevo':
          return await this.sendBrevoEmail(email, otp)
        case 'sendgrid':
          return await this.sendSendGridEmail(email, otp)
        case 'mailgun':
          return await this.sendMailgunEmail(email, otp)
        case 'ses':
          return await this.sendSESEmail(email, otp)
        default:
          throw new Error('Email provider not configured')
      }
    } catch (error) {
      console.error('Email OTP sending failed:', error)
      return false
    }
  }

  /**
   * TextLocal SMS Implementation
   */
  private async sendTextLocalSMS(phoneNumber: string, otp: string): Promise<boolean> {
    const message = `Your Sports Nation BD verification code is: ${otp}. Valid for 10 minutes.`
    
    const response = await fetch('https://api.textlocal.in/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apikey: this.config.textlocalApiKey,
        numbers: phoneNumber,
        message: message,
        sender: this.config.textlocalSenderId || 'SPORTS'
      })
    })

    const result = await response.json()
    return result.status === 'success'
  }

  /**
   * Twilio SMS Implementation
   */
  private async sendTwilioSMS(phoneNumber: string, otp: string): Promise<boolean> {
    const message = `Your Sports Nation BD verification code is: ${otp}. Valid for 10 minutes.`
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.config.twilioAccountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.config.twilioAccountSid}:${this.config.twilioAuthToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: phoneNumber,
        From: this.config.twilioPhoneNumber!,
        Body: message
      })
    })

    return response.ok
  }

  /**
   * Brevo Email Implementation
   */
  private async sendBrevoEmail(email: string, otp: string): Promise<boolean> {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': this.config.brevoApiKey!
      },
      body: JSON.stringify({
        sender: {
          name: this.config.brevoFromName || 'Sports Nation BD',
          email: this.config.brevoFromEmail || 'noreply@sportsnationbd.com'
        },
        to: [
          {
            email: email,
            name: 'User'
          }
        ],
        subject: 'Sports Nation BD - Verification Code',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">🏆 Sports Nation BD</h1>
              <p style="color: #6b7280; margin: 5px 0;">Your Premier Sports Store</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; margin: 20px 0;">
              <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px;">Verification Code</h2>
              <p style="color: white; margin: 0 0 20px 0; font-size: 16px;">Please use the following code to verify your account:</p>
              
              <div style="background-color: rgba(255, 255, 255, 0.2); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
              </div>
              
              <p style="color: white; margin: 0; font-size: 14px;">This code will expire in 10 minutes</p>
            </div>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0;">Security Tips:</h3>
              <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
                <li>Never share this code with anyone</li>
                <li>Sports Nation BD will never ask for your verification code</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                © 2024 Sports Nation BD. All rights reserved.<br>
                Your Premier Sports Store in Bangladesh
              </p>
            </div>
          </div>
        `,
        textContent: `
          Sports Nation BD - Verification Code
          
          Your verification code is: ${otp}
          
          This code will expire in 10 minutes.
          
          If you didn't request this code, please ignore this email.
          
          © 2024 Sports Nation BD - Your Premier Sports Store
        `
      })
    })

    const result = await response.json()
    return response.ok
  }

  /**
   * SendGrid Email Implementation
   */
  private async sendSendGridEmail(email: string, otp: string): Promise<boolean> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }],
          subject: 'Sports Nation BD - Verification Code'
        }],
        from: {
          email: this.config.sendgridFromEmail || 'noreply@sportsnationbd.com',
          name: 'Sports Nation BD'
        },
        content: [{
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Sports Nation BD</h2>
              <p>Your verification code is:</p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #1f2937; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p>This code is valid for 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">Sports Nation BD - Your Premier Sports Store</p>
            </div>
          `
        }]
      })
    })

    return response.ok
  }

  /**
   * Mailgun Email Implementation
   */
  private async sendMailgunEmail(email: string, otp: string): Promise<boolean> {
    const formData = new FormData()
    formData.append('from', this.config.mailgunFromEmail || 'noreply@sportsnationbd.com')
    formData.append('to', email)
    formData.append('subject', 'Sports Nation BD - Verification Code')
    formData.append('html', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Sports Nation BD</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1f2937; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This code is valid for 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">Sports Nation BD - Your Premier Sports Store</p>
      </div>
    `)

    const response = await fetch(`https://api.mailgun.net/v3/${this.config.mailgunDomain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${this.config.mailgunApiKey}`).toString('base64')}`
      },
      body: formData
    })

    return response.ok
  }

  /**
   * BulkSMS Implementation (placeholder - you'll need to implement based on their API)
   */
  private async sendBulkSMSSMS(phoneNumber: string, otp: string): Promise<boolean> {
    // Implement BulkSMS API integration
    // This is a placeholder - you'll need to check BulkSMS documentation
    console.log(`BulkSMS OTP to ${phoneNumber}: ${otp}`)
    return true
  }

  /**
   * SMSGlobal Implementation (placeholder - you'll need to implement based on their API)
   */
  private async sendSMSGlobalSMS(phoneNumber: string, otp: string): Promise<boolean> {
    // Implement SMSGlobal API integration
    // This is a placeholder - you'll need to check SMSGlobal documentation
    console.log(`SMSGlobal OTP to ${phoneNumber}: ${otp}`)
    return true
  }

  /**
   * Amazon SES Implementation (placeholder - you'll need to implement based on their API)
   */
  private async sendSESEmail(email: string, otp: string): Promise<boolean> {
    // Implement Amazon SES integration
    // This is a placeholder - you'll need to check AWS SES documentation
    console.log(`SES OTP to ${email}: ${otp}`)
    return true
  }

  /**
   * Send OTP to phone number
   */
  async sendPhoneOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate phone number format
      if (!this.isValidPhoneNumber(phoneNumber)) {
        return { success: false, message: 'Invalid phone number format' }
      }

      // Check rate limiting
      const recentOTP = await prisma.otp.findFirst({
        where: {
          identifier: phoneNumber,
          createdAt: {
            gte: new Date(Date.now() - 60 * 1000) // 1 minute ago
          }
        }
      })

      if (recentOTP) {
        return { success: false, message: 'Please wait 1 minute before requesting another OTP' }
      }

      const otp = this.generateOTP()
      await this.storeOTP(phoneNumber, otp, 'phone')

      const smsSent = await this.sendSMSOTP(phoneNumber, otp)
      
      if (smsSent) {
        return { success: true, message: 'OTP sent successfully to your phone' }
      } else {
        return { success: false, message: 'Failed to send OTP. Please try again.' }
      }
    } catch (error) {
      console.error('Phone OTP error:', error)
      return { success: false, message: 'An error occurred. Please try again.' }
    }
  }

  /**
   * Send OTP to email
   */
  async sendEmailOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate email format
      if (!this.isValidEmail(email)) {
        return { success: false, message: 'Invalid email format' }
      }

      // Check rate limiting
      const recentOTP = await prisma.otp.findFirst({
        where: {
          identifier: email,
          createdAt: {
            gte: new Date(Date.now() - 60 * 1000) // 1 minute ago
          }
        }
      })

      if (recentOTP) {
        return { success: false, message: 'Please wait 1 minute before requesting another OTP' }
      }

      const otp = this.generateOTP()
      await this.storeOTP(email, otp, 'email')

      const emailSent = await this.sendEmailOTP(email, otp)
      
      if (emailSent) {
        return { success: true, message: 'OTP sent successfully to your email' }
      } else {
        return { success: false, message: 'Failed to send OTP. Please try again.' }
      }
    } catch (error) {
      console.error('Email OTP error:', error)
      return { success: false, message: 'An error occurred. Please try again.' }
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(identifier: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const otpRecord = await prisma.otp.findUnique({
        where: { identifier }
      })

      if (!otpRecord) {
        return { success: false, message: 'OTP not found. Please request a new one.' }
      }

      if (otpRecord.isVerified) {
        return { success: false, message: 'OTP already used. Please request a new one.' }
      }

      if (otpRecord.expiresAt < new Date()) {
        return { success: false, message: 'OTP expired. Please request a new one.' }
      }

      if (otpRecord.attempts >= 3) {
        return { success: false, message: 'Too many failed attempts. Please request a new OTP.' }
      }

      if (otpRecord.code !== otp) {
        // Increment attempts
        await prisma.otp.update({
          where: { identifier },
          data: { attempts: otpRecord.attempts + 1 }
        })

        return { success: false, message: 'Invalid OTP. Please try again.' }
      }

      // Mark as verified
      await prisma.otp.update({
        where: { identifier },
        data: { isVerified: true }
      })

      return { success: true, message: 'OTP verified successfully' }
    } catch (error) {
      console.error('OTP verification error:', error)
      return { success: false, message: 'An error occurred during verification.' }
    }
  }

  /**
   * Validate phone number (Bangladesh format)
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '')
    
    // Check if it's a valid Bangladesh mobile number
    // Format: +8801XXXXXXXXX or 01XXXXXXXXX
    const bangladeshMobileRegex = /^(\+880|880|0)?1[3-9]\d{8}$/
    return bangladeshMobileRegex.test(cleaned)
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Clean up expired OTPs
   */
  async cleanupExpiredOTPs(): Promise<void> {
    await prisma.otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
  }
}

// Export singleton instance
export const otpService = new OTPService({
  smsProvider: process.env.SMS_PROVIDER as any || 'textlocal',
  emailProvider: process.env.EMAIL_PROVIDER as any || 'brevo',
  textlocalApiKey: process.env.TEXTLOCAL_API_KEY,
  textlocalSenderId: process.env.TEXTLOCAL_SENDER_ID,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  brevoApiKey: process.env.BREVO_API_KEY,
  brevoFromEmail: process.env.BREVO_FROM_EMAIL,
  brevoFromName: process.env.BREVO_FROM_NAME,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  mailgunFromEmail: process.env.MAILGUN_FROM_EMAIL
})
