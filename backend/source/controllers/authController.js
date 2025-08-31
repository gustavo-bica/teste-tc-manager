const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


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