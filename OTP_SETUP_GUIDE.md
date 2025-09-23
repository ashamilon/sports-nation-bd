# 🔐 OTP Setup Guide for Production - Brevo Email OTP

## 📋 **Environment Variables Setup**

Add these variables to your `.env.local` file:

```bash
# OTP Configuration
EMAIL_PROVIDER="brevo" # brevo, sendgrid, mailgun, ses

# Brevo Email (Recommended for Bangladesh)
BREVO_API_KEY="your-brevo-api-key"
BREVO_FROM_EMAIL="noreply@sportsnationbd.com"
BREVO_FROM_NAME="Sports Nation BD"

# Alternative Email Providers (if needed)
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@sportsnationbd.com"
MAILGUN_API_KEY="your-mailgun-api-key"
MAILGUN_DOMAIN="your-mailgun-domain"
MAILGUN_FROM_EMAIL="noreply@sportsnationbd.com"
```

## 🚀 **Step-by-Step Setup**

### **1. Database Migration**
```bash
npx prisma migrate dev --name add-otp-model
npx prisma generate
```

### **2. Set Up Brevo Email Provider**

#### **Brevo Setup (Recommended for Bangladesh)**
1. Sign up at [Brevo](https://www.brevo.com/) (formerly Sendinblue)
2. Go to Settings → API Keys
3. Create a new API key with "Send emails" permission
4. Verify your sender email address
5. Add to `.env.local`:
   ```bash
   EMAIL_PROVIDER="brevo"
   BREVO_API_KEY="your-brevo-api-key"
   BREVO_FROM_EMAIL="noreply@sportsnationbd.com"
   BREVO_FROM_NAME="Sports Nation BD"
   ```

#### **Alternative Email Providers (if needed)**

**SendGrid:**
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API key
3. Verify sender email
4. Add to `.env.local`:
   ```bash
   EMAIL_PROVIDER="sendgrid"
   SENDGRID_API_KEY="your-api-key"
   SENDGRID_FROM_EMAIL="noreply@sportsnationbd.com"
   ```

**Mailgun:**
1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Get API key and domain
3. Add to `.env.local`:
   ```bash
   EMAIL_PROVIDER="mailgun"
   MAILGUN_API_KEY="your-api-key"
   MAILGUN_DOMAIN="your-domain"
   MAILGUN_FROM_EMAIL="noreply@sportsnationbd.com"
   ```

## 📱 **Usage Examples**

### **Send Email OTP (Recommended)**
```javascript
const response = await fetch('/api/otp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    identifier: 'user@example.com',
    type: 'email'
  })
})

const result = await response.json()
// { success: true, message: 'OTP sent successfully to your email' }
```

### **Send Phone OTP (Alternative)**
```javascript
const response = await fetch('/api/otp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    identifier: '+8801712345678', // Bangladesh phone number
    type: 'phone'
  })
})

const result = await response.json()
// { success: true, message: 'OTP sent successfully to your phone' }
```

### **Verify OTP**
```javascript
const response = await fetch('/api/otp/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    identifier: 'user@example.com', // or phone number
    otp: '123456'
  })
})

const result = await response.json()
// { success: true, message: 'OTP verified successfully' }
```

## 🔧 **Integration with Registration**

### **Update your registration form:**

```typescript
// In your registration component
const [otpSent, setOtpSent] = useState(false)
const [otpVerified, setOtpVerified] = useState(false)
const [otp, setOtp] = useState('')

const sendOTP = async () => {
  const response = await fetch('/api/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: email, // or phone number
      type: 'email' // or 'phone'
    })
  })
  
  const result = await response.json()
  if (result.success) {
    setOtpSent(true)
  }
}

const verifyOTP = async () => {
  const response = await fetch('/api/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: email, // or phone number
      otp: otp
    })
  })
  
  const result = await response.json()
  if (result.success) {
    setOtpVerified(true)
    // Proceed with registration
  }
}
```

## 🛡️ **Security Features**

- ✅ **Rate Limiting**: 1 OTP per minute per identifier
- ✅ **Expiration**: OTPs expire after 10 minutes
- ✅ **Attempt Limiting**: Maximum 3 verification attempts
- ✅ **One-time Use**: OTPs can only be used once
- ✅ **Phone Validation**: Validates Bangladesh mobile numbers
- ✅ **Email Validation**: Validates email format
- ✅ **Auto Cleanup**: Expired OTPs are automatically cleaned up

## 💰 **Cost Estimates (Bangladesh)**

### **Email Costs (Recommended):**
- **Brevo**: Free tier: 300 emails/day, then €25/month for 20k emails
- **SendGrid**: Free tier: 100 emails/day, then $14.95/month for 40k emails
- **Mailgun**: Free tier: 5k emails/month, then $35/month for 50k emails

### **SMS Costs (Alternative):**
- **TextLocal**: ~৳0.50-1.00 per SMS
- **Twilio**: ~$0.0075 per SMS (~৳0.80)
- **BulkSMS**: ~৳0.30-0.50 per SMS

## 🚨 **Production Checklist**

- [ ] Set up Brevo email provider account
- [ ] Add environment variables to `.env.local`
- [ ] Run database migration
- [ ] Test email OTP sending in development
- [ ] Test OTP verification in development
- [ ] Set up monitoring for OTP delivery rates
- [ ] Configure proper error handling
- [ ] Set up backup email provider (optional)
- [ ] Test with real email addresses
- [ ] Verify sender email domain

## 🔄 **Maintenance**

### **Cleanup Expired OTPs (Optional)**
Add this to a cron job or run periodically:

```javascript
import { otpService } from '@/lib/otp-service'

// Run this daily
await otpService.cleanupExpiredOTPs()
```

### **Monitoring**
- Monitor OTP delivery success rates
- Track failed verification attempts
- Monitor API costs
- Set up alerts for high failure rates

## 📞 **Support**

For issues with specific providers:
- **Brevo**: [Support](https://help.brevo.com/)
- **SendGrid**: [Support](https://support.sendgrid.com/)
- **Mailgun**: [Support](https://help.mailgun.com/)
- **TextLocal**: [Support](https://www.textlocal.in/support/)
- **Twilio**: [Support](https://support.twilio.com/)

---

**Recommended Setup for Bangladesh:**
- **Email**: Brevo (excellent free tier, reliable delivery, good for Bangladesh)
- **Backup**: SendGrid (reliable alternative)
