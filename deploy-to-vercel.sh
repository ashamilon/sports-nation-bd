#!/bin/bash

echo "🚀 Deploying Sports Nation BD to Vercel..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Ready for deployment'"
    exit 1
fi

# Check if remote origin is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No GitHub remote found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/sports-nation-bd.git"
    echo "   git push -u origin main"
    exit 1
fi

echo "✅ Git repository is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Click 'New Project'"
echo "4. Import your 'sports-nation-bd' repository"
echo "5. Configure environment variables (see DEPLOYMENT_GUIDE.md)"
echo "6. Deploy!"
echo ""
echo "🔗 Your site will be available at: https://your-project.vercel.app"
echo "🌐 After connecting your domain: https://yourdomain.com"
