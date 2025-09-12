# 🚀 Sports Nation BD - Deployment Guide

## Overview
This guide will help you deploy your Sports Nation BD e-commerce website to `sportsnationbd.com` using various hosting platforms.

## 🎯 **Recommended: Vercel Deployment (Easiest)**

### Step 1: Prepare Your Project
1. **Push to GitHub**: Make sure your code is in a GitHub repository
2. **Environment Variables**: Prepare all your environment variables
3. **Database**: Set up a production database (recommended: PlanetScale or Neon)

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables (see below)
6. Deploy!

### Step 3: Configure Environment Variables in Vercel
Go to your Vercel project → Settings → Environment Variables and add:

```bash
# Authentication
NEXTAUTH_SECRET=your_super_secret_key_here
NEXTAUTH_URL=https://sportsnationbd.com

# Database (Production)
DATABASE_URL=your_production_database_url

# SSL Commerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_SANDBOX=false

# SMS Configuration
SMS_PROVIDER=bulksmsbd
SMS_API_KEY=your_bulksmsbd_api_key
SMS_SENDER_ID=your_sender_id
SMS_BASE_URL=https://bulksmsbd.net/api/smsapi
```

### Step 4: Custom Domain Setup
1. In Vercel dashboard → Domains
2. Add `sportsnationbd.com`
3. Update your domain's DNS settings:
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.19.61`

---

## 🐳 **Alternative: Docker Deployment**

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Step 2: Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXTAUTH_SECRET=your_secret
      - NEXTAUTH_URL=https://sportsnationbd.com
      - DATABASE_URL=your_database_url
      - SSLCOMMERZ_STORE_ID=your_store_id
      - SSLCOMMERZ_STORE_PASSWORD=your_password
      - SSLCOMMERZ_SANDBOX=false
      - SMS_PROVIDER=bulksmsbd
      - SMS_API_KEY=your_api_key
      - SMS_SENDER_ID=your_sender_id
    restart: unless-stopped
```

---

## 🗄️ **Database Setup (Production)**

### Option 1: PlanetScale (Recommended)
1. Go to [planetscale.com](https://planetscale.com)
2. Create account and new database
3. Get connection string
4. Update `DATABASE_URL` in your deployment

### Option 2: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create account and new project
3. Get connection string
4. Update `DATABASE_URL` in your deployment

### Database Migration
After setting up production database:
```bash
# Push schema to production
npx prisma db push

# Seed admin user
npm run db:seed
```

---

## 🔧 **Post-Deployment Setup**

### 1. Update SSL Commerz Settings
- Change `SSLCOMMERZ_SANDBOX=false` for live payments
- Update success/cancel URLs to your domain

### 2. Configure SMS
- Ensure BulkSMSBD IP whitelisting includes your server IP
- Test SMS functionality

### 3. Set up Monitoring
- Enable Vercel Analytics
- Set up error tracking (Sentry recommended)

---

## 🔄 **Continuous Deployment**

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🛠️ **Making Changes After Deployment**

### Method 1: Direct GitHub Push
1. Make changes locally
2. Push to GitHub
3. Vercel auto-deploys

### Method 2: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Method 3: Vercel Dashboard
1. Go to Vercel dashboard
2. Click "Deploy" → "Import Git Repository"
3. Make changes in Vercel's editor

---

## 📞 **Support & Modifications**

After deployment, you can:
- ✅ Make changes through GitHub (auto-deploy)
- ✅ Use Vercel dashboard for quick edits
- ✅ Contact me for complex modifications
- ✅ Use Vercel CLI for local development

---

## 🚨 **Important Notes**

1. **Never commit `.env.local`** - Use Vercel environment variables
2. **Test thoroughly** before going live
3. **Backup your database** regularly
4. **Monitor performance** and errors
5. **Keep dependencies updated**

---

## 🎉 **You're Ready to Launch!**

Your Sports Nation BD website will be live at `sportsnationbd.com` with:
- ✅ E-commerce functionality
- ✅ SSL Commerz payments
- ✅ SMS order confirmations
- ✅ Admin dashboard
- ✅ Multi-language support
- ✅ Mobile responsive design

**Need help? I'm here to assist with any modifications or issues!** 🚀
