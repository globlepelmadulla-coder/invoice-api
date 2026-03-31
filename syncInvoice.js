const queryMySQL = require('./queryHelper');

async function syncInvoice(localDb, mysqlPool) {
    const tableName = 'INVOICE_HDR';
    const primaryKeys = ['SysInvNO'];
    const syncColumn = 'TrnYes';
    
    console.log(`\n=== Syncing ${tableName} ===`);
    
    try {
        const records = await localDb.query(`SELECT * FROM ${tableName} WHERE ${syncColumn} = 0`);
        
        const recordsToSync = records.filter(row => 
            typeof row === 'object' && row !== null && !('statement' in row)
        );
        
        console.log(`Found ${recordsToSync.length} records to sync`);
        
        if (recordsToSync.length === 0) return;
        
        let successCount = 0;
        
        for (const record of recordsToSync) {
            try {
                const whereClause = primaryKeys.map(key => `${key} = ?`).join(' AND ');
                const whereValues = primaryKeys.map(key => record[key]);
                
                const existing = await queryMySQL(
                    mysqlPool,
                    `SELECT * FROM ${tableName} WHERE ${whereClause}`,
                    whereValues
                );
                
                if (existing && existing.length > 0) {
                    await queryMySQL(
                        mysqlPool,
                        `UPDATE ${tableName} SET ? WHERE ${whereClause}`,
                        [record, ...whereValues]
                    );
                } else {
                    await queryMySQL(
                        mysqlPool,
                        `INSERT INTO ${tableName} SET ?`,
                        [record]
                    );
                }
                
                await localDb.query(
                    `UPDATE ${tableName} SET ${syncColumn} = 1 WHERE ${whereClause}`,
                    whereValues
                );
                
                successCount++;
                
                if (successCount % 10 === 0) {
                    console.log(`  Progress: ${successCount}/${recordsToSync.length}`);
                }
                
            } catch (err) {
                console.log(`  Error on record ${record.SysInvNO}: ${err.message}`);
            }
        }
        
        console.log(`✓ Completed: ${successCount} synced`);
        
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

module.exports = syncInvoice;