const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// rota de login
router.post("/login", authController.login);

//rota de registro
router.post("/register", authController.register);

// rota de recuperação de senha (envio de email com link)
router.post("/esqueci-senha", authController.esqueciSenha);

// rota de redefinir senha (usa o token enviado no email)
router.post("/redefinir-senha", authController.redefinirSenha);


module.exports = router;