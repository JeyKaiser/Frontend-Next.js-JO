/**
 * Test script for User Management API
 * Run with: node scripts/test-user-api.js
 */

const backendUrI = process.env.NEXT_PUBLIC_BACKEND_URL;

const API_BASE_URL = backendUrI || 'http://localhost:3000/api';

async function testAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`\n🧪 Testing ${options.method || 'GET'} ${endpoint}`);
  console.log('📤 Request:', {
    url,
    method: options.method || 'GET',
    body: options.body ? JSON.parse(options.body) : undefined
  });
  
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    console.log('📥 Response:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
    return { response, data };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { error };
  }
}

async function runTests() {
  console.log('🚀 Starting User Management API Tests');
  console.log('=''.repeat(50));
  
  // Test 1: Get user options
  await testAPI('/users/options');
  
  // Test 2: Get all users (with pagination)
  await testAPI('/users?limit=5');
  
  // Test 3: Search users
  await testAPI('/users/search?q=JO&limit=3');
  
  // Test 4: Get users by area
  await testAPI('/users?area=DISEÑO&limit=3');
  
  // Test 5: Create a test user
  const testUser = {
    CODIGO_USUARIO: 'TEST001',
    NOMBRE_COMPLETO: 'Usuario de Prueba',
    EMAIL: 'test@example.com',
    AREA: 'DISEÑO',
    ROL: 'DISEÑADOR',
    ESTADO: 'ACTIVO'
  };
  
  const createResult = await testAPI('/users', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  // If user creation was successful, test other operations
  if (createResult.data && createResult.data.success) {
    // We need to get the user ID first
    const searchResult = await testAPI('/users/search?q=TEST001&exact=true');
    
    if (searchResult.data && searchResult.data.data && searchResult.data.data.length > 0) {
      const userId = searchResult.data.data[0].ID_USUARIO;
      
      // Test 6: Get specific user
      await testAPI(`/users/${userId}`);
      
      // Test 7: Update user
      await testAPI(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
          NOMBRE_COMPLETO: 'Usuario de Prueba Actualizado',
          EMAIL: 'test.updated@example.com'
        })
      });
      
      // Test 8: Delete user (soft delete)
      await testAPI(`/users/${userId}`, {
        method: 'DELETE'
      });
      
      console.log('\n✅ All tests completed! Check the responses above.');
    } else {
      console.log('\n⚠️  Could not find created user for further testing.');
    }
  } else {
    console.log('\n⚠️  User creation failed, skipping dependent tests.');
    console.log('\n📝 Note: This might be expected if:');
    console.log('   - Database is not connected');
    console.log('   - User TEST001 already exists');
    console.log('   - Required environment variables are not set');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test suite finished');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAPI, runTests };