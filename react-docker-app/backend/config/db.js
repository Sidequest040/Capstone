const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'db',  // Docker service name for MySQL
  user: 'root',
  password: 'your_new_password',
  database: 'my_new_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
