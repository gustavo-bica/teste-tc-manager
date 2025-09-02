const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../config/db");

// armazenamento de tokens temporários (ideial seria na tabela do BD)
let resetTokens = {};

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log("📩 Dados recebidos no login:", req.body);

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios!" });
    }

    try {
        // buscar o user pelo email
        const [rows] = await db.query("SELECT * FROM USUARIOS WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciais inválidas!" });
        }

        const usuario = rows[0];

        // confere a senha (precisa adicionar uma coluna para isso no db)
        const senhaCorreta = await bcrypt.compare(password, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: "Credenciais inválidas! "});
        }

        // gera o token
        const token = jwt.sign(
            { id: usuario.id_usuario, email: usuario.email },
            process.env.JWT_SECRET,
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


// REGISTER
exports.register = async (req, res) => {
    const { nome, email, password, id_tipo_usuario, id_curso } = req.body;

    if (!email || !password || !id_tipo_usuario) {
        return res.status(400).json({ error: "Nome, email, senha e tipo de usuários são obrigatórios!" });
    }

    try {
        // gera o hash da senha
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        // insere no banco
        const [result] = await db.query(
            "INSERT INTO USUARIOS (nome, email, senha, id_tipo_usuario, id_curso) VALUES (?, ?, ?, ?, ?)",
            [nome, email, hash, id_tipo_usuario, id_curso || null]
        );

        return res.status(201).json({
            message: "Usuário registrado com sucesso!",
            id_usuario: result.insertId,
            email
        });


    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao registrar usuário" });
    }
};

// REDEFINIR SENHA
exports.redefinirSenha = async (req, res) => {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
        return res.status(400).json({ error: "Token e nova senha são obrigatórios!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // valida o token

        // confere se ainda é válido em memória
        if (!resetTokens[decoded.email] || resetTokens[decoded.email] !== token) {
            return res.status(400).json({ error: "Token inválido ou expirado! "});
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(novaSenha, saltRounds);

        await db.query("UPDATE USUARIOS SET senha = ? WHERE email = ?", [hash, decoded.email]);

        // remove o token da lista
        delete resetTokens[decoded.email];

        return res.json({ message: "Senha redefinida com sucesso!" });

    } catch (err) {
        console.error("Erro no redefinirSenha", err);
        return res.status(500).json({ error: "Erro ao redefinir senha." })
    }
};

// ESQUECI A SENHA
exports.esqueciSenha = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email é obrigatório! "});

    try {
        // verifica se o usuário existe
        const [rows] = await db.query("SELECT * FROM USUARIOS WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Email não encontrado! "});
        }

        const usuario = rows[0];
        
        // gera token temporário
        const token = jwt.sign(
            { id: usuario.id_usurio, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "10m" } // expira em 10 minutos
        );

        // salva o token na memória
        resetTokens[email] = token;

        // link para redefinir (TODO: ajustar para o endereço correto do front)
        const resetLink = `${process.env.FRONTEND_URL}/reset-passoword?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        // monta o email e envia
        await transporter.sendMail({
            from: `"Suporte TC-Manager <${process.env.EMAIL_USER}>`,
            to: usuario.email,
            subject: "Redefinição de Senha",
            html: `
            <h3>Redefinição de Senha</h3>
            <p>Você solicitou a redefinição de senha. Clique no link abaixo para continuar:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Este link expira em 10 minutos.</p>
            `
        });

        return res.json({ message: "Email de redefinição enviado!" });

    } catch (err) {
        console.error("Erro no esqueciSenha:", err);
        return res.status(500).json({ error: "Erro ao processar solicitação" });
    }
};