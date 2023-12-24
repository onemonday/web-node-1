const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: '125200',
    host: "localhost",
    port: 5432,
    database: "web"
})

module.exports = pool