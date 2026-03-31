const { getLocalConnection, getMySQLPool } = require('./dbConnections');
const syncInvoice = require('./syncInvoice');

async function main() {
    console.log('\n========================================');
    console.log('     INVOICE SYNC SYSTEM STARTING');
    console.log('========================================\n');
    
    const localDb = await getLocalConnection();
    const mysqlPool = getMySQLPool();
    
    await syncInvoice(localDb, mysqlPool);
    
    localDb.close();
    mysqlPool.end();
    
    console.log('\n========================================');
    console.log('     SYNC COMPLETED');
    console.log(`     Time: ${new Date().toLocaleString()}`);
    console.log('========================================\n');
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});