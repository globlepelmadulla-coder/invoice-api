function queryMySQL(pool, sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
}

module.exports = queryMySQL;