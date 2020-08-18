const db = require("./configuration");

const Pool = require("pg").Pool;
module.exports = new Pool({
    user: db.user,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port
})
