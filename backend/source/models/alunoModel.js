const db = require("../database/connection");

const Aluno = {
    getAll: (callback) => {
        db.query("SELECT * FROM ALUNOS", callback);
    },

    getById: (id, callback) => {
        db.query("SELECT * FROM ALUNOS WHERE id_aluno = ?", [id], callback);
    },

    create: (data, callback) => {
        const { nome, email, id_curso } = data;
        db.query("INSERT INTO ALUNOS (nome, email, id_curso) VALUES (?, ?, ?)"
            [nome, email, id_curso], callback
        );
    },

    update: (id, data, callback) => {
        const { nome, email, id_curso } = data;
        db.query("UPDATE ALUNOS SET nome = ?, email = ?, id_curso = ? WHERE id_aluno = ?",
            [nome, email, id_curso, id],
            callback
        );
    },

    delete: (id, callback) => {
        db.query("DELETE FROM ALUNOS WHERE id_aluno = ?", [id], callback);
    }
};

module.exports = Aluno;