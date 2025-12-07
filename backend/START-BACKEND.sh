#!/bin/bash

echo "🐑 ShepWhispr Backend Starting..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the backend
echo "🚀 Starting backend on http://localhost:3000"
echo "✅ Backend is ready when you see: 'Server running on port 3000'"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
