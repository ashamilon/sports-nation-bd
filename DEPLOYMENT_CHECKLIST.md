# ✅ Sports Nation BD - Deployment Checklist

## 🎯 **Pre-Deployment (5 minutes)**

- [ ] **Code committed to Git**
  ```bash
  git add .
  git commit -m "Ready for production deployment"
  git push origin main
  ```

- [ ] **Run deployment script**
  ```bash
  ./scripts/deploy-to-vercel.sh
  ```

## 🚀 **Vercel Setup (10 minutes)**

### **1. Create Vercel Account**
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Import your repository

### **2. Configure Build Settings**
- [ ] Framework: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

## 🔧 **Environment Variables (15 minutes)**

### **Required Variables:**
- [ ] `DATABASE_URL` - Your production PostgreSQL URL
- [ ] `NEXTAUTH_URL` - Your Vercel domain (e.g., `https://sports-nation-bd.vercel.app`)
- [ ] `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `EMAIL_PROVIDER` - Set to `"brevo"`
- [ ] `BREVO_API_KEY` - Your Brevo API key
- [ ] `BREVO_FROM_EMAIL` - `"979d27001@smtp-brevo.com"`
- [ ] `BREVO_FROM_NAME` - `"Sports Nation BD"`

### **Payment Gateways:**
- [ ] `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- [ ] `STRIPE_SECRET_KEY` - Your Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- [ ] `SSLCOMMERZ_STORE_ID` - Your SSLCommerz store ID
- [ ] `SSLCOMMERZ_STORE_PASSWORD` - Your SSLCommerz store password
- [ ] `SSLCOMMERZ_SANDBOX` - Set to `"false"` for production

### **Pathao Courier:**
- [ ] `PATHAO_ENVIRONMENT` - Set to `"production"`
- [ ] `PATHAO_CLIENT_ID` - Your Pathao client ID
- [ ] `PATHAO_CLIENT_SECRET` - Your Pathao client secret
- [ ] `PATHAO_USERNAME` - Your Pathao username
- [ ] `PATHAO_PASSWORD` - Your Pathao password

## 🗄️ **Database Setup (10 minutes)**

### **Option 1: Supabase (Recommended)**
- [ ] Create Supabase project
- [ ] Get PostgreSQL connection string
- [ ] Update `DATABASE_URL` in Vercel

### **Option 2: Vercel Postgres**
- [ ] Add Vercel Postgres addon
- [ ] Use auto-generated `DATABASE_URL`

## 🚀 **Deploy (5 minutes)**

- [ ] Click "Deploy" in Vercel dashboard
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors

## 🧪 **Post-Deployment Testing (20 minutes)**

### **Core Functionality:**
- [ ] **Homepage loads** - Visit your domain
- [ ] **User registration** - Test email OTP flow
- [ ] **User login** - Test authentication
- [ ] **Product browsing** - Check product pages
- [ ] **Shopping cart** - Add/remove items
- [ ] **Checkout process** - Test payment flow
- [ ] **Admin dashboard** - Login as admin
- [ ] **CMS functionality** - Test content management

### **Payment Testing:**
- [ ] **Stripe payments** - Test with test cards
- [ ] **SSLCommerz payments** - Test payment flow
- [ ] **Payment success** - Verify order creation
- [ ] **Payment failure** - Test error handling

### **Email Testing:**
- [ ] **OTP emails** - Test registration flow
- [ ] **Email templates** - Check formatting
- [ ] **Brevo delivery** - Verify email delivery

### **Admin Features:**
- [ ] **Order management** - View and manage orders
- [ ] **Product management** - Add/edit products
- [ ] **User management** - View user accounts
- [ ] **Pathao integration** - Test courier features

## 🔒 **Security & Performance (10 minutes)**

- [ ] **HTTPS enabled** - Check SSL certificate
- [ ] **Environment variables** - Verify all secrets are set
- [ ] **Error handling** - Test error pages
- [ ] **Performance** - Check page load speeds
- [ ] **Mobile responsiveness** - Test on mobile devices

## 📊 **Monitoring Setup (5 minutes)**

- [ ] **Vercel Analytics** - Enable in dashboard
- [ ] **Error tracking** - Set up Sentry (optional)
- [ ] **Uptime monitoring** - Set up monitoring service
- [ ] **Database monitoring** - Monitor database performance

## 🎉 **Go Live (5 minutes)**

- [ ] **Custom domain** - Add your domain in Vercel
- [ ] **DNS configuration** - Update DNS settings
- [ ] **Final testing** - Test with real domain
- [ ] **Announce launch** - Share with users!

## 🚨 **Emergency Contacts**

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Database Issues:** Check your database provider's support
- **Payment Issues:** Contact Stripe/SSLCommerz support
- **Email Issues:** Check Brevo dashboard

## 📈 **Post-Launch Tasks**

- [ ] **Monitor performance** - Check Vercel Analytics
- [ ] **User feedback** - Collect and address feedback
- [ ] **Bug fixes** - Address any issues found
- [ ] **Feature updates** - Plan future enhancements
- [ ] **Backup strategy** - Set up regular backups

---

## ⏱️ **Total Estimated Time: 1-2 hours**

**Quick Deploy:** 30 minutes (if everything is ready)
**Full Setup:** 1-2 hours (including testing and configuration)

## 🎯 **Success Criteria**

Your deployment is successful when:
- ✅ All pages load without errors
- ✅ User registration works with email OTP
- ✅ Payments process successfully
- ✅ Admin dashboard is accessible
- ✅ All core features function properly

**Good luck with your launch! 🚀**
