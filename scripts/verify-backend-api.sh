#!/bin/bash
# Backend API verification script
# Tests connectivity to Medusa backend (local or Render DEV)

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${MEDUSA_BACKEND_URL:-https://marketplace-b2b-backend-dev.onrender.com}"
PUBLISHABLE_KEY="${MEDUSA_PUBLISHABLE_KEY:-pk_15f89d436badff43c2366d014c88536fa0307e92aeaeab294a2ee1d29710e1b9}"

echo "=========================================="
echo "Backend API Verification"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Health check
echo -n "1. Testing health endpoint... "
if curl -s -f "$BASE_URL/health" > /dev/null; then
  echo -e "${GREEN}✓ OK${NC}"
else
  echo -e "${RED}✗ FAILED${NC}"
  exit 1
fi

# Test 2: Store regions (requires publishable key)
echo -n "2. Testing store/regions endpoint... "
if curl -s -f -H "x-publishable-api-key: $PUBLISHABLE_KEY" "$BASE_URL/store/regions" > /dev/null; then
  echo -e "${GREEN}✓ OK${NC}"
else
  echo -e "${RED}✗ FAILED${NC}"
  exit 1
fi

# Test 3: Store custom endpoint
echo -n "3. Testing store/custom endpoint... "
if curl -s -f -H "x-publishable-api-key: $PUBLISHABLE_KEY" "$BASE_URL/store/custom" > /dev/null; then
  echo -e "${GREEN}✓ OK${NC}"
else
  echo -e "${RED}✗ FAILED (check if endpoint exists)${NC}"
fi

echo ""
echo -e "${GREEN}✓ Backend API is operational${NC}"
echo ""
echo "Frontend configuration:"
echo "  NEXT_PUBLIC_MERCUR_STORE_API=$BASE_URL/store"
echo "  NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY=$PUBLISHABLE_KEY"
