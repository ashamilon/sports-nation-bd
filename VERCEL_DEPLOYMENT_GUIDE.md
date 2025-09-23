# 🚀 Vercel Deployment Guide - Sports Nation BD

## 📋 Pre-Deployment Checklist

### ✅ **Ready for Production:**
- ✅ Next.js 15.5.3 with App Router
- ✅ Prisma ORM with PostgreSQL
- ✅ NextAuth.js Authentication
- ✅ Stripe Payment Integration
- ✅ SSLCommerz Payment Gateway
- ✅ Brevo Email OTP System
- ✅ Pathao Courier Integration
- ✅ Admin Dashboard
- ✅ CMS System
- ✅ Order Management
- ✅ Product Management
- ✅ User Management

## 🔧 **Environment Variables Setup**

### **Required Environment Variables for Vercel:**

```bash
# Database
DATABASE_URL="your-production-postgresql-url"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secure-secret-key"

# Brevo Email OTP
EMAIL_PROVIDER="brevo"
BREVO_API_KEY="your-brevo-api-key-here"
BREVO_FROM_EMAIL="your-brevo-from-email"
BREVO_FROM_NAME="Sports Nation BD"

# Stripe Payments
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# SSLCommerz Payments
SSLCOMMERZ_STORE_ID="your-sslcommerz-store-id"
SSLCOMMERZ_STORE_PASSWORD="your-sslcommerz-store-password"
SSLCOMMERZ_SANDBOX="false"

# Pathao Courier
PATHAO_ENVIRONMENT="production"
PATHAO_CLIENT_ID="your-pathao-client-id"
PATHAO_CLIENT_SECRET="your-pathao-client-secret"
PATHAO_USERNAME="your-pathao-username"
PATHAO_PASSWORD="your-pathao-password"

# File Uploads (if using external storage)
NEXT_PUBLIC_UPLOAD_URL="https://your-domain.vercel.app"
```

## 🗄️ **Database Setup**

### **Option 1: Supabase (Recommended)**
1. Create a new Supabase project
2. Get your PostgreSQL connection string
3. Update `DATABASE_URL` in Vercel environment variables

### **Option 2: Vercel Postgres**
1. Add Vercel Postgres addon to your project
2. Use the automatically generated `DATABASE_URL`

### **Option 3: External PostgreSQL**
1. Use services like Railway, PlanetScale, or Neon
2. Update `DATABASE_URL` accordingly

## 🚀 **Deployment Steps**

### **1. Prepare Repository**
```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### **2. Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

### **3. Environment Variables**
1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add all required environment variables
3. Make sure to set them for **Production**, **Preview**, and **Development**

### **4. Database Migration**
```bash
# After deployment, run database migration
npx prisma db push
npx prisma generate
```

### **5. Seed Database (Optional)**
```bash
# If you need initial data
npm run db:seed
```

## 🔒 **Security Considerations**

### **Production Checklist:**
- ✅ Use strong `NEXTAUTH_SECRET`
- ✅ Enable HTTPS only
- ✅ Set secure cookie settings
- ✅ Configure CORS properly
- ✅ Use environment variables for all secrets
- ✅ Enable rate limiting
- ✅ Set up proper error handling

## 📊 **Post-Deployment Tasks**

### **1. Domain Configuration**
- Add custom domain in Vercel
- Update `NEXTAUTH_URL` to match your domain
- Configure DNS settings

### **2. SSL Certificates**
- Vercel automatically provides SSL certificates
- Ensure all external services use HTTPS

### **3. Monitoring Setup**
- Enable Vercel Analytics
- Set up error monitoring (Sentry recommended)
- Configure uptime monitoring

### **4. Payment Gateway Testing**
- Test Stripe payments in live mode
- Test SSLCommerz payments
- Verify webhook endpoints

### **5. Email Testing**
- Test Brevo email delivery
- Verify OTP functionality
- Check email templates

## 🧪 **Testing Checklist**

### **Core Functionality:**
- ✅ User registration with email OTP
- ✅ User login/logout
- ✅ Product browsing and search
- ✅ Shopping cart functionality
- ✅ Checkout process
- ✅ Payment processing
- ✅ Order management
- ✅ Admin dashboard access
- ✅ CMS functionality

### **Payment Testing:**
- ✅ Stripe test payments
- ✅ SSLCommerz test payments
- ✅ Payment success/failure handling
- ✅ Webhook processing

### **Email Testing:**
- ✅ OTP email delivery
- ✅ Email template rendering
- ✅ Brevo API integration

## 🚨 **Common Issues & Solutions**

### **Build Failures:**
```bash
# If Prisma client issues
npm run db:generate

# If TypeScript errors
npm run build -- --no-lint
```

### **Database Connection:**
- Ensure `DATABASE_URL` is correct
- Check database accessibility from Vercel
- Verify SSL requirements

### **Environment Variables:**
- Double-check all required variables are set
- Ensure no typos in variable names
- Verify values are correct for production

## 📈 **Performance Optimization**

### **Vercel Optimizations:**
- Enable Edge Functions where applicable
- Use Vercel's Image Optimization
- Configure caching headers
- Enable compression

### **Database Optimization:**
- Add database indexes
- Optimize queries
- Use connection pooling

## 🔄 **CI/CD Pipeline**

### **Automatic Deployments:**
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview deployment

### **Database Migrations:**
- Use Vercel's build hooks for migrations
- Set up automated database backups
- Monitor database performance

## 📞 **Support & Maintenance**

### **Monitoring:**
- Vercel Analytics
- Error tracking
- Performance monitoring
- Uptime monitoring

### **Backups:**
- Database backups
- File uploads backup
- Environment variables backup

## 🎉 **Go Live Checklist**

- [ ] All environment variables configured
- [ ] Database migrated and seeded
- [ ] Payment gateways tested
- [ ] Email system tested
- [ ] Domain configured
- [ ] SSL certificates active
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Performance optimized
- [ ] Security measures in place

---

## 🚀 **Ready to Deploy!**

Your Sports Nation BD e-commerce platform is production-ready! Follow this guide for a smooth deployment to Vercel.

**Estimated Deployment Time:** 15-30 minutes
**Estimated Setup Time:** 1-2 hours (including testing)

Good luck with your launch! 🎉
