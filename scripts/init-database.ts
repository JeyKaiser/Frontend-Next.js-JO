/**
 * Database Initialization Script
 * Sets up SAP HANA database connection and validates schema
 */

import { testDatabaseConnection, getDatabaseHealth } from '../app/globals/lib/database';
import { GarmentProductionDAL } from '../app/globals/lib/dal/garment-production';

async function initializeDatabase() {
  console.log('='.repeat(60));
  console.log('SAP HANA Database Initialization');
  console.log('='.repeat(60));
  
  try {
    // Test basic connection
    console.log('\n1. Testing database connection...');
    const connectionTest = await testDatabaseConnection();
    
    if (!connectionTest.success) {
      console.error('❌ Connection test failed:', connectionTest.error);
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    console.log(`   Version: ${connectionTest.data?.[0]?.VERSION || 'Unknown'}`);
    console.log(`   Execution time: ${connectionTest.executionTime}ms`);
    
    // Get health information
    console.log('\n2. Checking database health...');
    const healthCheck = await getDatabaseHealth();
    
    if (healthCheck.success && healthCheck.data) {
      console.log('✅ Database health check passed');
      
      // Display health information
      healthCheck.data.forEach((result: any[], index: number) => {
        if (result && result.length > 0) {
          switch (index) {
            case 0:
              console.log(`   Database Version: ${result[0].VERSION}`);
              break;
            case 1:
              console.log(`   Active Connections: ${result[0].ACTIVE_CONNECTIONS || 0}`);
              break;
            case 2:
              console.log(`   Schema Tables: ${result[0].TABLE_COUNT || 0}`);
              break;
          }
        }
      });
    } else {
      console.warn('⚠️  Health check completed with warnings:', healthCheck.error);
    }
    
    // Test sample queries
    console.log('\n3. Testing data access layer...');
    
    // Test collections query
    console.log('   Testing collections query...');
    const collectionsTest = await GarmentProductionDAL.getColecciones(0, 5);
    if (collectionsTest.success) {
      console.log(`   ✅ Collections query successful (${collectionsTest.data?.length || 0} records)`);
    } else {
      console.log(`   ⚠️  Collections query failed: ${collectionsTest.error}`);
    }
    
    // Test phases query
    console.log('   Testing phases query...');
    const phasesTest = await GarmentProductionDAL.getFases();
    if (phasesTest.success) {
      console.log(`   ✅ Phases query successful (${phasesTest.data?.length || 0} records)`);
    } else {
      console.log(`   ⚠️  Phases query failed: ${phasesTest.error}`);
    }
    
    // Test users query
    console.log('   Testing users query...');
    const usersTest = await GarmentProductionDAL.getUsuariosByArea('DISEÑO');
    if (usersTest.success) {
      console.log(`   ✅ Users query successful (${usersTest.data?.length || 0} records in DISEÑO area)`);
    } else {
      console.log(`   ⚠️  Users query failed: ${usersTest.error}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Database initialization completed successfully!');
    console.log('='.repeat(60));
    
    console.log('\n📊 Summary:');
    console.log(`   - Connection: ✅ Active`);
    console.log(`   - Schema: GARMENT_PRODUCTION_CONTROL`);
    console.log(`   - Collections available: ${collectionsTest.success ? 'Yes' : 'No'}`);
    console.log(`   - Phases configured: ${phasesTest.success ? 'Yes' : 'No'}`);
    console.log(`   - Users configured: ${usersTest.success ? 'Yes' : 'No'}`);
    
    console.log('\n🚀 Ready for production!');
    console.log('\n💡 Next steps:');
    console.log('   1. Update your .env.local with correct database credentials');
    console.log('   2. Set USE_DIRECT_DATABASE=true to enable direct database access');
    console.log('   3. Test API endpoints: /api/database/health');
    console.log('   4. Access collections via: /api/collections');
    console.log('   5. Search references via: /api/references?search=PT001');
    
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase().catch((error) => {
    console.error('Initialization script failed:', error);
    process.exit(1);
  });
}

export default initializeDatabase;
