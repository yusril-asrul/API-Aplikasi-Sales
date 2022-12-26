const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validationResult = require('../utils/validationResult');
const { login } = require('../controller/auth')

// Validate Request
const validationLogin = [
    body('username').isString().withMessage('username is required').notEmpty(),
    body('password').isString().withMessage('password is required').notEmpty()
]

// Router
router.post("/login",validationLogin,validationResult, login);

module.exports = router;