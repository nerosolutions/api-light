const mysql = require("mysql2/promise");

var pool = mysql.createPool({
    host: 'concolato.mysql.uhserver.com',
    user: 'concolato',
    password: 'Concolato1.*2',
    database: 'concolato'
})

module.exports = pool;
