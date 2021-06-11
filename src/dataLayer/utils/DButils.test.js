require("dotenv").config();
const sql = require("mssql");

const config = {
    user: process.env.tedious_userName,
    password: process.env.tedious_password,
    server: process.env.tedious_server,
    database: process.env.tedious_database,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

async function execQuery(query) {
    await poolConnect;
    try {
        var result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error("SQL error", err);
        throw err;
    }
};

async function getTableSize(tableName) {
    let length = await execQuery(
        `SELECT COUNT(*) AS LEN FROM ${tableName};`
    );

    return (length[0])["LEN"];
}

exports.getTableSize = getTableSize;
exports.execQuery = execQuery;
// process.on("SIGINT", function () {
//   if (pool) {
//     pool.close(() => console.log("connection pool closed"));
//   }
// });

// poolConnect.then(() => {
//   console.log("pool closed");

//   return sql.close();
// });

// exports.execQuery = function (query) {
//   return new Promise((resolve, reject) => {
//     sql
//       .connect(config)
//       .then((pool) => {
//         return pool.request().query(query);
//       })
//       .then((result) => {
//         // console.log(result);
//         sql.close();
//         resolve(result.recordsets[0]);
//       })
//       .catch((err) => {
//         // ... error checks
//       });
//   });
// };