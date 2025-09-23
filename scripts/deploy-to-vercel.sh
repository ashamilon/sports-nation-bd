#!/bin/bash

# 🚀 Sports Nation BD - Vercel Deployment Script
# This script helps prepare and deploy your application to Vercel

echo "🏆 Sports Nation BD - Vercel Deployment Script"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project structure verified"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"

# Check if all dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies ready"

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

echo "✅ Prisma client generated"

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Make sure to set environment variables in Vercel dashboard."
fi

echo ""
echo "🎉 Project is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your GitHub repository"
echo "3. Set up environment variables (see .env.production.example)"
echo "4. Deploy!"
echo ""
echo "🔧 Environment Variables to set in Vercel:"
echo "- DATABASE_URL"
echo "- NEXTAUTH_URL"
echo "- NEXTAUTH_SECRET"
echo "- BREVO_API_KEY"
echo "- BREVO_FROM_EMAIL"
echo "- BREVO_FROM_NAME"
echo "- STRIPE_PUBLISHABLE_KEY"
echo "- STRIPE_SECRET_KEY"
echo "- SSLCOMMERZ_STORE_ID"
echo "- SSLCOMMERZ_STORE_PASSWORD"
echo "- PATHAO_CLIENT_ID"
echo "- PATHAO_CLIENT_SECRET"
echo "- PATHAO_USERNAME"
echo "- PATHAO_PASSWORD"
echo ""
echo "📖 For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
echo "🚀 Ready to deploy! Good luck!"
