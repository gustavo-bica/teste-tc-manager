const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const alunoRoutes = require("./routes/alunoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const trabalhoRoutes = require("./routes/trabalhoRoutes");
const avaliacaoBancaRoutes = require("./routes/avaliacaoBancaRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(bodyParser.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// passa o router importado
app.use("/alunos", alunoRoutes);
app.use("/cursos", cursoRoutes);
app.use("/professores", professorRoutes);
app.use("/trabalhos", trabalhoRoutes);
app.use("/avaliacoes", avaliacaoBancaRoutes);
app.use("/api", authRoutes);

app.get("/ping", (req, res) => res.json({ message: "pong 🏓" }));

// Rota para servir o index.html na raiz
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Catch-all para outras rotas não encontradas - redireciona para index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

module.exports = app;