#!/bin/bash

echo "🧪 Testing Running Application..."
echo ""

# Test server
echo "1. Testing Server (port 5001)..."
if curl -s --max-time 2 http://localhost:5001/api/health > /dev/null 2>&1; then
    HEALTH=$(curl -s http://localhost:5001/api/health)
    echo "   ✅ Server is responding"
    echo "   Response: $HEALTH"
else
    echo "   ❌ Server not responding (may need MongoDB)"
fi

echo ""

# Test client
echo "2. Testing Client (port 5173)..."
if curl -s --max-time 2 http://localhost:5173 > /dev/null 2>&1; then
    TITLE=$(curl -s http://localhost:5173 | grep -o "<title>.*</title>")
    echo "   ✅ Client is responding"
    echo "   $TITLE"
else
    echo "   ❌ Client not responding"
fi

echo ""
echo "📊 Process Status:"
lsof -ti:5001 > /dev/null && echo "   ✅ Server process running" || echo "   ❌ Server process not found"
lsof -ti:5173 > /dev/null && echo "   ✅ Client process running" || echo "   ❌ Client process not found"

echo ""
echo "💡 Note: If MongoDB is not running, database operations will timeout"
echo "   Start MongoDB: brew services start mongodb-community"
