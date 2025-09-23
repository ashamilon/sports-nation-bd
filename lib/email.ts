import nodemailer from 'nodemailer'

// Create a transporter for Gmail (you can change this to other providers)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  })
}

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@sportsnation.com',
      to: email,
      subject: 'Reset Your Password - Sports Nation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #051747; margin-bottom: 10px;">Sports Nation</h1>
            <p style="color: #666; font-size: 16px;">Reset Your Password</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #051747; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password for your Sports Nation account. 
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
              © 2025 Sports Nation. All rights reserved.
            </p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@sportsnation.com',
      to: email,
      subject: 'Welcome to Sports Nation!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #051747; margin-bottom: 10px;">Welcome to Sports Nation!</h1>
            <p style="color: #666; font-size: 16px;">Your account has been created successfully</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #051747; margin-bottom: 20px;">Hello ${name}!</h2>
            <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining Sports Nation! We're excited to have you as part of our community.
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
            <p>© 2025 Sports Nation. All rights reserved.</p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
