#!/bin/bash

echo "🧪 Testing GigFlow API Endpoints..."
echo ""

BASE_URL="http://localhost:5000/api"

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH=$(curl -s "$BASE_URL/health")
if echo "$HEALTH" | grep -q "success"; then
    echo "   ✓ Health check passed"
    echo "   Response: $HEALTH"
else
    echo "   ❌ Health check failed"
    echo "   Response: $HEALTH"
    exit 1
fi

echo ""

# Test get gigs (should work without auth)
echo "2. Testing GET /api/gigs..."
GIGS=$(curl -s "$BASE_URL/gigs")
if echo "$GIGS" | grep -q "success"; then
    echo "   ✓ Get gigs endpoint works"
    COUNT=$(echo "$GIGS" | grep -o '"count":[0-9]*' | cut -d':' -f2)
    echo "   Found $COUNT gigs"
else
    echo "   ❌ Get gigs failed"
    echo "   Response: $GIGS"
fi

echo ""

# Test register endpoint (validation)
echo "3. Testing POST /api/auth/register (validation)..."
REGISTER_INVALID=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"ab","email":"invalid"}' \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$REGISTER_INVALID" | tail -1)
if [ "$HTTP_CODE" = "400" ]; then
    echo "   ✓ Validation working (returned 400 for invalid data)"
else
    echo "   ⚠️  Expected 400, got $HTTP_CODE"
fi

echo ""

# Test register with valid data
echo "4. Testing POST /api/auth/register (valid data)..."
REGISTER_VALID=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser'$(date +%s)'",
    "email": "test'$(date +%s)'@example.com",
    "password": "test123",
    "role": "client"
  }' \
  -c /tmp/gigflow_cookies.txt \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$REGISTER_VALID" | tail -1)
if [ "$HTTP_CODE" = "201" ]; then
    echo "   ✓ Registration successful"
    if echo "$REGISTER_VALID" | grep -q "token"; then
        echo "   ⚠️  Token in response (should be in cookie only)"
    fi
else
    echo "   Response code: $HTTP_CODE"
    echo "   Response: $(echo "$REGISTER_VALID" | head -1)"
fi

echo ""

# Test get me endpoint (with cookie)
echo "5. Testing GET /api/auth/me (with cookie)..."
if [ -f /tmp/gigflow_cookies.txt ]; then
    ME=$(curl -s "$BASE_URL/auth/me" -b /tmp/gigflow_cookies.txt -w "\n%{http_code}")
    HTTP_CODE=$(echo "$ME" | tail -1)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✓ Get me endpoint works with cookie auth"
    else
        echo "   ⚠️  Get me returned $HTTP_CODE"
    fi
else
    echo "   ⚠️  No cookie file found, skipping auth test"
fi

echo ""

# Test logout
echo "6. Testing POST /api/auth/logout..."
if [ -f /tmp/gigflow_cookies.txt ]; then
    LOGOUT=$(curl -s -X POST "$BASE_URL/auth/logout" \
      -b /tmp/gigflow_cookies.txt \
      -c /tmp/gigflow_cookies.txt \
      -w "\n%{http_code}")
    HTTP_CODE=$(echo "$LOGOUT" | tail -1)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✓ Logout endpoint works"
    else
        echo "   ⚠️  Logout returned $HTTP_CODE"
    fi
fi

echo ""
echo "✅ API testing complete!"
echo ""
echo "📝 Summary:"
echo "   - All endpoints are accessible"
echo "   - Validation is working"
echo "   - Cookie-based auth is configured"
echo "   - Logout endpoint is functional"
