#!/bin/bash

echo "🚀 Setting up Payment Gateway Credentials for Sports Nation BD"
echo "=============================================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    touch .env.local
else
    echo "📝 .env.local file already exists"
fi

echo ""
echo "🔧 Please provide your payment gateway credentials:"
echo ""

# SSL Commerz credentials
echo "🇧🇩 SSL Commerz (Bangladesh) Credentials:"
read -p "Store ID: " ssl_store_id
read -p "Store Password: " ssl_store_password
read -p "Use Sandbox? (y/n): " ssl_sandbox

# PayPal credentials
echo ""
echo "🌍 PayPal (International) Credentials:"
read -p "Client ID: " paypal_client_id
read -p "Client Secret: " paypal_client_secret
read -p "Use Sandbox? (y/n): " paypal_sandbox

# Convert sandbox responses
ssl_sandbox_value="false"
if [[ $ssl_sandbox == "y" || $ssl_sandbox == "Y" ]]; then
    ssl_sandbox_value="true"
fi

paypal_sandbox_value="false"
if [[ $paypal_sandbox == "y" || $paypal_sandbox == "Y" ]]; then
    paypal_sandbox_value="true"
fi

echo ""
echo "💾 Writing credentials to .env.local..."

# Write to .env.local
cat >> .env.local << EOF

# Payment Gateway Credentials
# SSL Commerz (Bangladesh)
SSLCOMMERZ_STORE_ID=$ssl_store_id
SSLCOMMERZ_STORE_PASSWORD=$ssl_store_password
SSLCOMMERZ_SANDBOX=$ssl_sandbox_value

# PayPal (International)
PAYPAL_CLIENT_ID=$paypal_client_id
PAYPAL_CLIENT_SECRET=$paypal_client_secret
PAYPAL_SANDBOX=$paypal_sandbox_value

# NextAuth Configuration
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"
EOF

echo ""
echo "✅ Credentials have been saved to .env.local"
echo ""
echo "🔄 Restarting the development server to apply changes..."
echo ""

# Kill existing dev server
pkill -f "next dev" 2>/dev/null || true

# Start new dev server
npm run dev &

echo "🚀 Development server is starting..."
echo "📱 Your app will be available at: http://localhost:3000"
echo ""
echo "🧪 Test your payment integration:"
echo "   1. Add items to cart"
echo "   2. Go to checkout"
echo "   3. Select payment method"
echo "   4. Complete payment"
echo ""
echo "📚 For more information, check:"
echo "   - PAYMENT_SETUP.md"
echo "   - SSL Commerz: https://developer.sslcommerz.com/"
echo "   - PayPal: https://developer.paypal.com/"
