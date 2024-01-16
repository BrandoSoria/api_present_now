const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'monorail.proxy.rlwy.net',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '3-H24D61gG5d-45Cfgf1165E1G6Bdb55',
  database: process.env.MYSQLDATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000, // Tiempo de espera en milisegundos (por ejemplo, 60 segundos)

});

// Manejar errores de conexión
pool.getConnection()
  .then(connection => {
    console.log('Conexión exitosa a la base de datos.');

    // Realiza tus operaciones con la base de datos aquí.

    connection.release(); // Devuelve la conexión a la pool cuando hayas terminado.
  })
  .catch(error => {
    console.error('Error de conexión:', error.message);
  });

module.exports = pool;
