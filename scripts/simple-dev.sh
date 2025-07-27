#!/bin/bash

echo "🚀 Starting Simple Development Server..."
echo "📋 Features:"
echo "  - Memory optimized (512MB limit)"
echo "  - ESLint disabled for performance"
echo "  - Source maps disabled"
echo "  - Stable and reliable"
echo ""

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "vite\|node.*dev" 2>/dev/null || true

# Wait a moment for processes to die
sleep 2

# Set environment variables
export NODE_OPTIONS="--max-old-space-size=512"
export VITE_DISABLE_ESLINT_PLUGIN="true"
export VITE_DISABLE_SOURCEMAP="true"
export VITE_DISABLE_HMR_OVERLAY="true"

echo "⚙️  Environment variables set:"
echo "- NODE_OPTIONS=--max-old-space-size=512"
echo "- VITE_DISABLE_ESLINT_PLUGIN=true"
echo "- VITE_DISABLE_SOURCEMAP=true"
echo ""

# Start the development server
echo "🌐 Starting Vite development server..."
echo "📝 Press Ctrl+C to stop"
echo ""

# Run the development server
npx vite --port 8080 --host 