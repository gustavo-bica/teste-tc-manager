// Coloque este console.log como a PRIMEIRA linha do arquivo para depurar
console.log(`Ambiente atual (NODE_ENV): ${process.env.NODE_ENV}`);

// Carrega o .env APENAS se não estiver em produção
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mysql = require('mysql2/promise');

// Adicione estes logs para ver o que o código está tentando usar
console.log(`Tentando conectar ao host: ${process.env.BD_HOST}`);
console.log(`Usando a porta: ${process.env.BD_PORT}`);

const pool = mysql.createPool({
  host: process.env.BD_HOST,
  user: process.env.BD_USER,
  password: process.env.BD_PASSWORD,
  database: process.env.BD_DATABASE,
  port: process.env.BD_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Se o seu banco de dados na nuvem exigir SSL, descomente a linha abaixo
  //*ssl: { rejectUnauthorized: false } // <--- DESCOMENTE ESTA LINHA
});

module.exports = pool;