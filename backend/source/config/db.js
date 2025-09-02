require("dotenv").config();
const mysql = require('mysql2/promise');

console.log("Conectando ao MySQL local...");
console.log("HOST:", process.env.BD_HOST);
console.log("PORT:", process.env.BD_PORT);
console.log("USER:", process.env.BD_USER);
console.log("DB_NAME:", process.env.BD_DATABASE);

const pool = mysql.createPool({
  host: process.env.BD_HOST,
  user: process.env.BD_USER,
  password: process.env.BD_PASSWORD,
  database: process.env.BD_DATABASE,
  port: process.env.BD_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Pool de conexões com o MySQL local criado com sucesso!');

module.exports = pool;