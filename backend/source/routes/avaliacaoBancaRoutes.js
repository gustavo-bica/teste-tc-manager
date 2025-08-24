const express = require("express");
const router = express.Router();
const abController = require("../controllers/avaliacaoBancaController");

router.get("/", abController.getAll);
router.get("/:id", abController.getById);
router.post("/", abController.create);
router.put("/:id", abController.update);
router.delete("/:id", abController.delete);

module.exports = router;