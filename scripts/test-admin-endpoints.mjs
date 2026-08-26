#!/usr/bin/env node

/**
 * Test Admin Endpoints
 * 
 * Tests various admin endpoints to verify their status
 */

const BACKEND_URL = 'https://marketplace-b2b-backend-dev.onrender.com';
const ADMIN_EMAIL = 'admin@carrefour.dev';
const ADMIN_PASSWORD = 'supersecret';

async function login() {
  console.log('🔐 Logging in as admin...');
  
  const response = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Login successful\n');
  return data.token;
}

async function testEndpoint(path, token, description) {
  console.log(`\n📡 Testing: ${description}`);
  console.log(`   Endpoint: GET ${path}`);
  
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const statusEmoji = response.ok ? '✅' : '❌';
    console.log(`   Status: ${statusEmoji} ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
      return { success: true, status: response.status, data };
    } else {
      const text = await response.text();
      console.log(`   Error: ${text.substring(0, 200)}`);
      return { success: false, status: response.status, error: text };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Testing Admin Endpoints - Render DEV');
  console.log('='.repeat(60));

  try {
    const token = await login();

    const endpoints = [
      { path: '/admin/users/me', description: 'Get current admin user' },
      { path: '/admin/sellers', description: 'List sellers (MercurJS)' },
      { path: '/admin/customers', description: 'List franchisees/customers' },
      { path: '/admin/customers?limit=5', description: 'List customers (limited)' },
    ];

    const results = {};

    for (const endpoint of endpoints) {
      results[endpoint.path] = await testEndpoint(endpoint.path, token, endpoint.description);
    }

    // Test specific seller ID if we can get sellers list
    if (results['/admin/sellers']?.success && results['/admin/sellers'].data?.sellers?.length > 0) {
      const sellerId = results['/admin/sellers'].data.sellers[0].id;
      console.log(`\n   Found seller ID: ${sellerId}`);
      results[`/admin/sellers/${sellerId}`] = await testEndpoint(
        `/admin/sellers/${sellerId}`,
        token,
        'Get seller detail'
      );
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    
    for (const [path, result] of Object.entries(results)) {
      const status = result.success ? `✅ ${result.status}` : `❌ ${result.status || 'ERROR'}`;
      console.log(`${status} - ${path}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

main();
