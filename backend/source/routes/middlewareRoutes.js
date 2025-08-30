const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/perfil", authMiddleware, (req, res) => {
    res.json({
        message: "Acesso permitido!",
        user: req.user
    });
});

module.exports = router;