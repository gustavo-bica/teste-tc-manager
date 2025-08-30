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
        const senhaCorreta = await bcrypt.compare(password, hashDoBanco);

        if (senhaCorreta) {
            return res.json({ message: "Login bem-sucedido!" });
        } else {
            return res.status(401).json({ error: "Credenciais inválidas!" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};