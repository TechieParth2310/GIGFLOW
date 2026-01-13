#!/bin/bash

echo "🔍 Verifying GigFlow Setup..."
echo ""

# Check server dependencies
echo "1. Checking server dependencies..."
if [ -d "server/node_modules" ]; then
    echo "   ✓ Server dependencies installed"
else
    echo "   ❌ Server dependencies NOT installed"
    exit 1
fi

# Check client dependencies
echo "2. Checking client dependencies..."
if [ -d "client/node_modules" ]; then
    echo "   ✓ Client dependencies installed"
else
    echo "   ❌ Client dependencies NOT installed"
    exit 1
fi

# Check server .env
echo "3. Checking server .env file..."
if [ -f "server/.env" ]; then
    echo "   ✓ Server .env file exists"
else
    echo "   ❌ Server .env file missing"
    exit 1
fi

# Check client .env
echo "4. Checking client .env file..."
if [ -f "client/.env" ]; then
    echo "   ✓ Client .env file exists"
else
    echo "   ❌ Client .env file missing"
    exit 1
fi

# Check server syntax
echo "5. Checking server code syntax..."
cd server
for file in src/**/*.js; do
    if ! node -c "$file" 2>/dev/null; then
        echo "   ❌ Syntax error in $file"
        exit 1
    fi
done
echo "   ✓ All server files have valid syntax"
cd ..

# Check if MongoDB connection string is set
echo "6. Checking MongoDB configuration..."
if grep -q "MONGODB_URI" server/.env; then
    echo "   ✓ MongoDB URI configured"
    MONGODB_URI=$(grep MONGODB_URI server/.env | cut -d '=' -f2)
    echo "   📍 URI: $MONGODB_URI"
else
    echo "   ❌ MongoDB URI not found in .env"
    exit 1
fi

# Check client build
echo "7. Checking client build..."
cd client
if npm run build > /dev/null 2>&1; then
    echo "   ✓ Client builds successfully"
else
    echo "   ❌ Client build failed"
    exit 1
fi
cd ..

echo ""
echo "✅ All checks passed! Setup looks good."
echo ""
echo "📝 Next steps:"
echo "   1. Make sure MongoDB is running"
echo "   2. Run 'npm run dev' to start both server and client"
echo "   3. Server will run on http://localhost:5000"
echo "   4. Client will run on http://localhost:5173"
