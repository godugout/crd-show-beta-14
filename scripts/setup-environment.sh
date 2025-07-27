#!/bin/bash

echo "🔧 Setting up development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from your project root directory"
    exit 1
fi

# Clean up any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "vite\|node.*dev\|monitor-changes" 2>/dev/null || true

# Clear npm cache
echo "🗑️  Clearing npm cache..."
npm cache clean --force

# Remove node_modules and reinstall
echo "📦 Reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install

# Set up environment variables
echo "⚙️  Setting up environment variables..."
export NODE_OPTIONS="--max-old-space-size=512"
export VITE_DISABLE_ESLINT_PLUGIN="true"
export VITE_DISABLE_SOURCEMAP="true"

# Create a .env file for the project
cat > .env.local << EOF
# Development Environment Settings
NODE_OPTIONS=--max-old-space-size=512
VITE_DISABLE_ESLINT_PLUGIN=true
VITE_DISABLE_SOURCEMAP=true
VITE_DISABLE_HMR_OVERLAY=true

# Memory optimization
NODE_ENV=development
VITE_MODE=development

# Performance settings
VITE_DISABLE_FAST_REFRESH=false
VITE_DISABLE_HOT_RELOAD=false
EOF

echo "✅ Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run: npm run dev-optimized"
echo "2. Visit: http://localhost:8080"
echo "3. Check dashboard: http://localhost:8080/admin/claude-dashboard"
echo ""
echo "🔧 Environment variables set:"
echo "- NODE_OPTIONS=--max-old-space-size=512"
echo "- VITE_DISABLE_ESLINT_PLUGIN=true"
echo "- VITE_DISABLE_SOURCEMAP=true"
echo ""
echo "🚀 Ready to start development!" 