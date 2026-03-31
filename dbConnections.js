const odbc = require('odbc');
const mysql = require('mysql');
const config = require('./config');

async function getLocalConnection() {
    const connString = `DRIVER={SQL Server};SERVER=${config.localDB.server};DATABASE=${config.localDB.database};UID=${config.localDB.uid};PWD=${config.localDB.pwd};`;
    console.log('Connecting to SQL Server...');
    const connection = await odbc.connect(connString);
    console.log('✓ Connected to SQL Server');
    return connection;
}

function getMySQLPool() {
    const pool = mysql.createPool(config.mysqlDB);
    console.log('✓ MySQL pool created');
    return pool;
}

module.exports = { getLocalConnection, getMySQLPool };