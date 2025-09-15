# 🚀 Vercel Deployment Guide for Sports Nation BD

## Prerequisites
- ✅ Vercel account (free tier available)
- ✅ GitHub repository with your code
- ✅ Namecheap domain ready
- ✅ Supabase database configured

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Make sure all your changes are committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 1.2 Verify Build
```bash
# Test the build locally
npm run build
```

## Step 2: Deploy to Vercel

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `sports-nation-bd` repository
5. Select the repository and click "Import"

### 2.2 Configure Project Settings
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## Step 3: Environment Variables

### 3.1 Add Environment Variables in Vercel
Go to Project Settings → Environment Variables and add:

```bash
# Database
DATABASE_URL=postgresql://postgres.kebgbomwiyfumhrslfgg:Limon.123!@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Payment Gateways (if using)
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Email Service (for verification emails)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# SMS Service (for OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3.2 Generate NEXTAUTH_SECRET
```bash
# Generate a secure secret
openssl rand -base64 32
```

## Step 4: Deploy

### 4.1 Initial Deployment
1. Click "Deploy" in Vercel
2. Wait for build to complete (2-3 minutes)
3. Your site will be available at `https://your-project.vercel.app`

### 4.2 Test the Deployment
- Visit your Vercel URL
- Test user registration
- Test admin login
- Test all major functionality

## Step 5: Connect Custom Domain

### 5.1 Add Domain in Vercel
1. Go to Project Settings → Domains
2. Add your domain: `yourdomain.com`
3. Add www subdomain: `www.yourdomain.com`

### 5.2 Configure DNS in Namecheap
Go to Namecheap DNS settings and add:

```
Type: A Record
Host: @
Value: 76.76.19.61
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

### 5.3 SSL Certificate
- Vercel automatically provides SSL certificates
- Wait 24-48 hours for full propagation
- Test HTTPS access

## Step 6: Production Optimizations

### 6.1 Update NextAuth URL
Update your environment variables with the actual domain:
```bash
NEXTAUTH_URL=https://yourdomain.com
```

### 6.2 Update Google OAuth (if using)
1. Go to Google Cloud Console
2. Update authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`
   - `https://www.yourdomain.com/api/auth/callback/google`

### 6.3 Update Payment Gateways (if using)
Update webhook URLs in Stripe/PayPal:
- `https://yourdomain.com/api/stripe/webhook`
- `https://yourdomain.com/api/paypal/webhook`

## Step 7: Final Testing

### 7.1 Test All Features
- [ ] User registration with OTP
- [ ] Email verification
- [ ] User login
- [ ] Admin panel access
- [ ] Product browsing
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Payment processing
- [ ] Order management

### 7.2 Performance Check
- [ ] Page load speeds
- [ ] Mobile responsiveness
- [ ] SEO meta tags
- [ ] Image optimization

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check environment variables
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Supabase connection settings
   - Ensure database is accessible from Vercel

3. **Authentication Issues**
   - Verify NEXTAUTH_URL matches your domain
   - Check NEXTAUTH_SECRET is set
   - Update OAuth redirect URIs

4. **Domain Issues**
   - Wait 24-48 hours for DNS propagation
   - Check DNS settings in Namecheap
   - Verify SSL certificate is active

## Support
- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Documentation: https://supabase.com/docs

---

🎉 **Congratulations!** Your Sports Nation BD e-commerce platform is now live!