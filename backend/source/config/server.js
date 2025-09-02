require("dotenv").config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = process.env.PORTA || process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../../../frontend')));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/index.html'));
});

// API para testar banco e buscar nomes dos usuários
app.get('/api/testar-banco', async (req, res) => {
    try {
        console.log('Testando conexão com o banco...');
        
        // Testar conexão
        const connection = await pool.getConnection();
        console.log('Conexão estabelecida com sucesso!');
        
        // Buscar apenas os nomes dos usuários (campo 'nome' conforme a estrutura da tabela)
        const [rows] = await connection.execute('SELECT nome FROM USUARIOS');
        connection.release();
        
        console.log(`Encontrados ${rows.length} usuários na tabela`);
        
        // Extrair apenas os nomes
        const nomes = rows.map(row => row.nome);
        
        res.json({
            success: true,
            message: `Conexão com banco estabelecida! Encontrados ${rows.length} usuários.`,
            nomes: nomes
        });
        
    } catch (error) {
        console.error('Erro ao conectar com o banco:', error);
        
        res.status(500).json({
            success: false,
            error: 'Erro ao conectar com o banco de dados: ' + error.message
        });
    }
});

// API para login (placeholder - pode ser implementada posteriormente)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Por enquanto, retorna erro para implementação futura
    res.status(401).json({
        success: false,
        message: 'Funcionalidade de login ainda não implementada'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

module.exports = app;