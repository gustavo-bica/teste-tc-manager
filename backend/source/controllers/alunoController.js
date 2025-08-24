const Aluno = require("../models/alunoModel");

exports.getAll = (req, res) => {
    Aluno.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err});
        res.json(results);
    });
};

exports.getById = (req, res) => {
  Aluno.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0] || {});
  });
};

exports.create = (req, res) => {
  Aluno.create(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: results.insertId, ...req.body });
  });
};

exports.update = (req, res) => {
  Aluno.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Aluno atualizado com sucesso!" });
  });
};

exports.delete = (req, res) => {
  Aluno.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Aluno removido com sucesso!" });
  });
};