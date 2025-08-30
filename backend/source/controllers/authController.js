const bcrypt = require("bcrypt");

// só para teste, estou fingindo que a hash que veio do banco (senha "1234")
const hashDoBanco = "$2b$10$z1DkzB8cft5hG6fN0fhx..8sLQzVgHZF7bS3V/5LQZ5rF1bH5dGvK";

exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log("📩 Dados recebidos no login:", req.body);

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios!" });
    }

    try {
        // versão mockada (por enquanto)
        const senhaCorreta = await bcrypt.compare(password, hashDoBanco);

        if (!senhaCorreta) {
            return res.status(401).json({ error: "Credenciais inválidas!" });
        }

        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login bem-sucedido!",
            token
        });

        // (quando o banco estiver pronto):
        /*
        const db = require("../config/db"); // exemplo de conexão
        const [rows] = await db.query("SELECT senha FROM usuarios WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciais inválidas"});
        }

        const hashDoBanco = rows[0].senha;
        const senhaCorreta = await bcrypt.compare(password, hashDoBanco);

        if (senhaCorreta) {
            return res.json({ message: "Login bem-sucedido!" });
        } else {
            return res.status(401).json({ error: "Erro interno do servidor" });    
        }
        */


    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

exports.register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios!" });
    }

    try {
        // gera o hash da senha
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        // por enquanto só retorna, depois aqui vai passar para o banco
        return res.status(201).json({
            message: "Usuário registrado com sucesso (mock)!",
            email,
            senhaHash: hash
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao registrar usuário" });
    }
}