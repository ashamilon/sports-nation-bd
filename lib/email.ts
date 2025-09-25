// Use Brevo email service for all email functionality
export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  try {
    const brevoApiKey = process.env.BREVO_API_KEY
    const fromEmail = 'sportsnationbd@yahoo.com'
    const fromName = 'Sports Nation BD'

    if (!brevoApiKey) {
      console.error('Brevo API key not configured')
      return { success: false, error: 'Email service not configured' }
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify({
        sender: {
          name: fromName,
          email: fromEmail
        },
        to: [
          {
            email: email,
            name: 'User'
          }
        ],
        subject: 'Reset Your Password - Sports Nation BD',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #051747; margin-bottom: 10px;">Sports Nation BD</h1>
              <p style="color: #666; font-size: 16px;">Reset Your Password</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #051747; margin-bottom: 20px;">Password Reset Request</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                We received a request to reset your password for your Sports Nation BD account. 
                If you made this request, click the button below to reset your password.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #051747; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #051747; font-size: 14px; word-break: break-all;">
                ${resetUrl}
              </p>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request this password reset, please ignore this email.</p>
              <p style="margin-top: 20px;">
                © 2025 Sports Nation BD. All rights reserved.
              </p>
            </div>
          </div>
        `
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Password reset email sent via Brevo:', result.messageId)
      return { success: true, messageId: result.messageId }
    } else {
      const error = await response.text()
      console.error('Brevo API error:', error)
      return { success: false, error: `Brevo API error: ${response.status}` }
    }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const brevoApiKey = process.env.BREVO_API_KEY
    const fromEmail = 'sportsnationbd@yahoo.com'
    const fromName = 'Sports Nation BD'

    if (!brevoApiKey) {
      console.error('Brevo API key not configured')
      return { success: false, error: 'Email service not configured' }
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify({
        sender: {
          name: fromName,
          email: fromEmail
        },
        to: [
          {
            email: email,
            name: name
          }
        ],
        subject: 'Welcome to Sports Nation BD!',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #051747; margin-bottom: 10px;">Welcome to Sports Nation BD!</h1>
              <p style="color: #666; font-size: 16px;">Your account has been created successfully</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #051747; margin-bottom: 20px;">Hello ${name}!</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Thank you for joining Sports Nation BD! We're excited to have you as part of our community.
              </p>
              
              <div style="background: #e8f4fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #051747; margin-bottom: 10px;">What's Next?</h3>
                <ul style="color: #333; line-height: 1.6;">
                  <li>Browse our collection of sports merchandise</li>
                  <li>Customize your jerseys with team badges</li>
                  <li>Join our loyalty program for exclusive benefits</li>
                  <li>Follow us for the latest updates and offers</li>
                </ul>
              </div>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>© 2025 Sports Nation BD. All rights reserved.</p>
            </div>
          </div>
        `
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Welcome email sent via Brevo:', result.messageId)
      return { success: true, messageId: result.messageId }
    } else {
      const error = await response.text()
      console.error('Brevo API error:', error)
      return { success: false, error: `Brevo API error: ${response.status}` }
    }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}