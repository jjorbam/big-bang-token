#!/bin/bash

# BIG BANG Token - Frontend Deployment Script
echo "🚀 BIG BANG Token - Frontend Deployment"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "frontend/index.html" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."

# Create a temporary directory for deployment
mkdir -p deploy-frontend
cp -r frontend/* deploy-frontend/

# Create a simple deployment guide
cat > deploy-frontend/DEPLOYMENT.md << 'EOF'
# 🚀 BIG BANG Token - Deployment Guide

## Quick Deploy Options:

### 1. Vercel (Recommended)
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import this repository
5. Deploy!

### 2. Netlify
1. Go to https://netlify.com
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Select this repository
5. Deploy!

### 3. GitHub Pages
1. Push this to a GitHub repository
2. Go to Settings > Pages
3. Select source branch
4. Deploy!

## ⚠️ Important:
- Make sure your contract is deployed
- Update config.js with correct contract address
- Test wallet connection after deployment
EOF

echo "✅ Deployment package created in 'deploy-frontend/' directory"
echo ""
echo "📋 Next steps:"
echo "1. Upload the 'deploy-frontend/' folder to your hosting provider"
echo "2. Or push to GitHub and connect to Vercel/Netlify"
echo ""
echo "🌐 Recommended hosting:"
echo "   - Vercel: https://vercel.com"
echo "   - Netlify: https://netlify.com"
echo "   - GitHub Pages: Free with GitHub"
echo ""
echo "📖 See DEPLOYMENT.md in the deploy-frontend folder for detailed instructions" 