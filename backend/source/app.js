const express = require("express");
const app = express();

const alunoRoutes = require("./routes/alunoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const trabalhoRoutes = require("./routes/trabalhoRoutes");
const avaliacaoBancaRoutes = require("./routes/avaliacaoBancaRoutes");

app.use(express.json());

// aqui passa o router IMPORTADO diretamente
app.use("/alunos", alunoRoutes);
app.use("/cursos", cursoRoutes);
app.use("/professores", professorRoutes);
app.use("/trabalhos", trabalhoRoutes);
app.use("/avaliacoes", avaliacaoBancaRoutes);

app.get("/ping", (req, res) => res.json({ message: "pong 🏓" }));

module.exports = app;