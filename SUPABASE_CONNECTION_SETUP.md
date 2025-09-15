# 🚀 Supabase Connection Setup

## Step 1: Create .env.local File
Create a file named `.env.local` in your project root with this content:

```bash
# Supabase Database Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.kebgbomwiyfumhrslfgg.supabase.co:5432/postgres"

# NextAuth Configuration
NEXTAUTH_SECRET="sports-nation-bd-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 2: Replace [YOUR-PASSWORD]
Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

## Step 3: Run Setup Commands
After creating the .env.local file, run these commands:

```bash
npx prisma db push
npx prisma generate
```

## Step 4: Test Connection
```bash
node scripts/setup-supabase.js
```

## Step 5: Start Development Server
```bash
npm run dev
```

## 🎯 What This Does:
- ✅ Connects your app to Supabase
- ✅ Creates all database tables
- ✅ Your admin panel works with permanent data
- ✅ Ready for Vercel deployment

