# 🚀 PlanetScale Setup Guide

## Step 1: Choose FREE Plan
- ✅ Select **"Hobby"** plan ($0/month)
- ✅ No credit card required
- ✅ 1 billion reads/month
- ✅ 10 million writes/month
- ✅ 1GB storage

## Step 2: Create Database
1. Click **"Create database"**
2. Name: `sports-nation-bd`
3. Region: Choose closest to your users
4. Plan: **Hobby (FREE)**
5. Click **"Create database"**

## Step 3: Get Connection String
1. Go to database dashboard
2. Click **"Connect"** button
3. Select **"Prisma"** from dropdown
4. Copy the connection string

## Step 4: Update Your Environment
Create/update `.env.local` file:

```bash
# Replace with your PlanetScale connection string
DATABASE_URL="mysql://username:password@host/database?sslaccept=strict"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 5: Update Prisma Schema
Replace `prisma/schema.prisma` datasource:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

## Step 6: Deploy Schema
```bash
npx prisma db push
npx prisma generate
```

## Step 7: Test Locally
```bash
npm run dev
```

## Step 8: Deploy to Vercel
1. Connect GitHub repo to Vercel
2. Add DATABASE_URL to Vercel environment variables
3. Deploy!

## 🎯 What You Get FREE:
- ✅ 1 billion reads/month
- ✅ 10 million writes/month  
- ✅ 1GB database storage
- ✅ Automatic backups
- ✅ SSL encryption
- ✅ Global edge locations
- ✅ No connection limits

## 💡 Pro Tips:
- Start with FREE tier - it's more than enough
- Upgrade only when you need more
- Your admin panel works exactly the same
- All data persists permanently
- Multiple admins can access simultaneously

