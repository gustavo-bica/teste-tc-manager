const mysql = require("mysql2");

// Configuração com timeout e SSL para produção
const connectionConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "tc_manager",
    connectTimeout: 10000,  // 10 segundos
    acquireTimeout: 10000,
    timeout: 10000,
    reconnect: true,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

console.log(`🔗 Tentando conectar ao MySQL: ${connectionConfig.host}:${connectionConfig.port}`);

const conn = mysql.createConnection(connectionConfig);

// Conectar de forma assíncrona para não travar a aplicação
conn.connect((err) => {
    if (err) {
        console.error("❌ Erro ao conectar ao MySQL:", err.code || err.message);
        console.log("⚠️ Aplicação continuará sem banco de dados");
        // NÃO retorna para não travar a aplicação
    } else {
        console.log("✅ Conectado ao MySQL com sucesso!");
    }
});

// Tratar erros de conexão perdida
conn.on('error', (err) => {
    console.error('❌ Erro na conexão MySQL:', err.code || err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('🔄 Tentando reconectar...');
    }
});

module.exports = conn;