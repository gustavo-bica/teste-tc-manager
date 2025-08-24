const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");

router.get("/", professorController.getAll);
router.get("/:id", professorController.getById);
router.post("/", professorController.create);
router.put("/:id", professorController.update);
router.delete("/:id", professorController.delete);

module.exports = router;