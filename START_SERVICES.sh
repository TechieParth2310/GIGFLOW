#!/bin/bash

echo "🚀 Starting GigFlow Services..."
echo ""

# Check MongoDB
echo "1. Checking MongoDB..."
if pgrep -f mongod > /dev/null; then
    echo "   ✅ MongoDB is already running"
else
    echo "   ⚠️  MongoDB is not running"
    echo "   Attempting to start MongoDB..."
    
    # Try different MongoDB service names
    if brew services start mongodb-community 2>/dev/null; then
        echo "   ✅ MongoDB started successfully"
    elif brew services start mongodb 2>/dev/null; then
        echo "   ✅ MongoDB started successfully"
    else
        echo "   ❌ Could not start MongoDB automatically"
        echo "   Please start manually:"
        echo "     brew services start mongodb-community"
        echo "   Or use MongoDB Atlas (cloud)"
    fi
    sleep 2
fi

# Check Server
echo ""
echo "2. Checking Server..."
if lsof -ti:5001 > /dev/null; then
    echo "   ✅ Server is already running on port 5001"
else
    echo "   ⚠️  Server is not running"
    echo "   Starting server..."
    cd server
    npm run dev > /tmp/gigflow-server.log 2>&1 &
    SERVER_PID=$!
    echo "   Server starting (PID: $SERVER_PID)"
    sleep 3
    
    if lsof -ti:5001 > /dev/null; then
        echo "   ✅ Server started successfully"
    else
        echo "   ⚠️  Server may still be starting..."
    fi
fi

echo ""
echo "3. Testing Connection..."
sleep 2
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "   ✅ Server is responding"
    
    if curl -s http://localhost:5001/api/gigs | grep -q "success"; then
        echo "   ✅ Database connection working"
        echo ""
        echo "🎉 Everything is running! Open http://localhost:5173/gigs"
    else
        echo "   ⚠️  Server running but database connection issue"
        echo "   Make sure MongoDB is running and try again"
    fi
else
    echo "   ❌ Server not responding yet"
    echo "   Wait a few seconds and refresh your browser"
fi

echo ""
echo "📝 To view server logs: tail -f /tmp/gigflow-server.log"
echo "📝 To stop server: kill \$(lsof -ti:5001)"
