const fs = require('fs');

function getDatabaseName() {
    try {
        const filePath = 'C:\\sync\\db.txt';
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8').trim();
        }
    } catch (error) {
        console.log('Error reading db.txt:', error.message);
    }
    return 'cspMaster';  // AWS database name
}

module.exports = {
    localDB: {
        server: 'localhost\\CSPSOFT',
        database: 'cspMaster',
        uid: 'sa',
        pwd: 'slmserver'
    },
    mysqlDB: {
        host: 'database-3.c7g8oo8wspgs.ap-southeast-1.rds.amazonaws.com',  // AWS RDS
        user: 'admin',
        password: 'slmserver',
        database: getDatabaseName()
    }
};