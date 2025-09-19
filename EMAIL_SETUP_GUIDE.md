# Email Setup Guide for Password Reset

## Quick Setup (Gmail)

### 1. Enable 2-Factor Authentication on Gmail
- Go to your Google Account settings
- Enable 2-Factor Authentication if not already enabled

### 2. Generate App Password
- Go to Google Account → Security → 2-Step Verification
- Scroll down to "App passwords"
- Generate a new app password for "Mail"
- Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### 3. Update Environment Variables
Edit your `.env.local` file and replace the email configuration:

```bash
# Email Configuration (Gmail)
EMAIL_USER=your_actual_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

**Example:**
```bash
EMAIL_USER=sportsnationbd@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### 4. Restart Development Server
```bash
npm run dev
```

## Alternative Email Providers

### Outlook/Hotmail
```bash
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_app_password
```

### Custom SMTP
Update `lib/email.ts` to use your SMTP settings:

```typescript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-server.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})
```

## Testing

1. Go to `/auth/forgot-password`
2. Enter your email address
3. Check your email inbox (and spam folder)
4. Click the reset link to reset your password

## Development Mode

In development mode, the reset link will also be:
- Logged to the console
- Shown in a toast notification
- This helps with testing without email setup

## Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password, not your regular Gmail password
- Ensure 2-Factor Authentication is enabled

### "Less secure app access" error
- Use App Passwords instead of enabling less secure apps
- App Passwords are more secure

### Emails going to spam
- Add your domain to Gmail's safe senders list
- Consider using a professional email service like SendGrid or AWS SES for production

## Production Setup

For production, consider using:
- **SendGrid** - Professional email service
- **AWS SES** - Amazon's email service
- **Mailgun** - Developer-friendly email API
- **Postmark** - Transactional email service

Update the email service in `lib/email.ts` accordingly.
