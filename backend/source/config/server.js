require("dotenv").config();

console.log("🚀 Iniciando servidor...");
console.log("Environment:", process.env.NODE_ENV || 'development');
console.log("Port:", process.env.PORT || 3000);

const app = require("../app");

const PORT = process.env.PORT || 3000;

// Tratamento de erros globais
process.on('uncaughtException', (error) => {
    console.error('❌ Erro não capturado:', error);
    // Não sair imediatamente para permitir graceful shutdown
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise rejeitada:', reason);
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`🏓 Health check: http://localhost:${PORT}/ping`);
});

// Graceful shutdown
const gracefulShutdown = () => {
    console.log('🔄 Recebido sinal de encerramento...');
    server.close(() => {
        console.log('✅ Servidor encerrado graciosamente');
        process.exit(0);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);