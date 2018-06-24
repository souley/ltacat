const oracledb = require('oracledb');
const dbConfig = require('./db-config.js');

// open connection pool
async function initialize() {
  await oracledb.createPool(dbConfig.hrPool);
}
module.exports.initialize = initialize;

// close connection pool
async function close() {
  await oracledb.getPool().close();
}
module.exports.close = close;

// query will get a connection, execute a statement, and then close the
// connection in a single call.
exports.query = function (statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;
    let result;
    let err;
    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;
    try {
      conn = await oracledb.getConnection(dbConfig.hrPool);
      result = await conn.execute(statement, binds, opts);
      resolve(result.rows);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}
