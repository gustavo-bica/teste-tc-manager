const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// const db = require("../config/db"); // Comentado temporariamente

// armazenamento de tokens temporários (ideial seria na tabela do BD)
let resetTokens = {};

// LOGIN - Versão temporária sem banco de dados
exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log("📩 Dados recebidos no login:", req.body);

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios!" });
    }

    try {
        // Usuário de teste temporário (sem banco)
        const usuarioTeste = {
            id_usuario: 1,
            email: "teste@teste.com",
            senha: "$2b$10$rVZN7F8QGfqgZJjJQYHZpeZ8KFpXxQTZJQYH0L1QYH0L1QYH0L1Q", // senha: "123456"
            nome: "Usuário Teste"
        };

        // Verificar se o email corresponde ao usuário de teste
        if (email !== usuarioTeste.email) {
            return res.status(401).json({ error: "Credenciais inválidas!" });
        }

        // Para facilitar o teste, aceitar qualquer senha por enquanto
        // TODO: Descomentar quando tiver banco funcionando
        // const senhaCorreta = await bcrypt.compare(password, usuarioTeste.senha);
        // if (!senhaCorreta) {
        //     return res.status(401).json({ error: "Credenciais inválidas!" });
        // }

        // gera o token
        const token = jwt.sign(
            { id: usuarioTeste.id_usuario, email: usuarioTeste.email },
            process.env.JWT_SECRET || "chave-secreta-temporaria",
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login bem-sucedido!",
            token
        });

    } catch (err) {
        console.error("Erro no login:", err);
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }

};


// REGISTER - Temporariamente desabilitado (sem banco)
exports.register = async (req, res) => {
    return res.status(503).json({ 
        error: "Funcionalidade temporariamente indisponível. Banco de dados não configurado." 
    });
};

// REDEFINIR SENHA - Temporariamente desabilitado (sem banco)
exports.redefinirSenha = async (req, res) => {
    return res.status(503).json({ 
        error: "Funcionalidade temporariamente indisponível. Banco de dados não configurado." 
    });
};

// ESQUECI A SENHA - Temporariamente desabilitado (sem banco)
exports.esqueciSenha = async (req, res) => {
    return res.status(503).json({ 
        error: "Funcionalidade temporariamente indisponível. Banco de dados não configurado." 
    });
};